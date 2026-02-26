import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const categoriesRouter = router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
        return ctx.prisma.category.findMany({
            where: { userId: ctx.user.id },
            orderBy: [{ type: "asc" }, { name: "asc" }],
        });
    }),

    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1, "El nombre es requerido").max(40, "Nombre muy largo"),
                icon: z.string().default("tag"),
                color: z.string().default("#8b5cf6"),
                type: z.enum(["income", "expense"]),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.category.create({
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
                icon: z.string().optional(),
                color: z.string().optional(),
                // we prevent type changing for category once created to maintain history consistency
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;

            const category = await ctx.prisma.category.findUnique({ where: { id } });
            if (!category || category.userId !== ctx.user.id) {
                throw new Error("Categoría no encontrada o no autorizada");
            }

            return ctx.prisma.category.update({
                where: { id },
                data,
            });
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const category = await ctx.prisma.category.findUnique({ where: { id: input.id } });

            if (!category || category.userId !== ctx.user.id) {
                throw new Error("Categoría no encontrada o no autorizada");
            }

            // Prisma está configurado con onDelete: Cascade en Budget y onDelete: SetNull en Transactions para Category.
            // Para asegurar la estabilidad financiera, simplemente la borramos, y prisma pondrá las de transaction como un-categorized (null).
            return ctx.prisma.category.delete({
                where: { id: input.id },
            });
        }),
});
