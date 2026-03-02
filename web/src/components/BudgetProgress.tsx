"use client";

import { useMemo } from "react";
import { Transaction, Category, Budget } from "@prisma/client";
import { isSameMonth } from "date-fns";

type CategoryWithBudgets = Category & { budgets?: Budget[] };

interface BudgetProgressProps {
    transactions: Transaction[];
    categories: CategoryWithBudgets[];
}

export function BudgetProgress({ transactions, categories }: BudgetProgressProps) {

    const budgetStats = useMemo(() => {
        const budgetedCategories = categories.filter(c => c.type === "expense" && c.budgets?.some((b: Budget) => b.period === "monthly" && b.amount > 0));

        if (budgetedCategories.length === 0) return [];

        const now = new Date();

        return budgetedCategories.map(cat => {
            const budgetAmount = cat.budgets!.find((b: Budget) => b.period === "monthly")!.amount;

            const currentMonthExpenses = transactions
                .filter(tx => tx.categoryId === cat.id && tx.type === "expense" && isSameMonth(new Date(tx.date), now))
                .reduce((acc, tx) => acc + tx.amount, 0);

            let percentage = (currentMonthExpenses / budgetAmount) * 100;
            const isOverBudget = currentMonthExpenses > budgetAmount;

            return {
                ...cat,
                budgetAmount,
                currentSpend: currentMonthExpenses,
                percentage: Math.min(percentage, 100),
                isOverBudget,
                rawPercentage: percentage
            };
        }).sort((a, b) => b.percentage - a.percentage);

    }, [transactions, categories]);

    const formatClp = (amount: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
    };

    if (budgetStats.length === 0) {
        return null;
    }

    return (
        <div className="bg-[var(--bg-card)] p-6 rounded-3xl shadow-sm border border-[var(--brand-cream)]/60 flex flex-col mt-6 transition-colors">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-semibold text-lg text-[var(--text-primary)]">Presupuestos</h3>
                    <p className="text-sm text-[var(--text-tertiary)]">Progreso de este mes</p>
                </div>
            </div>

            <div className="space-y-5">
                {budgetStats.map(stat => (
                    <div key={stat.id} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-[var(--text-primary)]">{stat.name}</span>
                                {stat.isOverBudget && <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#c95d45]/10 text-[#c95d45]">¡Excedido!</span>}
                            </div>
                            <span className="font-medium text-[var(--text-tertiary)]">
                                <span className={stat.isOverBudget ? "text-[#c95d45] font-bold" : "text-[var(--text-primary)]"}>{formatClp(stat.currentSpend)}</span> / {formatClp(stat.budgetAmount)}
                            </span>
                        </div>

                        <div className="h-2.5 w-full bg-[var(--bg-nested)] rounded-full overflow-hidden flex">
                            <div
                                className={`h-full transition-all duration-700 ease-out rounded-full ${stat.isOverBudget ? 'bg-[#c95d45]' : stat.percentage > 85 ? 'bg-[#f59e0b]' : 'bg-[#4b607f]'}`}
                                style={{ width: `${stat.percentage}%` }}
                            />
                        </div>
                        <p className="text-xs text-right text-[var(--text-muted)]">
                            {stat.rawPercentage.toFixed(1)}% consumido
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
