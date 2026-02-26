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

        // Filtramos solo gastos
        const expenses = transactions.filter(t => t.type === "expense");

        // Agrupamos por categoría
        const grouped = expenses.reduce((acc, tx) => {
            const catName = tx.category?.name || "Sin Categoría";
            const catColor = tx.category?.color || "#9a9a9a"; // Gris por defecto para sin categoría

            if (!acc[catName]) {
                acc[catName] = { name: catName, value: 0, color: catColor };
            }
            acc[catName].value += tx.amount;
            return acc;
        }, {} as Record<string, { name: string; value: number; color: string }>);

        // Convertimos a array y ordenamos por valor descendente
        return Object.values(grouped).sort((a, b) => b.value - a.value);
    }, [transactions]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
    };

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-[#9a9a9a]">
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
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
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
                            backgroundColor: '#1a1a1a',
                            borderRadius: '12px',
                            border: 'none',
                            color: '#f5f0eb',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)'
                        }}
                        itemStyle={{ color: '#f5f0eb', fontWeight: 600 }}
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
