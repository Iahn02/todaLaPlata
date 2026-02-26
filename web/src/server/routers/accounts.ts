import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { Account, Transaction } from "@prisma/client";

export const accountsRouter = router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
        // Obtenemos todas las cuentas y sumamos dinámicamente sus balances actuales
        // Para una app financiera seria, el balance es la suma del initialBalance + transacciones
        const accounts = await ctx.prisma.account.findMany({
            where: { userId: ctx.user.id },
            include: {
                transactions: true, // Incluimos transacciones para calcular el saldo real
            },
            orderBy: { createdAt: "asc" }
        });

        return accounts.map((acc: Account & { transactions: Transaction[] }) => {
            const txBalance = acc.transactions.reduce((accTotal: number, tx: Transaction) => {
                return tx.type === "income" ? accTotal + tx.amount : accTotal - tx.amount;
            }, 0);

            // Retornamos el objeto cuenta con el balance real calculado
            return {
                ...acc,
                realBalance: acc.balance + txBalance
            };
        });
    }),

    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1, "El nombre es requerido").max(40, "Nombre muy largo"),
                type: z.enum(["bank", "cash", "credit_card", "savings", "investment"]),
                balance: z.number().default(0),
                color: z.string().default("#6366f1"),
                icon: z.string().default("wallet"),
                includeInTotal: z.boolean().default(true),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.account.create({
                data: {
                    ...input,
                    userId: ctx.user.id,
                },
            });
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().min(1).max(40).optional(),
                type: z.enum(["bank", "cash", "credit_card", "savings", "investment"]).optional(),
                balance: z.number().optional(),
                color: z.string().optional(),
                icon: z.string().optional(),
                includeInTotal: z.boolean().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;

            const account = await ctx.prisma.account.findUnique({ where: { id } });
            if (!account || account.userId !== ctx.user.id) {
                throw new Error("Cuenta no encontrada o no autorizada");
            }

            return ctx.prisma.account.update({
                where: { id },
                data,
            });
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const account = await ctx.prisma.account.findUnique({ where: { id: input.id } });

            if (!account || account.userId !== ctx.user.id) {
                throw new Error("Cuenta no encontrada o no autorizada");
            }

            // Precaución: Al borrar una cuenta esto podría borrar en Cascada (onDelete: Cascade) o arrojar error dependiendo de tu Prisma Schema.
            // Para la aplicación, usamos Cascade en Transactions para 'account', 
            // Significa que borrar la cuenta borrará TODAS sus transacciones.
            return ctx.prisma.account.delete({
                where: { id: input.id },
            });
        }),
});
