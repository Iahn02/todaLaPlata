"use client";

import { useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    ReferenceLine,
} from "recharts";

interface HistoricalMonth {
    month: string;
    expense: number;
    type: "actual" | "forecast";
}

interface SpendingForecastChartProps {
    historical: HistoricalMonth[];
    forecast: HistoricalMonth[];
    avgExpense: number;
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

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ payload: { actual?: number | null; predicted?: number | null; type: string } }>; label?: string }) {
    if (!active || !payload?.length) return null;

    const dataPoint = payload[0]?.payload;
    const isForecast = dataPoint?.type === "forecast";

    return (
        <div className="bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-2xl p-4 shadow-[var(--shadow-lg)] min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
                <p className="font-semibold text-[var(--text-primary)] text-sm">
                    {label}
                </p>
                {isForecast && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#8b5cf6]/10 text-[#8b5cf6]">
                        Proyección
                    </span>
                )}
            </div>
            {dataPoint?.actual !== undefined && dataPoint?.actual !== null && (
                <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                        <span className="text-xs text-[var(--text-tertiary)]">
                            Gasto real
                        </span>
                    </div>
                    <span className="text-xs font-semibold text-[#ef4444]">
                        {formatFullCurrency(dataPoint.actual)}
                    </span>
                </div>
            )}
            {dataPoint?.predicted !== undefined &&
                dataPoint?.predicted !== null && (
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" />
                            <span className="text-xs text-[var(--text-tertiary)]">
                                {isForecast
                                    ? "Gasto estimado"
                                    : "Tendencia"}
                            </span>
                        </div>
                        <span className="text-xs font-semibold text-[#8b5cf6]">
                            {formatFullCurrency(dataPoint.predicted)}
                        </span>
                    </div>
                )}
        </div>
    );
}

export function SpendingForecastChart({
    historical,
    forecast,
    avgExpense,
}: SpendingForecastChartProps) {
    const chartData = useMemo(() => {
        // Combine historical and forecast data
        const combined = [
            ...historical.map((h) => ({
                month: h.month,
                actual: h.expense,
                predicted: null as number | null,
                type: "actual" as const,
            })),
            // Bridge: repeat last historical point as first forecast point
            ...(historical.length > 0 && forecast.length > 0
                ? [
                      {
                          month: historical[historical.length - 1].month,
                          actual: null as number | null,
                          predicted:
                              historical[historical.length - 1].expense,
                          type: "bridge" as const,
                      },
                  ]
                : []),
            ...forecast.map((f) => ({
                month: f.month,
                actual: null as number | null,
                predicted: f.expense,
                type: "forecast" as const,
            })),
        ];

        // Deduplicate bridge month with actual
        const deduped: typeof combined = [];
        for (const item of combined) {
            if (item.type === "bridge") {
                // Update the last actual entry to also have predicted
                const lastActual = deduped[deduped.length - 1];
                if (lastActual && lastActual.month === item.month) {
                    lastActual.predicted = item.predicted;
                } else {
                    deduped.push(item);
                }
            } else {
                deduped.push(item);
            }
        }

        return deduped;
    }, [historical, forecast]);

    if (chartData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[350px] text-[var(--text-muted)]">
                <p className="font-medium text-sm">
                    No hay datos suficientes para la predicción.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient
                            id="colorActual"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#ef4444"
                                stopOpacity={0.2}
                            />
                            <stop
                                offset="95%"
                                stopColor="#ef4444"
                                stopOpacity={0}
                            />
                        </linearGradient>
                        <linearGradient
                            id="colorForecast"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#8b5cf6"
                                stopOpacity={0.2}
                            />
                            <stop
                                offset="95%"
                                stopColor="#8b5cf6"
                                stopOpacity={0}
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
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{
                            fontSize: "12px",
                            paddingBottom: "12px",
                        }}
                    />
                    {avgExpense > 0 && (
                        <ReferenceLine
                            y={avgExpense}
                            stroke="var(--text-muted)"
                            strokeDasharray="6 4"
                            label={{
                                value: `Prom. ${formatCurrency(avgExpense)}`,
                                position: "insideTopRight",
                                fill: "var(--text-muted)",
                                fontSize: 11,
                            }}
                        />
                    )}
                    <Area
                        type="monotone"
                        dataKey="actual"
                        name="Gasto Real"
                        stroke="#ef4444"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorActual)"
                        connectNulls={false}
                        activeDot={{
                            r: 5,
                            strokeWidth: 0,
                            fill: "#ef4444",
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="predicted"
                        name="Proyección"
                        stroke="#8b5cf6"
                        strokeWidth={2.5}
                        strokeDasharray="8 4"
                        fillOpacity={1}
                        fill="url(#colorForecast)"
                        connectNulls={false}
                        activeDot={{
                            r: 5,
                            strokeWidth: 2,
                            stroke: "#8b5cf6",
                            fill: "var(--bg-card)",
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
