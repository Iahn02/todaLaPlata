"use client";

import { trpc } from "@/trpc/client";
import { ArrowDownRight, ArrowUpRight, Wallet, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MonthlyOverviewChart } from "@/components/charts/MonthlyOverviewChart";
import { CategoryExpensesChart } from "@/components/charts/CategoryExpensesChart";
import { BudgetProgress } from "@/components/BudgetProgress";

export default function DashboardPage() {
    const { data: transactions, isLoading } = trpc.transactions.getAll.useQuery();
    const { data: categories } = trpc.categories.getAll.useQuery();

    const income = transactions?.filter((t: any) => t.type === "income").reduce((acc: number, t: any) => acc + t.amount, 0) || 0;
    const expense = transactions?.filter((t: any) => t.type === "expense").reduce((acc: number, t: any) => acc + t.amount, 0) || 0;
    const balance = income - expense;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">

            <header className="mb-8 hidden md:block">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Resumen Financiero</h1>
                <p className="text-[var(--text-tertiary)] text-sm mt-1">Controla en tiempo real tus ingresos y gastos.</p>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 mb-8">

                {/* Balance Total */}
                <div className="col-span-2 md:col-span-1 bg-[var(--bg-card)] p-5 md:p-6 rounded-2xl shadow-[var(--shadow-md)] border border-[var(--glass-border)] flex flex-col justify-between overflow-hidden relative group transition-all hover:shadow-[var(--shadow-lg)]">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-[#6366f1]/8 to-transparent rounded-bl-full -z-0 transition-transform group-hover:scale-125 duration-500" />
                    <div className="flex items-center gap-3 text-[var(--text-tertiary)] font-medium text-sm z-10">
                        <div className="p-2 bg-[#6366f1]/10 text-[#6366f1] dark:text-[#818cf8] rounded-xl">
                            <Wallet className="w-5 h-5" />
                        </div>
                        Balance Total
                    </div>
                    {isLoading ? (
                        <div className="w-32 h-8 bg-[var(--bg-nested)] animate-pulse mt-4 rounded-lg" />
                    ) : (
                        <div className="mt-4 z-10 text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
                            {formatCurrency(balance)}
                        </div>
                    )}
                </div>

                {/* Ingresos */}
                <div className="bg-[var(--bg-card)] p-5 md:p-6 rounded-2xl shadow-[var(--shadow-md)] border border-[var(--glass-border)] flex flex-col justify-between h-36 transition-all hover:shadow-[var(--shadow-lg)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#10b981] to-[#059669]" />
                    <div className="flex items-center gap-2 md:gap-3 text-[var(--text-tertiary)] font-medium text-xs md:text-sm">
                        <div className="hidden md:flex p-1.5 bg-[#10b981]/10 text-[#10b981] rounded-lg">
                            <ArrowUpRight className="w-4 h-4" />
                        </div>
                        Ingresos
                    </div>
                    {isLoading ? (
                        <div className="w-24 h-6 bg-[var(--bg-nested)] animate-pulse mt-4 rounded-lg" />
                    ) : (
                        <div className="mt-2 md:mt-4 text-xl md:text-2xl font-bold text-[#10b981] tracking-tight truncate">
                            +{formatCurrency(income)}
                        </div>
                    )}
                </div>

                {/* Gastos */}
                <div className="bg-[var(--bg-card)] p-5 md:p-6 rounded-2xl shadow-[var(--shadow-md)] border border-[var(--glass-border)] flex flex-col justify-between h-36 transition-all hover:shadow-[var(--shadow-lg)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#ef4444] to-[#dc2626]" />
                    <div className="flex items-center gap-2 md:gap-3 text-[var(--text-tertiary)] font-medium text-xs md:text-sm">
                        <div className="hidden md:flex p-1.5 bg-[#ef4444]/10 text-[#ef4444] rounded-lg">
                            <ArrowDownRight className="w-4 h-4" />
                        </div>
                        Gastos
                    </div>
                    {isLoading ? (
                        <div className="w-24 h-6 bg-[var(--bg-nested)] animate-pulse mt-4 rounded-lg" />
                    ) : (
                        <div className="mt-2 md:mt-4 text-xl md:text-2xl font-bold text-[#ef4444] tracking-tight truncate">
                            -{formatCurrency(expense)}
                        </div>
                    )}
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Monthly Overview */}
                <div className="lg:col-span-2 bg-[var(--bg-card)] p-6 rounded-2xl shadow-[var(--shadow-md)] border border-[var(--glass-border)] flex flex-col transition-all">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-[var(--text-primary)]">Flujo de Caja Mensual</h3>
                    </div>
                    {isLoading ? (
                        <div className="flex-1 min-h-[300px] w-full bg-[var(--bg-nested)] rounded-xl animate-pulse" />
                    ) : (
                        <MonthlyOverviewChart transactions={transactions || []} />
                    )}
                </div>

                {/* Category Expenses */}
                <div className="bg-[var(--bg-card)] p-6 rounded-2xl shadow-[var(--shadow-md)] border border-[var(--glass-border)] flex flex-col transition-all">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-[var(--text-primary)]">Gastos por Categoría</h3>
                    </div>
                    {isLoading ? (
                        <div className="flex-1 min-h-[300px] w-full bg-[var(--bg-nested)] rounded-xl animate-pulse" />
                    ) : (
                        <CategoryExpensesChart transactions={transactions || []} />
                    )}
                </div>

            </div>

            {/* Recent Activity */}
            <div className="mt-5 bg-[var(--bg-card)] p-6 rounded-2xl shadow-[var(--shadow-md)] border border-[var(--glass-border)] transition-all">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-[var(--text-primary)]">Actividad Reciente</h3>
                </div>

                <div className="space-y-3">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex gap-4 animate-pulse">
                                <div className="w-10 h-10 bg-[var(--bg-nested)] rounded-xl" />
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-4 bg-[var(--bg-nested)] rounded w-3/4" />
                                    <div className="h-3 bg-[var(--bg-nested)] rounded w-1/2" />
                                </div>
                            </div>
                        ))
                    ) : transactions?.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-[var(--text-tertiary)] text-sm">No hay transacciones todavía.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {transactions?.slice(0, 6).map((tx: any) => (
                                <div key={tx.id} className="flex items-center justify-between group cursor-pointer hover:bg-[var(--bg-nested)] p-3 rounded-xl transition-all border border-transparent hover:border-[var(--glass-border)]">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === "income" ? "bg-[#10b981]/10 text-[#10b981]" :
                                            tx.type === "expense" ? "bg-[#ef4444]/10 text-[#ef4444]" : "bg-[var(--bg-nested)] text-[var(--text-tertiary)]"
                                            }`}>
                                            {tx.type === "income" ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-[var(--text-primary)]">{tx.description || "Transacción"}</p>
                                            <p className="text-xs text-[var(--text-muted)]">{format(new Date(tx.date), "d MMM", { locale: es })}</p>
                                        </div>
                                    </div>
                                    <div className={`font-semibold text-sm ${tx.type === "income" ? "text-[#10b981]" : "text-[var(--text-primary)]"}`}>
                                        {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Budgets */}
            {!isLoading && categories && transactions && (
                <BudgetProgress transactions={transactions} categories={categories as any} />
            )}

        </div>
    );
}
