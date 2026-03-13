"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

interface CategoryInfo {
    name: string;
    color: string;
}

interface CategoryTrendChartProps {
    data: Record<string, string | number>[];
    categories: CategoryInfo[];
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

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
    if (!active || !payload?.length) return null;

    // Sort by value descending
    const sortedPayload = [...payload].sort(
        (a, b) => (b.value || 0) - (a.value || 0)
    );
    const total = sortedPayload.reduce(
        (acc: number, item) => acc + (item.value || 0),
        0
    );

    return (
        <div className="bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-2xl p-4 shadow-[var(--shadow-lg)] min-w-[220px]">
            <p className="font-semibold text-[var(--text-primary)] text-sm mb-3">
                {label}
            </p>
            <div className="space-y-1.5">
                {sortedPayload.map((item, i: number) =>
                    item.value > 0 ? (
                        <div
                            key={i}
                            className="flex justify-between items-center"
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-xs text-[var(--text-tertiary)] max-w-[120px] truncate">
                                    {item.name}
                                </span>
                            </div>
                            <span className="text-xs font-semibold text-[var(--text-primary)]">
                                {formatFullCurrency(item.value)}
                            </span>
                        </div>
                    ) : null
                )}
                {total > 0 && (
                    <div className="border-t border-[var(--glass-border)] pt-1.5 mt-1.5 flex justify-between items-center">
                        <span className="text-xs text-[var(--text-muted)]">
                            Total
                        </span>
                        <span className="text-xs font-bold text-[var(--text-primary)]">
                            {formatFullCurrency(total)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export function CategoryTrendChart({
    data,
    categories,
}: CategoryTrendChartProps) {
    if (!data || data.length === 0 || !categories || categories.length === 0) {
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
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        {categories.map((cat) => (
                            <linearGradient
                                key={cat.name}
                                id={`gradient-${cat.name.replace(/\s/g, "-")}`}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor={cat.color}
                                    stopOpacity={0.15}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={cat.color}
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        ))}
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
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{
                            fontSize: "11px",
                            paddingBottom: "12px",
                        }}
                    />
                    {categories.map((cat) => (
                        <Area
                            key={cat.name}
                            type="monotone"
                            dataKey={cat.name}
                            name={cat.name}
                            stroke={cat.color}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill={`url(#gradient-${cat.name.replace(/\s/g, "-")})`}
                            activeDot={{
                                r: 4,
                                strokeWidth: 0,
                                fill: cat.color,
                            }}
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
