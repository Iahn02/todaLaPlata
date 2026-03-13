"use client";

import { trpc } from "@/trpc/client";
import {
    TrendingUp,
    TrendingDown,
    BarChart3,
    Activity,
    Target,
    ArrowUpRight,
    ArrowDownRight,
    Minus,
    Sparkles,
    PiggyBank,
    Clock,
    Zap,
} from "lucide-react";
import { MonthComparisonChart } from "@/components/charts/MonthComparisonChart";
import { SpendingForecastChart } from "@/components/charts/SpendingForecastChart";
import { CategoryTrendChart } from "@/components/charts/CategoryTrendChart";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
    }).format(amount);
};

function KPICard({
    label,
    value,
    change,
    icon: Icon,
    colorClass,
    accentColor,
    subtitle,
}: {
    label: string;
    value: string;
    change?: number | null;
    icon: React.ElementType;
    colorClass: string;
    accentColor: string;
    subtitle?: string;
}) {
    return (
        <div className="bg-[var(--bg-card)] p-6 md:p-7 rounded-2xl shadow-sm border border-[var(--glass-border)] flex flex-col justify-between relative overflow-hidden group transition-all hover:shadow-md min-h-[140px]">
            <div
                className="absolute top-0 left-0 w-full h-[4px]"
                style={{ backgroundColor: accentColor }}
            />
            {/* Background glowing circle slightly visible */}
            <div
                className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-[0.04] transition-transform group-hover:scale-125 duration-700"
                style={{ backgroundColor: accentColor }}
            />
            
            <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3 text-[var(--text-muted)] font-bold text-[11px] uppercase tracking-wider">
                    <Icon className={`w-4 h-4 ${colorClass}`} />
                    {label}
                </div>
                
                <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text-primary)] mb-auto">
                    {value}
                </div>
                
                <div className="mt-4">
                    {(change !== undefined && change !== null) ? (
                        <div className="flex items-center gap-1.5">
                            {change > 0 ? (
                                <ArrowUpRight className="w-4 h-4 text-[#ef4444]" />
                            ) : change < 0 ? (
                                <ArrowDownRight className="w-4 h-4 text-[#10b981]" />
                            ) : (
                                <Minus className="w-4 h-4 text-[var(--text-muted)]" />
                            )}
                            <span
                                className={`text-xs font-semibold ${
                                    change > 0
                                        ? "text-[#ef4444]"
                                        : change < 0
                                          ? "text-[#10b981]"
                                          : "text-[var(--text-muted)]"
                                }`}
                            >
                                {change > 0 ? "+" : ""}
                                {change}% vs mes anterior
                            </span>
                        </div>
                    ) : subtitle ? (
                        <p className="text-xs font-semibold text-[var(--text-muted)]">
                            {subtitle}
                        </p>
                    ) : <div className="h-4" />}
                </div>
            </div>
        </div>
    );
}

function SkeletonKPI() {
    return (
        <div className="bg-[var(--bg-card)] p-6 md:p-7 rounded-2xl shadow-sm border border-[var(--glass-border)] animate-pulse min-h-[140px] flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-3">
                <div className="w-4 h-4 bg-[var(--bg-nested)] rounded" />
                <div className="w-24 h-3 bg-[var(--bg-nested)] rounded" />
            </div>
            <div className="w-32 h-8 md:h-10 bg-[var(--bg-nested)] rounded-lg mb-auto" />
            <div className="w-28 h-4 bg-[var(--bg-nested)] rounded mt-4" />
        </div>
    );
}

function SkeletonChart() {
    return (
        <div className="flex-1 min-h-[350px] w-full bg-[var(--bg-nested)] rounded-xl animate-pulse" />
    );
}

