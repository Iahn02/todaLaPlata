"use client";

import { trpc } from "@/trpc/client";
import { ArrowDownRight, ArrowUpRight, Wallet, Activity } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MonthlyOverviewChart } from "@/components/charts/MonthlyOverviewChart";
import { CategoryExpensesChart } from "@/components/charts/CategoryExpensesChart";
import { BudgetProgress } from "@/components/BudgetProgress";

export default function DashboardPage() {
    const { data: transactions, isLoading } = trpc.transactions.getAll.useQuery();
    const { data: categories } = trpc.categories.getAll.useQuery();

    // Calcular resumen
    const income = transactions?.filter((t: any) => t.type === "income").reduce((acc: number, t: any) => acc + t.amount, 0) || 0;
    const expense = transactions?.filter((t: any) => t.type === "expense").reduce((acc: number, t: any) => acc + t.amount, 0) || 0;
    const balance = income - expense;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">

            <header className="mb-8 hidden md:block">
                <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">Resumen Financiero</h1>
                <p className="text-[#6b6b6b] mt-1">Controla en tiempo real tus ingresos y gastos semanales.</p>
            </header>

            {/* Cards de Resumen */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8">
                {/* Balance Total */}
                <div className="col-span-2 md:col-span-1 bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-[#e8d8c9]/60 flex flex-col justify-between overflow-hidden relative group">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-[#f3701e]/5 rounded-bl-full -z-0 transition-transform group-hover:scale-110 duration-500" />
                    <div className="flex items-center gap-3 text-[#6b6b6b] font-medium text-sm z-10">
                        <div className="p-2 bg-[#f3701e]/10 text-[#f3701e] rounded-lg">
                            <Wallet className="w-5 h-5" />
                        </div>
                        Balance Total
                    </div>
                    {isLoading ? (
                        <div className="w-32 h-8 bg-[#e8d8c9]/50 animate-pulse mt-4 rounded-md" />
                    ) : (
                        <div className="mt-4 z-10 text-3xl md:text-4xl font-bold tracking-tight text-[#1a1a1a]">
                            {formatCurrency(balance)}
                        </div>
                    )}
                </div>

                {/* Ingresos */}
                <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-[#e8d8c9]/60 flex flex-col justify-between h-36 border-t-4 border-t-[#4b607f]">
                    <div className="flex items-center gap-2 md:gap-3 text-[#6b6b6b] font-medium text-xs md:text-sm">
                        <div className="hidden md:flex p-1.5 bg-[#4b607f]/10 text-[#4b607f] rounded-lg">
                            <ArrowUpRight className="w-4 h-4" />
                        </div>
                        Ingresos
                    </div>
                    {isLoading ? (
                        <div className="w-24 h-6 bg-[#e8d8c9]/50 animate-pulse mt-4 rounded-md" />
                    ) : (
                        <div className="mt-2 md:mt-4 text-xl md:text-2xl font-bold text-[#4b607f] tracking-tight truncate">
                            +{formatCurrency(income)}
                        </div>
                    )}
                </div>

                {/* Gastos */}
                <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-[#e8d8c9]/60 flex flex-col justify-between h-36 border-t-4 border-t-[#c95d45]">
                    <div className="flex items-center gap-2 md:gap-3 text-[#6b6b6b] font-medium text-xs md:text-sm">
                        <div className="hidden md:flex p-1.5 bg-[#c95d45]/10 text-[#c95d45] rounded-lg">
                            <ArrowDownRight className="w-4 h-4" />
                        </div>
                        Gastos
                    </div>
                    {isLoading ? (
                        <div className="w-24 h-6 bg-[#e8d8c9]/50 animate-pulse mt-4 rounded-md" />
                    ) : (
                        <div className="mt-2 md:mt-4 text-xl md:text-2xl font-bold text-[#c95d45] tracking-tight truncate">
                            -{formatCurrency(expense)}
                        </div>
                    )}
                </div>
            </div>

            {/* Gráficos y Resúmenes Adicionales */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Gráfico Principal: Tendencia */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-[#e8d8c9]/60 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-lg text-[#1a1a1a]">Flujo de Caja Mensual</h3>
                    </div>
                    {isLoading ? (
                        <div className="flex-1 min-h-[300px] w-full bg-[#f5f0eb] rounded-2xl animate-pulse" />
                    ) : (
                        <MonthlyOverviewChart transactions={transactions || []} />
                    )}
                </div>

                {/* Gráfico Secundario: Categorías */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#e8d8c9]/60 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-lg text-[#1a1a1a]">Gastos por Categoría</h3>
                    </div>
                    {isLoading ? (
                        <div className="flex-1 min-h-[300px] w-full bg-[#f5f0eb] rounded-2xl animate-pulse" />
                    ) : (
                        <CategoryExpensesChart transactions={transactions || []} />
                    )}
                </div>

            </div>

            {/* Últimas Transacciones Lista Rápida */}
            <div className="mt-6 bg-white p-6 rounded-3xl shadow-sm border border-[#e8d8c9]/60">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg text-[#1a1a1a]">Actividad Reciente</h3>
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex gap-4 animate-pulse">
                                <div className="w-10 h-10 bg-[#e8d8c9]/50 rounded-xl" />
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-4 bg-[#e8d8c9]/50 rounded w-3/4" />
                                    <div className="h-3 bg-[#e8d8c9]/50 rounded w-1/2" />
                                </div>
                            </div>
                        ))
                    ) : transactions?.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-[#6b6b6b] text-sm">No hay transacciones todavía.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {transactions?.slice(0, 6).map((tx: any) => (
                                <div key={tx.id} className="flex items-center justify-between group cursor-pointer hover:bg-[#f5f0eb] p-3 rounded-2xl transition-colors border border-transparent hover:border-[#e8d8c9]">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.type === "income" ? "bg-[#4b607f]/10 text-[#4b607f]" :
                                            tx.type === "expense" ? "bg-[#c95d45]/10 text-[#c95d45]" : "bg-[#e8d8c9] text-[#6b6b6b]"
                                            }`}>
                                            {tx.type === "income" ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-[#1a1a1a]">{tx.description || "Transacción"}</p>
                                            <p className="text-xs text-[#6b6b6b]">{format(new Date(tx.date), "d MMM", { locale: es })}</p>
                                        </div>
                                    </div>
                                    <div className={`font-semibold text-sm ${tx.type === "income" ? "text-[#4b607f]" : "text-[#1a1a1a]"}`}>
                                        {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Presupuestos */}
            {!isLoading && categories && transactions && (
                <BudgetProgress transactions={transactions} categories={categories as any} />
            )}

        </div>
    );
}
