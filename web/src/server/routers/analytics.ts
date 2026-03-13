import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import {
    startOfMonth,
    endOfMonth,
    subMonths,
    format,
} from "date-fns";
import { es } from "date-fns/locale";

export const analyticsRouter = router({
    /**
     * Comparativa mes a mes: devuelve ingresos/gastos de los últimos N meses
     * con cálculos de variación porcentual respecto al mes anterior.
     */
    monthlyComparison: protectedProcedure
        .input(
            z
                .object({
                    months: z.number().min(2).max(24).default(12),
                })
                .optional()
        )
        .query(async ({ ctx, input }) => {
            const monthsCount = input?.months ?? 12;
            const now = new Date();

            // Fetch all transactions for the user within the range
            const startDate = startOfMonth(subMonths(now, monthsCount - 1));
            const transactions = await ctx.prisma.transaction.findMany({
                where: {
                    userId: ctx.user.id,
                    date: { gte: startDate },
                },
                include: { category: true },
                orderBy: { date: "asc" },
            });

            // Build monthly data
            const months = Array.from({ length: monthsCount }).map((_, i) => {
                const monthDate = subMonths(now, monthsCount - 1 - i);
                const start = startOfMonth(monthDate);
                const end = endOfMonth(monthDate);

                const monthTxs = transactions.filter((tx) => {
                    const d = new Date(tx.date);
                    return d >= start && d <= end;
                });

                const income = monthTxs
                    .filter((tx) => tx.type === "income")
                    .reduce((acc, tx) => acc + tx.amount, 0);
                const expense = monthTxs
                    .filter((tx) => tx.type === "expense")
                    .reduce((acc, tx) => acc + tx.amount, 0);

                return {
                    month: format(start, "MMM yy", { locale: es }).replace(
                        /^\w/,
                        (c) => c.toUpperCase()
                    ),
                    monthFull: format(start, "MMMM yyyy", {
                        locale: es,
                    }).replace(/^\w/, (c) => c.toUpperCase()),
                    income,
                    expense,
                    balance: income - expense,
                    savingsRate:
                        income > 0
                            ? Math.round(((income - expense) / income) * 100)
                            : 0,
                };
            });

            // Calculate percentage changes
            const withChanges = months.map((m, i) => {
                const prev = i > 0 ? months[i - 1] : null;
                return {
                    ...m,
                    incomeChange: prev?.income
                        ? Math.round(
                              ((m.income - prev.income) / prev.income) * 100
                          )
                        : null,
                    expenseChange: prev?.expense
                        ? Math.round(
                              ((m.expense - prev.expense) / prev.expense) * 100
                          )
                        : null,
                    balanceChange: prev
                        ? m.balance - prev.balance
                        : null,
                };
            });

            return withChanges;
        }),

    /**
     * Predicción de gastos: Usa promedio ponderado/tendencia lineal
     * para estimar gastos de los próximos N meses.
     */
    spendingForecast: protectedProcedure
        .input(
            z
                .object({
                    forecastMonths: z.number().min(1).max(6).default(3),
                    historyMonths: z.number().min(3).max(24).default(6),
                })
                .optional()
        )
        .query(async ({ ctx, input }) => {
            const forecastCount = input?.forecastMonths ?? 3;
            const historyCount = input?.historyMonths ?? 6;
            const now = new Date();
            const startDate = startOfMonth(subMonths(now, historyCount - 1));

            const transactions = await ctx.prisma.transaction.findMany({
                where: {
                    userId: ctx.user.id,
                    date: { gte: startDate },
                    type: "expense",
                },
                orderBy: { date: "asc" },
            });

            // Build historical monthly expenses
            const historicalMonths = Array.from({
                length: historyCount,
            }).map((_, i) => {
                const monthDate = subMonths(now, historyCount - 1 - i);
                const start = startOfMonth(monthDate);
                const end = endOfMonth(monthDate);

                const expense = transactions
                    .filter((tx) => {
                        const d = new Date(tx.date);
                        return d >= start && d <= end;
                    })
                    .reduce((acc, tx) => acc + tx.amount, 0);

                return {
                    month: format(start, "MMM yy", { locale: es }).replace(
                        /^\w/,
                        (c) => c.toUpperCase()
                    ),
                    expense,
                    type: "actual" as const,
                };
            });

            // Simple linear regression for forecast
            const n = historicalMonths.length;
            const xValues = historicalMonths.map((_, i) => i);
            const yValues = historicalMonths.map((m) => m.expense);

            const sumX = xValues.reduce((a, b) => a + b, 0);
            const sumY = yValues.reduce((a, b) => a + b, 0);
            const sumXY = xValues.reduce(
                (acc, x, i) => acc + x * yValues[i],
                0
            );
            const sumXX = xValues.reduce((acc, x) => acc + x * x, 0);

            // y = slope * x + intercept
            const slope =
                n > 1
                    ? (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
                    : 0;
            const intercept = (sumY - slope * sumX) / n;

            // Generate forecast
            const forecastMonths = Array.from({
                length: forecastCount,
            }).map((_, i) => {
                const monthDate = subMonths(now, -(i + 1));
                const x = n + i;
                const predicted = Math.max(0, Math.round(slope * x + intercept));

                return {
                    month: format(
                        startOfMonth(monthDate),
                        "MMM yy",
                        { locale: es }
                    ).replace(/^\w/, (c) => c.toUpperCase()),
                    expense: predicted,
                    type: "forecast" as const,
                };
            });

            // Calculate average and trend info
            const avgExpense =
                n > 0 ? Math.round(sumY / n) : 0;
            const trendDirection =
                slope > 50
                    ? "increasing"
                    : slope < -50
                      ? "decreasing"
                      : "stable";

            return {
                historical: historicalMonths,
                forecast: forecastMonths,
                avgExpense,
                trendDirection,
                monthlySlope: Math.round(slope),
            };
        }),

    /**
     * Tendencia por categoría a lo largo del tiempo.
     */
    categoryTrends: protectedProcedure
        .input(
            z
                .object({
                    months: z.number().min(2).max(12).default(6),
                })
                .optional()
        )
        .query(async ({ ctx, input }) => {
            const monthsCount = input?.months ?? 6;
            const now = new Date();
            const startDate = startOfMonth(subMonths(now, monthsCount - 1));

            const transactions = await ctx.prisma.transaction.findMany({
                where: {
                    userId: ctx.user.id,
                    date: { gte: startDate },
                    type: "expense",
                },
                include: { category: true },
                orderBy: { date: "asc" },
            });

            // Get top 5 categories by total spending
            const categoryTotals: Record<
                string,
                { name: string; color: string; total: number }
            > = {};
            transactions.forEach((tx) => {
                const catName = tx.category?.name || "Sin Categoría";
                const catColor = tx.category?.color || "#94a3b8";
                if (!categoryTotals[catName]) {
                    categoryTotals[catName] = {
                        name: catName,
                        color: catColor,
                        total: 0,
                    };
                }
                categoryTotals[catName].total += tx.amount;
            });

            const topCategories = Object.values(categoryTotals)
                .sort((a, b) => b.total - a.total)
                .slice(0, 5);

            const topCategoryNames = topCategories.map((c) => c.name);

            // Build monthly data for each category
            const monthlyData = Array.from({ length: monthsCount }).map(
                (_, i) => {
                    const monthDate = subMonths(now, monthsCount - 1 - i);
                    const start = startOfMonth(monthDate);
                    const end = endOfMonth(monthDate);

                    const monthTxs = transactions.filter((tx) => {
                        const d = new Date(tx.date);
                        return d >= start && d <= end;
                    });

                    const dataPoint: Record<string, string | number> = {
                        month: format(start, "MMM yy", { locale: es }).replace(
                            /^\w/,
                            (c) => c.toUpperCase()
                        ),
                    };

                    topCategoryNames.forEach((catName) => {
                        dataPoint[catName] = monthTxs
                            .filter(
                                (tx) =>
                                    (tx.category?.name || "Sin Categoría") ===
                                    catName
                            )
                            .reduce((acc, tx) => acc + tx.amount, 0);
                    });

                    return dataPoint;
                }
            );

            return {
                data: monthlyData,
                categories: topCategories.map((c) => ({
                    name: c.name,
                    color: c.color,
                })),
            };
        }),

    /**
     * Resumen estadístico para KPIs del dashboard
     */
    summary: protectedProcedure.query(async ({ ctx }) => {
        const now = new Date();
        const currentMonthStart = startOfMonth(now);
        const currentMonthEnd = endOfMonth(now);
        const prevMonthStart = startOfMonth(subMonths(now, 1));
        const prevMonthEnd = endOfMonth(subMonths(now, 1));

        const [currentTxs, prevTxs] = await Promise.all([
            ctx.prisma.transaction.findMany({
                where: {
                    userId: ctx.user.id,
                    date: { gte: currentMonthStart, lte: currentMonthEnd },
                },
            }),
            ctx.prisma.transaction.findMany({
                where: {
                    userId: ctx.user.id,
                    date: { gte: prevMonthStart, lte: prevMonthEnd },
                },
            }),
        ]);

        const currentIncome = currentTxs
            .filter((t) => t.type === "income")
            .reduce((a, t) => a + t.amount, 0);
        const currentExpense = currentTxs
            .filter((t) => t.type === "expense")
            .reduce((a, t) => a + t.amount, 0);
        const prevIncome = prevTxs
            .filter((t) => t.type === "income")
            .reduce((a, t) => a + t.amount, 0);
        const prevExpense = prevTxs
            .filter((t) => t.type === "expense")
            .reduce((a, t) => a + t.amount, 0);

        const currentSavingsRate =
            currentIncome > 0
                ? Math.round(
                      ((currentIncome - currentExpense) / currentIncome) * 100
                  )
                : 0;
        const prevSavingsRate =
            prevIncome > 0
                ? Math.round(
                      ((prevIncome - prevExpense) / prevIncome) * 100
                  )
                : 0;

        // Daily average for current month
        const daysInMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0
        ).getDate();
        const dayOfMonth = now.getDate();
        const dailyAvgExpense =
            dayOfMonth > 0
                ? Math.round(currentExpense / dayOfMonth)
                : 0;
        const projectedMonthlyExpense = dailyAvgExpense * daysInMonth;

        return {
            currentMonth: {
                income: currentIncome,
                expense: currentExpense,
                balance: currentIncome - currentExpense,
                savingsRate: currentSavingsRate,
                transactionCount: currentTxs.length,
            },
            previousMonth: {
                income: prevIncome,
                expense: prevExpense,
                balance: prevIncome - prevExpense,
                savingsRate: prevSavingsRate,
                transactionCount: prevTxs.length,
            },
            changes: {
                incomeChange: prevIncome
                    ? Math.round(
                          ((currentIncome - prevIncome) / prevIncome) * 100
                      )
                    : null,
                expenseChange: prevExpense
                    ? Math.round(
                          ((currentExpense - prevExpense) / prevExpense) * 100
                      )
                    : null,
            },
            projections: {
                dailyAvgExpense,
                projectedMonthlyExpense,
            },
        };
    }),
});
