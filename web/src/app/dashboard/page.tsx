"use client";

import { trpc } from "@/trpc/client";
import { ArrowDownRight, ArrowUpRight, Wallet, History } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MonthlyOverviewChart } from "@/components/charts/MonthlyOverviewChart";
import { CategoryExpensesChart } from "@/components/charts/CategoryExpensesChart";
import { BudgetProgress } from "@/components/BudgetProgress";
import { ExportCSVButton } from "@/components/ExportCSVButton";
import { AddTransactionButton } from "@/components/AddTransactionModal";
import Link from "next/link";

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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto pb-10">

            {/* Header section w/ Actions */}
            <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[var(--glass-border)]">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]">Visión General</h1>
                    <p className="text-[var(--text-tertiary)] text-sm md:text-base mt-1">Métricas principales de tus finanzas personales</p>
                </div>
                <div className="flex items-center gap-3">
                    <ExportCSVButton />
                    <AddTransactionButton variant="solid" className="hidden md:flex text-sm py-2.5 px-5 shadow-sm" />
                </div>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                
                {/* Balance Total */}
                <div className="bg-[var(--bg-card)] p-5 md:p-6 rounded-xl shadow-sm border border-[var(--glass-border)] relative flex flex-col" style={{ paddingTop: '2rem' }}>
                    <div className="absolute top-0 left-0 w-full h-[4px] bg-blue-500 rounded-t-xl" />
                    <div className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider uppercase mb-3 flex items-center gap-1.5">
                        <Wallet className="w-3.5 h-3.5" /> Balance Total
                    </div>
                    {isLoading ? (
                        <div className="w-32 h-10 bg-[var(--bg-nested)] animate-pulse rounded-lg mt-1" />
                    ) : (
                        <>
                            <div className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-primary)] mb-2 mt-1">
                                {formatCurrency(balance)}
                            </div>
                            <div className="text-xs font-semibold text-blue-500/90 mt-2">
                                Disponible actual
                            </div>
                        </>
                    )}
                </div>

                {/* Ingresos */}
                <div className="bg-[var(--bg-card)] p-5 md:p-6 rounded-xl shadow-sm border border-[var(--glass-border)] relative flex flex-col" style={{ paddingTop: '2rem' }}>
                    <div className="absolute top-0 left-0 w-full h-[4px] bg-[#10b981] rounded-t-xl" />
                    <div className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider uppercase mb-3 flex items-center gap-1.5">
                        <ArrowUpRight className="w-3.5 h-3.5" /> Ingresos este mes
                    </div>
                    {isLoading ? (
                        <div className="w-32 h-10 bg-[var(--bg-nested)] animate-pulse rounded-lg mt-1" />
                    ) : (
                        <>
                            <div className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-primary)] mb-2 mt-1">
                                {formatCurrency(income)}
                            </div>
                            <div className="flex items-center gap-1 text-xs font-semibold text-[#10b981] mt-2">
                                Total ingresado
                            </div>
                        </>
                    )}
                </div>

                {/* Gastos */}
                <div className="bg-[var(--bg-card)] p-5 md:p-6 rounded-xl shadow-sm border border-[var(--glass-border)] relative flex flex-col" style={{ paddingTop: '2rem' }}>
                    <div className="absolute top-0 left-0 w-full h-[4px] bg-[#ef4444] rounded-t-xl" />
                    <div className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider uppercase mb-3 flex items-center gap-1.5">
                        <ArrowDownRight className="w-3.5 h-3.5" /> Gastos este mes
                    </div>
                    {isLoading ? (
                        <div className="w-32 h-10 bg-[var(--bg-nested)] animate-pulse rounded-lg mt-1" />
                    ) : (
                        <>
                            <div className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-primary)] mb-2 mt-1">
                                {formatCurrency(expense)}
                            </div>
                            <div className="flex items-center gap-1 text-xs font-semibold text-[#ef4444] mt-2">
                                Total gastado
                            </div>
                        </>
                    )}
                </div>

            </div>

            {/* Middle Section: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Flujo de caja (Wider) */}
                <div className="lg:col-span-2 bg-[var(--bg-card)] p-6 rounded-xl shadow-sm border border-[var(--glass-border)] flex flex-col">
                    <div className="mb-4">
                        <h3 className="text-base font-bold text-[var(--text-primary)]">Flujo de Caja Mensual</h3>
                    </div>
                    {isLoading ? (
                        <div className="flex-1 min-h-[300px] w-full bg-[var(--bg-nested)] rounded-lg animate-pulse" />
                    ) : (
                        <div className="min-h-[300px] flex-1">
                            <MonthlyOverviewChart transactions={transactions || []} />
                        </div>
                    )}
                </div>

                {/* Distribución por especialidad (Gastos por Categoría) */}
                <div className="lg:col-span-1 bg-[var(--bg-card)] p-6 rounded-xl shadow-sm border border-[var(--glass-border)] flex flex-col">
                    <div className="mb-4">
                        <h3 className="text-base font-bold text-[var(--text-primary)]">Distribución de Gastos</h3>
                    </div>
                    {isLoading ? (
                        <div className="flex-1 min-h-[300px] w-full bg-[var(--bg-nested)] rounded-lg animate-pulse" />
                    ) : (
                        <div className="min-h-[300px] flex items-center justify-center flex-1">
                            <CategoryExpensesChart transactions={transactions || []} />
                        </div>
                    )}
                </div>

            </div>

            {/* Bottom Section: Activity & Budget */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">

                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-[var(--bg-card)] p-6 rounded-xl shadow-sm border border-[var(--glass-border)] flex flex-col">
                    <div className="flex items-center justify-between mb-2 pb-3 border-b border-[var(--glass-border)]">
                        <h3 className="text-base font-bold text-[var(--text-primary)]">Actividad Reciente</h3>
                        <Link href="/dashboard/transactions" className="text-sm font-semibold text-[#6366f1] hover:text-[#4f46e5] transition-colors">
                            Ver todas
                        </Link>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                        {isLoading ? (
                            <div className="space-y-3 mt-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="flex gap-4 animate-pulse pt-2">
                                        <div className="w-10 h-10 bg-[var(--bg-nested)] rounded-lg" />
                                        <div className="flex-1 space-y-2 py-1">
                                            <div className="h-4 bg-[var(--bg-nested)] rounded w-1/3" />
                                            <div className="h-3 bg-[var(--bg-nested)] rounded w-1/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : transactions?.length === 0 ? (
                            <div className="text-center py-10 flex flex-col items-center">
                                <History className="w-10 h-10 text-[var(--text-muted)] mb-3 opacity-50" />
                                <p className="text-[var(--text-secondary)] font-medium text-sm">Sin transacciones recientes</p>
                            </div>
                        ) : (
                            <table className="w-full mt-2 text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--glass-border)]/50">
                                        <th className="pb-2.5 font-bold w-12"></th>
                                        <th className="pb-2.5 font-bold">Descripción</th>
                                        <th className="pb-2.5 font-bold">Fecha</th>
                                        <th className="pb-2.5 font-bold text-right">Monto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions?.slice(0, 6).map((tx: any) => (
                                        <tr key={tx.id} className="group border-b border-[var(--glass-border)]/50 last:border-0 hover:bg-[var(--bg-nested)] transition-colors">
                                            <td className="py-2.5 pr-4">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                    tx.type === "income" ? "bg-[#10b981]/15 text-[#10b981]" :
                                                    tx.type === "expense" ? "bg-[#ef4444]/15 text-[#ef4444]" : 
                                                    "bg-[var(--bg-nested)] text-[var(--text-tertiary)]"
                                                }`}>
                                                    {tx.type === "income" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                                </div>
                                            </td>
                                            <td className="py-2.5 pr-4">
                                                <div className="font-semibold text-[13px] md:text-sm text-[var(--text-primary)]">{tx.description || "Transacción"}</div>
                                            </td>
                                            <td className="py-2.5 pr-4">
                                                <div className="text-[13px] text-[var(--text-tertiary)]">{format(new Date(tx.date), "d MMM, yyyy", { locale: es })}</div>
                                            </td>
                                            <td className="py-2.5 text-right">
                                                <div className={`font-bold text-[13px] md:text-sm ${tx.type === "income" ? "text-[#10b981]" : "text-[var(--text-primary)]"}`}>
                                                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Budgets Wrapper */}
                <div className="lg:col-span-1 bg-[var(--bg-card)] p-6 rounded-xl shadow-sm border border-[var(--glass-border)] flex flex-col">
                    <div className="flex items-center justify-between mb-4 border-b border-[var(--glass-border)] pb-3">
                        <h3 className="text-base font-bold text-[var(--text-primary)]">Presupuestos</h3>
                    </div>
                    {!isLoading && categories && transactions ? (
                        <div className="mt-2">
                            <BudgetProgress transactions={transactions} categories={categories as any} />
                        </div>
                    ) : (
                        <div className="flex-1 min-h-[200px] w-full bg-[var(--bg-nested)] rounded-lg animate-pulse" />
                    )}
                </div>

            </div>

        </div>
    );
}
