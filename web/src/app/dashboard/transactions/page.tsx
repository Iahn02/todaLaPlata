"use client";

import { useState, useMemo } from "react";
import { trpc } from "@/trpc/client";
import { format, isSameMonth, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowDownCircle, ArrowUpCircle, Filter, Search, Tag as TagIcon, CreditCard, Trash2, Calendar, ArrowRightLeft } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Category } from "@prisma/client";

import { ExportCSVButton } from "@/components/ExportCSVButton";

// Helper para convertir nombre string a Icon de lucide
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

    // Filter Logic
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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto space-y-6 md:space-y-8">

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Transacciones</h1>
                    <p className="text-[var(--text-tertiary)] mt-1">Revisa tu historial completo de movimientos.</p>
                </div>
                <ExportCSVButton />
            </header>

            {/* BARRA DE BÚSQUEDA Y CONTROLES */}
            <div className="bg-white p-4 md:p-5 rounded-3xl shadow-sm border border-[#e8d8c9]/60 flex flex-col md:flex-row gap-4">
                {/* Búsqueda Global */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9a9a9a]" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, monto o categoría..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#f5f0eb] border-none rounded-2xl py-3.5 pl-11 pr-4 text-[#1a1a1a] font-medium placeholder:text-[#9a9a9a] focus:bg-white focus:ring-2 focus:ring-[#f3701e]/20 transition-all outline-none"
                    />
                </div>

                {/* Filtros Trigger */}
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold transition-all md:w-auto w-full 
                        ${isFilterOpen || filterType !== "all" || filterCategory !== "all"
                            ? "bg-[#f3701e]/10 text-[#f3701e] hover:bg-[#f3701e]/15"
                            : "bg-[#f5f0eb] text-[#6b6b6b] hover:bg-[#e8d8c9]"}`}
                >
                    <Filter className="w-5 h-5" />
                    Filtros
                    {(filterType !== "all" || filterCategory !== "all") && (
                        <span className="w-2 h-2 bg-[#f3701e] rounded-full ml-1" />
                    )}
                </button>
            </div>

            {/* FILTROS EXPANDIBLES */}
            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#e8d8c9]/60 grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Tipo de Transacción */}
                            <div>
                                <label className="block text-xs font-semibold text-[#6b6b6b] uppercase tracking-wider mb-3">
                                    Filtrar por Tipo
                                </label>
                                <div className="flex bg-[#f5f0eb] p-1.5 rounded-2xl">
                                    {["all", "expense", "income"].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setFilterType(type as any)}
                                            className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all capitalize ${filterType === type
                                                ? type === "income" ? "bg-white text-[#4b607f] shadow-sm"
                                                    : type === "expense" ? "bg-white text-[#c95d45] shadow-sm"
                                                        : "bg-white text-[#f3701e] shadow-sm"
                                                : "text-[#6b6b6b] hover:text-[#1a1a1a]"
                                                }`}
                                        >
                                            {type === "all" ? "Todos" : type === "income" ? "Ingresos" : "Gastos"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Categoría */}
                            <div>
                                <label className="block text-xs font-semibold text-[#6b6b6b] uppercase tracking-wider mb-3">
                                    Categoría
                                </label>
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="w-full bg-[#f5f0eb] border-none rounded-2xl py-3 px-4 text-[#1a1a1a] font-medium appearance-none outline-none focus:ring-2 focus:ring-[#f3701e]/20"
                                >
                                    <option value="all">Todas las Categorías</option>
                                    {lookups?.categories.map((cat: Category) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Limpiar Filtros */}
                            {(filterType !== "all" || filterCategory !== "all" || searchTerm !== "") && (
                                <div className="col-span-full pt-4 border-t border-[#e8d8c9] flex justify-end">
                                    <button
                                        onClick={() => { setFilterType("all"); setFilterCategory("all"); setSearchTerm(""); setIsFilterOpen(false); }}
                                        className="text-sm font-semibold text-[#6b6b6b] hover:text-[#c95d45] transition-colors"
                                    >
                                        Limpiar Filtros
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LISTADO DE TRANSACCIONES */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#e8d8c9]/60 overflow-hidden">
                <div className="p-4 md:p-6 pb-2">
                    <h2 className="font-semibold text-lg text-[#1a1a1a] flex items-center gap-2">
                        Resultados <span className="text-[#9a9a9a] font-normal text-sm">({filteredTransactions.length})</span>
                    </h2>
                </div>

                <div className="divide-y divide-[#e8d8c9]/40">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="p-4 md:p-5 flex gap-4 animate-pulse">
                                <div className="w-12 h-12 bg-[#e8d8c9]/50 rounded-2xl flex-shrink-0" />
                                <div className="flex-1 space-y-3 py-1">
                                    <div className="h-4 bg-[#e8d8c9]/50 rounded w-1/3" />
                                    <div className="h-3 bg-[#e8d8c9]/50 rounded w-1/4" />
                                </div>
                            </div>
                        ))
                    ) : filteredTransactions.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-[#f5f0eb] text-[#e8d8c9] rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8" />
                            </div>
                            <p className="text-[#1a1a1a] font-medium text-lg">No encontramos movimientos</p>
                            <p className="text-[#9a9a9a] text-sm mt-1 max-w-sm">Prueba ajustando los filtros de búsqueda o registra una nueva transacción usando el botón flotante.</p>
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
                                            className="group flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 hover:bg-[#f5f0eb]/80 transition-colors gap-4"
                                        >
                                            {/* Info Core */}
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm flex-shrink-0 relative overflow-hidden"
                                                    style={{ backgroundColor: tx.category?.color || "#9a9a9a" }}
                                                >
                                                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                                                    <CatIcon className="w-6 h-6 z-10" />
                                                </div>

                                                <div>
                                                    <p className="font-bold text-[#1a1a1a] text-[15px] truncate max-w-[200px] md:max-w-xs block leading-tight">
                                                        {tx.description || tx.category?.name || "Sin Clasificar"}
                                                    </p>

                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs font-semibold text-[#6b6b6b]">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3.5 h-3.5 opacity-70" />
                                                            {format(new Date(tx.date), "dd MMM yyyy", { locale: es })}
                                                        </span>
                                                        <span className="hidden md:flex items-center gap-1">
                                                            <TagIcon className="w-3.5 h-3.5 opacity-70" />
                                                            {tx.category?.name || "Gasto general"}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-[#4b607f]/80">
                                                            <CreditCard className="w-3.5 h-3.5" />
                                                            {tx.account.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Monto & Acciones Rapidas */}
                                            <div className="flex items-center justify-between md:justify-end w-full md:w-auto mt-2 md:mt-0">

                                                <div className={`text-lg md:text-xl font-bold tracking-tight md:mr-6 ${isIncome ? "text-[#4b607f]" : "text-[#1a1a1a]"}`}>
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

// Subcomponente aislado para el boton delete con loading state para no rerenderizar todo 
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
                className="p-2.5 text-[#9a9a9a] hover:text-[#c95d45] hover:bg-[#c95d45]/10 rounded-xl transition-all active:scale-95 disabled:opacity-50"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    )
}
