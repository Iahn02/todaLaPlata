import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

function getNextDueDate(fromDate: Date, frequency: string): Date {
    const next = new Date(fromDate);
    switch (frequency) {
        case "daily":
            next.setDate(next.getDate() + 1);
            break;
        case "weekly":
            next.setDate(next.getDate() + 7);
            break;
        case "biweekly":
            next.setDate(next.getDate() + 14);
            break;
        case "monthly":
            next.setMonth(next.getMonth() + 1);
            break;
        case "yearly":
            next.setFullYear(next.getFullYear() + 1);
            break;
    }
    return next;
}

export const recurringRouter = router({
    // Obtener todas las recurrentes del usuario
    getAll: protectedProcedure.query(async ({ ctx }) => {
        return ctx.prisma.recurringTransaction.findMany({
            where: { userId: ctx.user.id },
            include: { category: true, account: true },
            orderBy: { nextDueDate: "asc" },
        });
    }),

    // Crear una nueva transacción recurrente
    create: protectedProcedure
        .input(
            z.object({
                amount: z.number().positive(),
                type: z.enum(["income", "expense"]),
                description: z.string().optional(),
                frequency: z.enum(["daily", "weekly", "biweekly", "monthly", "yearly"]),
                startDate: z.date().optional(),
                endDate: z.date().optional(),
                accountId: z.string().min(1),
                categoryId: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const start = input.startDate ?? new Date();
            return ctx.prisma.recurringTransaction.create({
                data: {
                    userId: ctx.user.id,
                    amount: input.amount,
                    type: input.type,
                    description: input.description,
                    frequency: input.frequency,
                    startDate: start,
                    endDate: input.endDate,
                    nextDueDate: start,
                    accountId: input.accountId,
                    categoryId: input.categoryId,
                },
            });
        }),

    // Activar/Desactivar
    toggle: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const rec = await ctx.prisma.recurringTransaction.findUnique({
                where: { id: input.id },
            });
            if (!rec || rec.userId !== ctx.user.id) {
                throw new Error("No encontrado o no autorizado");
            }
            return ctx.prisma.recurringTransaction.update({
                where: { id: input.id },
                data: { isActive: !rec.isActive },
            });
        }),

    // Eliminar
    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const rec = await ctx.prisma.recurringTransaction.findUnique({
                where: { id: input.id },
            });
            if (!rec || rec.userId !== ctx.user.id) {
                throw new Error("No encontrado o no autorizado");
            }
            return ctx.prisma.recurringTransaction.delete({
                where: { id: input.id },
            });
        }),

    // Procesar recurrentes vencidas — ejecutar transacciones pendientes
    processDue: protectedProcedure.mutation(async ({ ctx }) => {
        const now = new Date();
        const dueRecurrings = await ctx.prisma.recurringTransaction.findMany({
            where: {
                userId: ctx.user.id,
                isActive: true,
                nextDueDate: { lte: now },
            },
        });

        let processed = 0;

        for (const rec of dueRecurrings) {
            // Vencida? Si tiene endDate y ya pasó, desactivar
            if (rec.endDate && rec.endDate < now) {
                await ctx.prisma.recurringTransaction.update({
                    where: { id: rec.id },
                    data: { isActive: false },
                });
                continue;
            }

            // Crear la transacción real
            await ctx.prisma.transaction.create({
                data: {
                    userId: ctx.user.id,
                    amount: rec.amount,
                    type: rec.type,
                    description: `🔄 ${rec.description || "Recurrente"}`,
                    date: rec.nextDueDate,
                    accountId: rec.accountId,
                    categoryId: rec.categoryId,
                },
            });

            // Actualizar nextDueDate
            const nextDate = getNextDueDate(rec.nextDueDate, rec.frequency);
            await ctx.prisma.recurringTransaction.update({
                where: { id: rec.id },
                data: { nextDueDate: nextDate },
            });

            processed++;
        }

        return { processed };
    }),
});
