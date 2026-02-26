import { router, protectedProcedure } from "../trpc";

export const lookupsRouter = router({
    getEssentialData: protectedProcedure.query(async ({ ctx }) => {
        let accounts = await ctx.prisma.account.findMany({ where: { userId: ctx.user.id } });
        let categories = await ctx.prisma.category.findMany({ where: { userId: ctx.user.id } });

        // Auto-seed for existing users to guarantee they can create transactions
        if (accounts.length === 0) {
            const acc = await ctx.prisma.account.create({
                data: { name: "Efectivo", type: "cash", balance: 0, userId: ctx.user.id }
            });
            accounts = [acc];
        }
        if (categories.length === 0) {
            await ctx.prisma.category.createMany({
                data: [
                    { name: "Alimentación", color: "#f43f5e", icon: "utensils", type: "expense", userId: ctx.user.id },
                    { name: "Transporte", color: "#3b82f6", icon: "car", type: "expense", userId: ctx.user.id },
                    { name: "Compras", color: "#8b5cf6", icon: "shopping-bag", type: "expense", userId: ctx.user.id },
                    { name: "Sueldo", color: "#10b981", icon: "briefcase", type: "income", userId: ctx.user.id },
                ]
            });
            categories = await ctx.prisma.category.findMany({ where: { userId: ctx.user.id } });
        }

        return { accounts, categories };
    }),
});
