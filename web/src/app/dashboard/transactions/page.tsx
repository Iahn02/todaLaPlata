"use client";

import { useState, useMemo } from "react";
import { trpc } from "@/trpc/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowDownCircle, ArrowUpCircle, Filter, Search, Tag as TagIcon, CreditCard, Trash2, Calendar, ArrowRightLeft } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Category } from "@prisma/client";

import { ExportCSVButton } from "@/components/ExportCSVButton";

const resolveIcon = (iconName?: string | null) => {
    if (!iconName) return ArrowRightLeft;
    const normalizedName = iconName.split('-').map(str => str.charAt(0).toUpperCase() + str.slice(1)).join('');
    const IconComponent = (LucideIcons as any)[normalizedName];
    return IconComponent || TagIcon;
};

export default function TransactionsPage() {
    const { data: transactions, isLoading } = trpc.transactions.getAll.useQuery();
    const { data: lookups } = trpc.lookups.getEssentialData.useQuery();

    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filteredTransactions = useMemo(() => {
        if (!transactions) return [];
        return transactions.filter((tx: any) => {
            const matchesSearch =
                tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tx.amount.toString().includes(searchTerm) ||
                tx.category?.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === "all" || tx.type === filterType;
            const matchesCategory = filterCategory === "all" || tx.categoryId === filterCategory;
            return matchesSearch && matchesType && matchesCategory;
        });
    }, [transactions, searchTerm, filterType, filterCategory]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto space-y-5">

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Transacciones</h1>
                    <p className="text-[var(--text-tertiary)] text-sm mt-1">Revisa tu historial completo de movimientos.</p>
                </div>
                <ExportCSVButton />
            </header>

            {/* Search & Filters */}
            <div className="bg-[var(--bg-card)] p-4 rounded-2xl shadow-[var(--shadow-md)] border border-[var(--glass-border)] flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, monto o categoría..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--bg-nested)] border border-[var(--glass-border)] rounded-xl py-3 pl-10 pr-4 text-[var(--text-primary)] text-sm font-medium placeholder:text-[var(--text-muted)] focus:bg-[var(--bg-card)] focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]/30 transition-all outline-none"
                    />
                </div>
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all md:w-auto w-full 
                        ${isFilterOpen || filterType !== "all" || filterCategory !== "all"
                            ? "bg-[#6366f1]/10 text-[#6366f1] dark:text-[#818cf8] hover:bg-[#6366f1]/15"
                            : "bg-[var(--bg-nested)] text-[var(--text-tertiary)] hover:bg-[var(--bg-nested)]/80"}`}
                >
                    <Filter className="w-4 h-4" />
                    Filtros
                    {(filterType !== "all" || filterCategory !== "all") && (
                        <span className="w-2 h-2 bg-[#6366f1] rounded-full ml-1" />
                    )}
                </button>
            </div>

            {/* Expandable Filters */}
            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-[var(--bg-card)] p-5 rounded-2xl shadow-[var(--shadow-md)] border border-[var(--glass-border)] grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                                    Filtrar por Tipo
                                </label>
                                <div className="flex bg-[var(--bg-nested)] p-1 rounded-xl">
                                    {["all", "expense", "income"].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setFilterType(type as any)}
                                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all capitalize ${filterType === type
                                                ? type === "income" ? "bg-[var(--bg-card)] text-[#10b981] shadow-sm"
                                                    : type === "expense" ? "bg-[var(--bg-card)] text-[#ef4444] shadow-sm"
                                                        : "bg-[var(--bg-card)] text-[#6366f1] dark:text-[#818cf8] shadow-sm"
                                                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                                }`}
                                        >
                                            {type === "all" ? "Todos" : type === "income" ? "Ingresos" : "Gastos"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                                    Categoría
                                </label>
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="w-full bg-[var(--bg-nested)] border border-[var(--glass-border)] rounded-xl py-2.5 px-4 text-[var(--text-primary)] text-sm font-medium appearance-none outline-none focus:ring-2 focus:ring-[#6366f1]/20"
                                >
                                    <option value="all">Todas las Categorías</option>
                                    {lookups?.categories.map((cat: Category) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {(filterType !== "all" || filterCategory !== "all" || searchTerm !== "") && (
                                <div className="col-span-full pt-3 border-t border-[var(--glass-border)] flex justify-end">
                                    <button
                                        onClick={() => { setFilterType("all"); setFilterCategory("all"); setSearchTerm(""); setIsFilterOpen(false); }}
                                        className="text-sm font-semibold text-[var(--text-muted)] hover:text-[#ef4444] transition-colors"
                                    >
                                        Limpiar Filtros
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Transaction List */}
            <div className="bg-[var(--bg-card)] rounded-2xl shadow-[var(--shadow-md)] border border-[var(--glass-border)] overflow-hidden">
                <div className="p-4 md:p-5 pb-2">
                    <h2 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 text-sm">
                        Resultados <span className="text-[var(--text-muted)] font-normal">({filteredTransactions.length})</span>
                    </h2>
                </div>

                <div className="divide-y divide-[var(--glass-border)]">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="p-4 md:p-5 flex gap-4 animate-pulse">
                                <div className="w-11 h-11 bg-[var(--bg-nested)] rounded-xl flex-shrink-0" />
                                <div className="flex-1 space-y-2.5 py-1">
                                    <div className="h-4 bg-[var(--bg-nested)] rounded w-1/3" />
                                    <div className="h-3 bg-[var(--bg-nested)] rounded w-1/4" />
                                </div>
                            </div>
                        ))
                    ) : filteredTransactions.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-[var(--bg-nested)] text-[var(--text-muted)] rounded-2xl flex items-center justify-center mb-4">
                                <Search className="w-7 h-7" />
                            </div>
                            <p className="text-[var(--text-primary)] font-medium">No encontramos movimientos</p>
                            <p className="text-[var(--text-muted)] text-sm mt-1 max-w-sm">Prueba ajustando los filtros o registra una nueva transacción.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <AnimatePresence>
                                {filteredTransactions.map((tx: any) => {
                                    const CatIcon = resolveIcon(tx.category?.icon);
                                    const isIncome = tx.type === "income";

                                    return (
                                        <motion.div
                                            key={tx.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="group flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 hover:bg-[var(--bg-nested)]/50 transition-colors gap-3"
                                        >
                                            <div className="flex items-center gap-3.5">
                                                <div
                                                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0 relative overflow-hidden"
                                                    style={{ backgroundColor: tx.category?.color || "#94a3b8" }}
                                                >
                                                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                                                    <CatIcon className="w-5 h-5 z-10" />
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-[var(--text-primary)] text-sm truncate max-w-[200px] md:max-w-xs leading-tight">
                                                        {tx.description || tx.category?.name || "Sin Clasificar"}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-[var(--text-muted)]">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3 opacity-60" />
                                                            {format(new Date(tx.date), "dd MMM yyyy", { locale: es })}
                                                        </span>
                                                        <span className="hidden md:flex items-center gap-1">
                                                            <TagIcon className="w-3 h-3 opacity-60" />
                                                            {tx.category?.name || "General"}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <CreditCard className="w-3 h-3 opacity-60" />
                                                            {tx.account.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between md:justify-end w-full md:w-auto mt-1 md:mt-0">
                                                <div className={`text-base md:text-lg font-bold tracking-tight md:mr-4 ${isIncome ? "text-[#10b981]" : "text-[var(--text-primary)]"}`}>
                                                    {isIncome ? "+" : "-"}{formatCurrency(tx.amount)}
                                                </div>
                                                <TxActionButtons txId={tx.id} />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function TxActionButtons({ txId }: { txId: string }) {
    const utils = trpc.useUtils();
    const deleteMut = trpc.transactions.delete.useMutation({
        onSuccess: () => {
            utils.transactions.getAll.invalidate();
        }
    });

    return (
        <div className="flex items-center gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
                onClick={() => { if (confirm("¿Borrar esta transacción permanentemente?")) deleteMut.mutate({ id: txId }) }}
                disabled={deleteMut.isPending}
                className="p-2 text-[var(--text-muted)] hover:text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg transition-all active:scale-95 disabled:opacity-50"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    )
}
