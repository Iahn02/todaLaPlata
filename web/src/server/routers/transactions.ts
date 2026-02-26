import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const transactionsRouter = router({
    // Obtener todas las transacciones del usuario logueado
    getAll: protectedProcedure.query(async ({ ctx }) => {
        return ctx.prisma.transaction.findMany({
            where: {
                userId: ctx.user.id,
            },
            include: {
                category: true,
                account: true,
            },
            orderBy: {
                date: "desc",
            },
        });
    }),

    // Crear una nueva transacción
    create: protectedProcedure
        .input(
            z.object({
                amount: z.number().positive("El monto debe ser positivo"),
                type: z.enum(["income", "expense", "transfer"]),
                description: z.string().optional(),
                date: z.date().optional(),
                accountId: z.string().min(1, "Debes seleccionar una cuenta"),
                categoryId: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.transaction.create({
                data: {
                    userId: ctx.user.id,
                    amount: input.amount,
                    type: input.type,
                    description: input.description,
                    date: input.date ?? new Date(),
                    accountId: input.accountId,
                    categoryId: input.categoryId,
                },
            });
        }),

    // Transferir dinero entre cuentas (Crea un Gasto y un Ingreso atómicamente)
    transfer: protectedProcedure
        .input(
            z.object({
                amount: z.number().positive("El monto debe ser positivo"),
                description: z.string().optional(),
                date: z.date().optional(),
                fromAccountId: z.string().min(1, "Selecciona cuenta de origen"),
                toAccountId: z.string().min(1, "Selecciona cuenta de destino"),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (input.fromAccountId === input.toAccountId) {
                throw new Error("No puedes transferir a la misma cuenta.");
            }

            const desc = input.description || "Transferencia";

            // Transacción atómica en DB
            return ctx.prisma.$transaction([
                // 1. Quitar dinero de la cuenta origen (Gasto)
                ctx.prisma.transaction.create({
                    data: {
                        userId: ctx.user.id,
                        amount: input.amount,
                        type: "expense",
                        description: `${desc} -> Destino`,
                        accountId: input.fromAccountId,
                        date: input.date ?? new Date(),
                    },
                }),
                // 2. Agregar dinero a la cuenta destino (Ingreso)
                ctx.prisma.transaction.create({
                    data: {
                        userId: ctx.user.id,
                        amount: input.amount,
                        type: "income",
                        description: `Destino <- ${desc}`,
                        accountId: input.toAccountId,
                        date: input.date ?? new Date(),
                    },
                }),
            ]);
        }),

    // Actualizar una transacción existente
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                data: z.object({
                    amount: z.number().positive().optional(),
                    type: z.enum(["income", "expense", "transfer"]).optional(),
                    description: z.string().optional(),
                    date: z.date().optional(),
                    accountId: z.string().optional(),
                    categoryId: z.string().optional(),
                }),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Verificar que la transacción le pertenezca al usuario
            const tx = await ctx.prisma.transaction.findUnique({
                where: { id: input.id },
            });

            if (!tx || tx.userId !== ctx.user.id) {
                throw new Error("Transacción no encontrada o no autorizada");
            }

            return ctx.prisma.transaction.update({
                where: { id: input.id },
                data: input.data,
            });
        }),

    // Eliminar una transacción
    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const tx = await ctx.prisma.transaction.findUnique({
                where: { id: input.id },
            });

            if (!tx || tx.userId !== ctx.user.id) {
                throw new Error("Transacción no encontrada o no autorizada");
            }

            return ctx.prisma.transaction.delete({
                where: { id: input.id },
            });
        }),
});
