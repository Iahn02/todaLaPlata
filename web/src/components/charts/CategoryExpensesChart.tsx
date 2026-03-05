"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Transaction, Category } from "@prisma/client";

type TransactionWithCategory = Transaction & { category: Category | null };

interface CategoryExpensesChartProps {
    transactions: TransactionWithCategory[];
}

export function CategoryExpensesChart({ transactions }: CategoryExpensesChartProps) {
    const data = useMemo(() => {
        if (!transactions) return [];
        const expenses = transactions.filter(t => t.type === "expense");
        const grouped = expenses.reduce((acc, tx) => {
            const catName = tx.category?.name || "Sin Categoría";
            const catColor = tx.category?.color || "#94a3b8";
            if (!acc[catName]) {
                acc[catName] = { name: catName, value: 0, color: catColor };
            }
            acc[catName].value += tx.amount;
            return acc;
        }, {} as Record<string, { name: string; value: number; color: string }>);
        return Object.values(grouped).sort((a, b) => b.value - a.value);
    }, [transactions]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
    };

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)]">
                <p className="font-medium text-sm">No hay gastos para mostrar.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={78}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: any) => [formatCurrency(Number(value) || 0), "Total"]}
                        contentStyle={{
                            backgroundColor: 'var(--bg-card)',
                            borderRadius: '12px',
                            border: '1px solid var(--glass-border)',
                            color: 'var(--text-primary)',
                            boxShadow: 'var(--shadow-lg)'
                        }}
                        itemStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                    />
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        iconType="circle"
                        wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