function TrendBadge({
    direction,
}: {
    direction: string;
}) {
    const config = {
        increasing: {
            label: "Tendencia al alza",
            icon: TrendingUp,
            bg: "bg-[#ef4444]/10",
            text: "text-[#ef4444]",
        },
        decreasing: {
            label: "Tendencia a la baja",
            icon: TrendingDown,
            bg: "bg-[#10b981]/10",
            text: "text-[#10b981]",
        },
        stable: {
            label: "Tendencia estable",
            icon: Minus,
            bg: "bg-[var(--brand-glow)]",
            text: "text-[var(--brand-primary)]",
        },
    }[direction] || {
        label: "Sin datos",
        icon: Minus,
        bg: "bg-[var(--bg-nested)]",
        text: "text-[var(--text-muted)]",
    };

    const Icon = config.icon;

    return (
        <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bg} ${config.text} text-xs font-semibold`}
        >
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </div>
    );
}

export default function AnalyticsPage() {
    const { data: summary, isLoading: summaryLoading } =
        trpc.analytics.summary.useQuery();
    const { data: comparison, isLoading: comparisonLoading } =
        trpc.analytics.monthlyComparison.useQuery({ months: 12 });
    const { data: forecast, isLoading: forecastLoading } =
        trpc.analytics.spendingForecast.useQuery({
            forecastMonths: 3,
            historyMonths: 6,
        });
    const { data: categoryTrends, isLoading: trendsLoading } =
        trpc.analytics.categoryTrends.useQuery({ months: 6 });

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <header className="mb-8 hidden md:block">
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 rounded-xl">
                        <Activity className="w-5 h-5 text-[var(--brand-primary)]" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                        Análisis Avanzado
                    </h1>
                </div>
                <p className="text-[var(--text-tertiary)] text-sm mt-1 ml-[52px]">
                    Comparativas, tendencias y predicciones de tus finanzas.
                </p>
            </header>

            {/* KPIs Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
                {summaryLoading ? (
                    <>
                        <SkeletonKPI />
                        <SkeletonKPI />
                        <SkeletonKPI />
                        <SkeletonKPI />
                    </>
                ) : summary ? (
                    <>
                        <KPICard
                            label="Gastos del Mes"
                            value={formatCurrency(
                                summary.currentMonth.expense
                            )}
                            change={summary.changes.expenseChange}
                            icon={ArrowDownRight}
                            colorClass="text-[#ef4444]"
                            accentColor="#ef4444"
                        />
                        <KPICard
                            label="Tasa de Ahorro"
                            value={`${summary.currentMonth.savingsRate}%`}
                            icon={PiggyBank}
                            colorClass="text-[#10b981]"
                            accentColor="#10b981"
                            subtitle={
                                summary.previousMonth.savingsRate
                                    ? `Mes anterior: ${summary.previousMonth.savingsRate}%`
                                    : undefined
                            }
                        />
                        <KPICard
                            label="Gasto Diario Prom."
                            value={formatCurrency(
                                summary.projections.dailyAvgExpense
                            )}
                            icon={Clock}
                            colorClass="text-[#f59e0b]"
                            accentColor="#f59e0b"
                            subtitle="Promedio basado en este mes"
                        />
                        <KPICard
                            label="Proyección Mensual"
                            value={formatCurrency(
                                summary.projections.projectedMonthlyExpense
                            )}
                            icon={Zap}
                            colorClass="text-[var(--brand-primary)]"
                            accentColor="#6366f1"
                            subtitle="Estimación al cierre del mes"
                        />
                    </>
                ) : null}
            </div>

            {/* Month-over-Month Comparison */}
            <div className="bg-[var(--bg-card)] p-6 lg:p-8 rounded-2xl shadow-sm border border-[var(--glass-border)] mb-6 transition-all">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-[var(--brand-glow)] text-[var(--brand-primary)] rounded-lg">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-[var(--text-primary)]">
                            Comparativa Mes a Mes
                        </h3>
                    </div>
                </div>
                <p className="text-sm font-medium text-[var(--text-muted)] mb-6 ml-[42px]">
                    Ingresos vs Gastos — últimos 12 meses
                </p>
                {comparisonLoading ? (
                    <SkeletonChart />
                ) : (
                    <MonthComparisonChart data={comparison || []} />
                )}
            </div>

            {/* Forecast + Category Trends Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Spending Forecast */}
                <div className="bg-[var(--bg-card)] p-6 lg:p-8 rounded-2xl shadow-sm border border-[var(--glass-border)] transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                            <div className="p-1.5 bg-[#8b5cf6]/10 text-[#8b5cf6] rounded-lg">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-bold text-[var(--text-primary)]">
                                Predicción de Gastos
                            </h3>
                        </div>
                        {forecast && (
                            <TrendBadge
                                direction={forecast.trendDirection}
                            />
                        )}
                    </div>
                    <p className="text-sm font-medium text-[var(--text-muted)] mb-6 ml-[42px]">
                        Proyección basada en regresión lineal
                    </p>
                    {forecastLoading ? (
                        <SkeletonChart />
                    ) : forecast ? (
                        <SpendingForecastChart
                            historical={forecast.historical}
                            forecast={forecast.forecast}
                            avgExpense={forecast.avgExpense}
                        />
                    ) : null}
                    {forecast && (
                        <div className="mt-4 flex flex-wrap gap-3">
                            <div className="bg-[var(--bg-nested)] rounded-xl px-3.5 py-2 flex-1 min-w-[140px]">
                                <p className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                                    Gasto promedio
                                </p>
                                <p className="text-sm font-bold text-[var(--text-primary)] mt-0.5">
                                    {formatCurrency(forecast.avgExpense)}
                                </p>
                            </div>
                            <div className="bg-[var(--bg-nested)] rounded-xl px-3.5 py-2 flex-1 min-w-[140px]">
                                <p className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                                    Var. mensual
                                </p>
                                <p
                                    className={`text-sm font-bold mt-0.5 ${
                                        forecast.monthlySlope > 0
                                            ? "text-[#ef4444]"
                                            : forecast.monthlySlope < 0
                                              ? "text-[#10b981]"
                                              : "text-[var(--text-primary)]"
                                    }`}
                                >
                                    {forecast.monthlySlope > 0
                                        ? "+"
                                        : ""}
                                    {formatCurrency(
                                        forecast.monthlySlope
                                    )}
                                    /mes
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Category Trends */}
                <div className="bg-[var(--bg-card)] p-6 lg:p-8 rounded-2xl shadow-sm border border-[var(--glass-border)] transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                            <div className="p-1.5 bg-[#06b6d4]/10 text-[#06b6d4] rounded-lg">
                                <Target className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-bold text-[var(--text-primary)]">
                                Tendencia por Categoría
                            </h3>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-[var(--text-muted)] mb-6 ml-[42px]">
                        Top 5 categorías — últimos 6 meses
                    </p>
                    {trendsLoading ? (
                        <SkeletonChart />
                    ) : categoryTrends ? (
                        <CategoryTrendChart
                            data={categoryTrends.data}
                            categories={categoryTrends.categories}
                        />
                    ) : null}
                </div>
            </div>

            {/* Savings Rate Timeline - Monthly Table */}
            {!comparisonLoading && comparison && comparison.length > 0 && (
                <div className="bg-[var(--bg-card)] p-6 lg:p-8 rounded-2xl shadow-sm border border-[var(--glass-border)] transition-all mb-6">
                    <div className="flex items-center gap-2.5 mb-6">
                        <div className="p-1.5 bg-[#10b981]/10 text-[#10b981] rounded-lg">
                            <PiggyBank className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-[var(--text-primary)]">
                            Historial de Ahorro
                        </h3>
                    </div>
                    <div className="overflow-x-auto -mx-2 px-2">
                        <div className="flex gap-2 min-w-max pb-1">
                            {comparison.slice(-6).map((m, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col items-center min-w-[100px] bg-[var(--bg-nested)] rounded-xl p-3 group hover:bg-[var(--brand-glow)] transition-all"
                                >
                                    <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                                        {m.month}
                                    </span>

                                    {/* Savings Rate Bar */}
                                    <div className="w-full h-20 flex items-end justify-center mt-2 mb-2">
                                        <div
                                            className="w-8 rounded-t-lg transition-all duration-500"
                                            style={{
                                                height: `${Math.max(4, Math.min(100, Math.abs(m.savingsRate)))}%`,
                                                background:
                                                    m.savingsRate >= 0
                                                        ? "linear-gradient(to top, #059669, #10b981)"
                                                        : "linear-gradient(to top, #dc2626, #ef4444)",
                                            }}
                                        />
                                    </div>

                                    <span
                                        className={`text-base font-bold ${
                                            m.savingsRate >= 20
                                                ? "text-[#10b981]"
                                                : m.savingsRate >= 0
                                                  ? "text-[#f59e0b]"
                                                  : "text-[#ef4444]"
                                        }`}
                                    >
                                        {m.savingsRate}%
                                    </span>
                                    <span className="text-[10px] text-[var(--text-muted)] mt-0.5">
                                        {m.savingsRate >= 20
                                            ? "🎯 Excelente"
                                            : m.savingsRate >= 10
                                              ? "👍 Bien"
                                              : m.savingsRate >= 0
                                                ? "⚠️ Ajustar"
                                                : "🚨 Déficit"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
