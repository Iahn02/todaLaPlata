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

        // Generar los últimos 6 meses (incluyendo el actual)
        const months = Array.from({ length: 6 }).map((_, i) => {
            const d = subMonths(new Date(), 5 - i); // Empezar 5 meses atrás hasta el actual
            return startOfMonth(d);
        });

        // Mapear cada mes
        return months.map(month => {
            // Filtrar transacciones del mes
            const monthTxs = transactions.filter(tx => isSameMonth(new Date(tx.date), month));

            // Calcular ingresos y gastos
            const income = monthTxs.filter(tx => tx.type === "income").reduce((acc, tx) => acc + tx.amount, 0);
            const expense = monthTxs.filter(tx => tx.type === "expense").reduce((acc, tx) => acc + tx.amount, 0);

            return {
                name: format(month, 'MMM', { locale: es }).replace(/^\w/, c => c.toUpperCase()), // Ej: 'Ene', 'Feb'
                Ingresos: income,
                Gastos: expense,
            };
        });
    }, [transactions]);

    const formatCurrency = (value: number) => {
        // Formato simplificado para los ejes (ej. $1,5K, $2M)
        if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(1)}M`;
        }
        if (value >= 1000) {
            return `$${(value / 1000).toFixed(0)}k`;
        }
        return `$${value}`;
    };

    const formatTooltipCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
    };

    return (
        <div className="w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4b607f" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#4b607f" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#c95d45" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#c95d45" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8d8c9" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9a9a9a', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9a9a9a', fontSize: 12 }}
                        tickFormatter={formatCurrency}
                        width={60}
                    />
                    <Tooltip
                        formatter={(value: any) => [formatTooltipCurrency(Number(value) || 0)]}
                        contentStyle={{
                            backgroundColor: '#1a1a1a',
                            borderRadius: '12px',
                            border: 'none',
                            color: '#f5f0eb',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingBottom: '20px' }} />
                    <Area
                        type="monotone"
                        dataKey="Ingresos"
                        stroke="#4b607f"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorIncome)"
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#4b607f' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="Gastos"
                        stroke="#c95d45"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorExpense)"
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#c95d45' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
