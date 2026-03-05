"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Transaction } from "@prisma/client";
import { format, subMonths, startOfMonth, isSameMonth } from "date-fns";
import { es } from "date-fns/locale";

interface MonthlyOverviewChartProps {
    transactions: Transaction[];
}

export function MonthlyOverviewChart({ transactions }: MonthlyOverviewChartProps) {
    const data = useMemo(() => {
        if (!transactions) return [];
        const months = Array.from({ length: 6 }).map((_, i) => {
            const d = subMonths(new Date(), 5 - i);
            return startOfMonth(d);
        });
        return months.map(month => {
            const monthTxs = transactions.filter(tx => isSameMonth(new Date(tx.date), month));
            const income = monthTxs.filter(tx => tx.type === "income").reduce((acc, tx) => acc + tx.amount, 0);
            const expense = monthTxs.filter(tx => tx.type === "expense").reduce((acc, tx) => acc + tx.amount, 0);
            return {
                name: format(month, 'MMM', { locale: es }).replace(/^\w/, c => c.toUpperCase()),
                Ingresos: income,
                Gastos: expense,
            };
        });
    }, [transactions]);

    const formatCurrency = (value: number) => {
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
        return `$${value}`;
    };

    const formatTooltipCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
    };

    return (
        <div className="w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--glass-border)" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                        tickFormatter={formatCurrency}
                        width={60}
                    />
                    <Tooltip
                        formatter={(value: any) => [formatTooltipCurrency(Number(value) || 0)]}
                        contentStyle={{
                            backgroundColor: 'var(--bg-card)',
                            borderRadius: '12px',
                            border: '1px solid var(--glass-border)',
                            color: 'var(--text-primary)',
                            boxShadow: 'var(--shadow-lg)'
                        }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingBottom: '20px' }} />
                    <Area
                        type="monotone"
                        dataKey="Ingresos"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorIncome)"
                        activeDot={{ r: 5, strokeWidth: 0, fill: '#10b981' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="Gastos"
                        stroke="#ef4444"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorExpense)"
                        activeDot={{ r: 5, strokeWidth: 0, fill: '#ef4444' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
