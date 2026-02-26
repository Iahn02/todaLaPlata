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
        // Obtenemos solo las categorías que tienen presupuesto mensual configurado y son de tipo gasto
        const budgetedCategories = categories.filter(c => c.type === "expense" && c.budgets?.some((b: Budget) => b.period === "monthly" && b.amount > 0));

        if (budgetedCategories.length === 0) return [];

        const now = new Date();

        return budgetedCategories.map(cat => {
            const budgetAmount = cat.budgets!.find((b: Budget) => b.period === "monthly")!.amount;

            // Calculamos el gasto actual de ESTE MES para ESTA CATEGORÍA
            const currentMonthExpenses = transactions
                .filter(tx => tx.categoryId === cat.id && tx.type === "expense" && isSameMonth(new Date(tx.date), now))
                .reduce((acc, tx) => acc + tx.amount, 0);

            let percentage = (currentMonthExpenses / budgetAmount) * 100;
            const isOverBudget = currentMonthExpenses > budgetAmount;

            // Estructuramos el objeto a devolver
            return {
                ...cat,
                budgetAmount,
                currentSpend: currentMonthExpenses,
                percentage: Math.min(percentage, 100), // Capeamos a 100 para la barra visual
                isOverBudget,
                rawPercentage: percentage
            };
        }).sort((a, b) => b.percentage - a.percentage); // Ordenar por los más cerca de pasarse

    }, [transactions, categories]);

    const formatClp = (amount: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
    };

    if (budgetStats.length === 0) {
        return null;
    }

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#e8d8c9]/60 flex flex-col mt-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-semibold text-lg text-[#1a1a1a]">Presupuestos</h3>
                    <p className="text-sm text-[#6b6b6b]">Progreso de este mes</p>
                </div>
            </div>

            <div className="space-y-5">
                {budgetStats.map(stat => (
                    <div key={stat.id} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-[#1a1a1a]">{stat.name}</span>
                                {stat.isOverBudget && <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#c95d45]/10 text-[#c95d45]">¡Excedido!</span>}
                            </div>
                            <span className="font-medium text-[#6b6b6b]">
                                <span className={stat.isOverBudget ? "text-[#c95d45] font-bold" : "text-[#1a1a1a]"}>{formatClp(stat.currentSpend)}</span> / {formatClp(stat.budgetAmount)}
                            </span>
                        </div>

                        {/* Barra de Progreso Múltiple */}
                        <div className="h-2.5 w-full bg-[#f5f0eb] rounded-full overflow-hidden flex">
                            <div
                                className={`h-full transition-all duration-700 ease-out ${stat.isOverBudget ? 'bg-[#c95d45]' : stat.percentage > 85 ? 'bg-[#f59e0b]' : 'bg-[#4b607f]'}`}
                                style={{ width: `${stat.percentage}%` }}
                            />
                        </div>
                        <p className="text-xs text-right text-[#9a9a9a]">
                            {stat.rawPercentage.toFixed(1)}% consumido
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
