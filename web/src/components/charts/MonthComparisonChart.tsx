"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    ReferenceLine,
} from "recharts";

interface MonthData {
    month: string;
    monthFull: string;
    income: number;
    expense: number;
    balance: number;
    savingsRate: number;
    incomeChange: number | null;
    expenseChange: number | null;
    balanceChange: number | null;
}

interface MonthComparisonChartProps {
    data: MonthData[];
}

const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
};

const formatFullCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
    }).format(value);
};

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: MonthData }>; label?: string }) {
    if (!active || !payload?.length) return null;

    const data = payload[0]?.payload;

    return (
        <div className="bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-2xl p-4 shadow-[var(--shadow-lg)] min-w-[220px]">
            <p className="font-semibold text-[var(--text-primary)] text-sm mb-3">
                {data?.monthFull}
            </p>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                        <span className="text-xs text-[var(--text-tertiary)]">
                            Ingresos
                        </span>
                    </div>
                    <span className="text-xs font-semibold text-[#10b981]">
                        {formatFullCurrency(data?.income || 0)}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                        <span className="text-xs text-[var(--text-tertiary)]">
                            Gastos
                        </span>
                    </div>
                    <span className="text-xs font-semibold text-[#ef4444]">
                        {formatFullCurrency(data?.expense || 0)}
                    </span>
                </div>
                <div className="border-t border-[var(--glass-border)] pt-2 mt-2 flex justify-between items-center">
                    <span className="text-xs text-[var(--text-tertiary)]">
                        Balance
                    </span>
                    <span
                        className={`text-xs font-bold ${data?.balance >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}
                    >
                        {formatFullCurrency(data?.balance || 0)}
                    </span>
                </div>
                {data?.expenseChange !== null && (
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-[var(--text-muted)]">
                            Var. gasto
                        </span>
                        <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                data.expenseChange > 0
                                    ? "bg-[#ef4444]/10 text-[#ef4444]"
                                    : data.expenseChange < 0
                                      ? "bg-[#10b981]/10 text-[#10b981]"
                                      : "bg-[var(--bg-nested)] text-[var(--text-muted)]"
                            }`}
                        >
                            {data.expenseChange > 0 ? "+" : ""}
                            {data.expenseChange}%
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export function MonthComparisonChart({ data }: MonthComparisonChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[350px] text-[var(--text-muted)]">
                <p className="font-medium text-sm">
                    No hay datos suficientes.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    barGap={4}
                    barCategoryGap="20%"
                >
                    <defs>
                        <linearGradient
                            id="barIncome"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stopColor="#10b981"
                                stopOpacity={0.9}
                            />
                            <stop
                                offset="100%"
                                stopColor="#059669"
                                stopOpacity={0.7}
                            />
                        </linearGradient>
                        <linearGradient
                            id="barExpense"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stopColor="#ef4444"
                                stopOpacity={0.9}
                            />
                            <stop
                                offset="100%"
                                stopColor="#dc2626"
                                stopOpacity={0.7}
                            />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="var(--glass-border)"
                    />
                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                            fill: "var(--text-muted)",
                            fontSize: 11,
                        }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                            fill: "var(--text-muted)",
                            fontSize: 11,
                        }}
                        tickFormatter={formatCurrency}
                        width={55}
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{
                            fill: "var(--brand-glow)",
                            radius: 8,
                        }}
                    />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{
                            fontSize: "12px",
                            paddingBottom: "12px",
                        }}
                    />
                    <ReferenceLine y={0} stroke="var(--glass-border)" />
                    <Bar
                        dataKey="income"
                        name="Ingresos"
                        fill="url(#barIncome)"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={32}
                    />
                    <Bar
                        dataKey="expense"
                        name="Gastos"
                        fill="url(#barExpense)"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={32}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
