"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";
import { Plus, Trash2, Edit2, Loader2, Save, X, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Category, Budget } from "@prisma/client";

type CategoryWithBudgets = Category & { budgets?: Budget[] };

const resolveIcon = (iconName: string) => {
    const normalizedName = iconName.split('-').map(str => str.charAt(0).toUpperCase() + str.slice(1)).join('');
    const IconComponent = (LucideIcons as any)[normalizedName];
    return IconComponent || LucideIcons.Tag;
};

const PREDEFINED_COLORS = [
    "#6366f1", "#8b5cf6", "#ec4899", "#ef4444",
    "#f59e0b", "#10b981", "#06b6d4", "#3b82f6",
    "#14b8a6", "#84cc16", "#f97316", "#d946ef",
];

const PREDEFINED_ICONS = [
    "tag", "home", "car", "shopping-cart", "gift",
    "briefcase", "coffee", "smartphone", "zap",
    "heart", "book", "activity", "alert-circle",
    "music", "plane", "smile", "utensils"
];

export default function CategoriesPage() {
    const { data: categories, isLoading } = trpc.categories.getAll.useQuery();
    const utils = trpc.useUtils();

    const [filterType, setFilterType] = useState<"expense" | "income">("expense");
    const [editingCatId, setEditingCatId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const filteredCategories = categories?.filter((c: CategoryWithBudgets) => c.type === filterType) || [];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
            <header className="mb-8 hidden md:flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Tus Categorías</h1>
                    <p className="text-[var(--text-tertiary)] text-sm mt-1">Agrupa tus movimientos y organiza tu dinero.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-medium text-sm rounded-xl hover:shadow-lg hover:shadow-[#6366f1]/25 active:scale-95 transition-all"
                >
                    <Plus className="w-4 h-4" /> Nueva Categoría
                </button>
            </header>

            <button
                onClick={() => setIsCreating(true)}
                className="md:hidden fixed bottom-24 right-6 z-40 w-12 h-12 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-full shadow-xl shadow-[#6366f1]/25 flex items-center justify-center transition-all active:scale-90"
            >
                <Plus className="w-5 h-5" />
            </button>

            {/* Type Selector */}
            <div className="flex bg-[var(--bg-nested)] p-1 rounded-xl mb-8 max-w-xs border border-[var(--glass-border)] transition-colors">
                <button
                    onClick={() => setFilterType("expense")}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${filterType === "expense"
                        ? "bg-[var(--bg-card)] text-[#ef4444] shadow-sm"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        }`}
                >
                    <ArrowDownCircle className="w-4 h-4" /> Gastos
                </button>
                <button
                    onClick={() => setFilterType("income")}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${filterType === "income"
                        ? "bg-[var(--bg-card)] text-[#10b981] shadow-sm"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        }`}
                >
                    <ArrowUpCircle className="w-4 h-4" /> Ingresos
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                    {isCreating && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="col-span-1"
                        >
                            <CategoryEditorForm
                                type={filterType}
                                onCancel={() => setIsCreating(false)}
                                onSuccess={() => { setIsCreating(false); utils.categories.getAll.invalidate(); }}
                            />
                        </motion.div>
                    )}

                    {isLoading && !categories ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-[var(--bg-nested)] h-24 rounded-2xl animate-pulse" />
                    )) : (
                        filteredCategories.map((cat: CategoryWithBudgets) => (
                            <motion.div
                                layout key={cat.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="col-span-1"
                            >
                                {editingCatId === cat.id ? (
                                    <CategoryEditorForm
                                        category={cat}
                                        onCancel={() => setEditingCatId(null)}
                                        onSuccess={() => { setEditingCatId(null); utils.categories.getAll.invalidate(); }}
                                    />
                                ) : (
                                    <CategoryCard category={cat} formatCurrency={formatCurrency} onEdit={() => setEditingCatId(cat.id)} />
                                )}
                            </motion.div>
                        ))
                    )}

                    {!isLoading && filteredCategories.length === 0 && !isCreating && (
                        <div className="col-span-full py-16 flex flex-col items-center justify-center text-[var(--text-muted)] border-2 border-dashed border-[var(--glass-border)] rounded-2xl bg-[var(--bg-nested)]/50 transition-colors">
                            <LucideIcons.Tags className="w-12 h-12 mb-4 text-[var(--text-muted)]" />
                            <p className="font-medium text-lg text-[var(--text-tertiary)]">No hay categorías de este tipo.</p>
                            <p className="text-sm mt-1">Toca en Nueva Categoría para crear una.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function CategoryCard({ category, formatCurrency, onEdit }: { category: CategoryWithBudgets, formatCurrency: (amount: number) => string, onEdit: () => void }) {
    const Icon = resolveIcon(category.icon);
    const budget = category.budgets?.find((b: Budget) => b.period === "monthly");

    const deleteMut = trpc.categories.delete.useMutation({
        onSuccess: () => {
            const utils = trpc.useUtils();
            utils.categories.getAll.invalidate();
        }
    });

    return (
        <div className="group bg-[var(--bg-card)] p-4 flex-col md:flex-row rounded-2xl shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] border border-[var(--glass-border)] transition-all duration-300 flex md:items-center justify-between overflow-hidden relative gap-3">
            <div className="absolute top-0 right-0 w-20 h-20 opacity-[0.06] rounded-bl-[80px] pointer-events-none transition-transform group-hover:scale-125 duration-500" style={{ backgroundColor: category.color }} />

            <div className="flex items-center gap-3.5 z-10">
                <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg relative overflow-hidden transition-transform group-hover:-translate-y-0.5 flex-shrink-0"
                    style={{ backgroundColor: category.color, boxShadow: `0 8px 16px -4px ${category.color}40` }}
                >
                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                    <Icon className="w-5 h-5 z-10" />
                </div>
                <div className="flex flex-col">
                    <h3 className="font-bold text-[15px] text-[var(--text-primary)] truncate max-w-[150px]" title={category.name}>{category.name}</h3>
                    {budget && budget.amount > 0 && (
                        <p className="text-[11px] font-medium text-[var(--text-muted)]">Ppto: {formatCurrency(budget.amount)}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-1 z-10 self-end md:self-auto opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onEdit} className="p-1.5 text-[var(--text-muted)] hover:text-[#6366f1] hover:bg-[var(--bg-nested)] rounded-lg transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                    onClick={() => { if (confirm("¿Seguro que deseas eliminar esta categoría?")) deleteMut.mutate({ id: category.id }) }}
                    disabled={deleteMut.isPending}
                    className="p-1.5 text-[var(--text-muted)] hover:text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg transition-colors"
                >
                    {deleteMut.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
            </div>
        </div>
    );
}

function CategoryEditorForm({
    category, type, onCancel, onSuccess
}: {
    category?: CategoryWithBudgets,
    type?: "income" | "expense",
    onCancel: () => void,
    onSuccess: () => void
}) {
    const existingBudget = category?.budgets?.find((b: Budget) => b.period === "monthly");

    const [name, setName] = useState(category?.name || "");
    const [color, setColor] = useState(category?.color || PREDEFINED_COLORS[0]);
    const [icon, setIcon] = useState(category?.icon || PREDEFINED_ICONS[0]);
    const [monthlyBudget, setMonthlyBudget] = useState(existingBudget?.amount?.toString() || "");
    const [showIcons, setShowIcons] = useState(false);

    const createMut = trpc.categories.create.useMutation({ onSuccess });
    const updateMut = trpc.categories.update.useMutation({ onSuccess });

    const isPending = createMut.isPending || updateMut.isPending;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        const parsedBudget = monthlyBudget ? parseFloat(monthlyBudget) : 0;
        if (category) {
            updateMut.mutate({ id: category.id, name, color, icon, monthlyBudget: parsedBudget });
        } else {
            createMut.mutate({ name, color, icon, type: type!, monthlyBudget: parsedBudget });
        }
    };

    const SelectedIcon = resolveIcon(icon);

    return (
        <form onSubmit={handleSubmit} className="bg-[var(--bg-card)] p-5 rounded-2xl shadow-[var(--shadow-lg)] border border-[var(--glass-border)] ring-2 ring-[#6366f1]/10 flex flex-col gap-4 relative z-20 transition-colors">
            <div className="flex items-start gap-4">
                <div
                    onClick={() => setShowIcons(!showIcons)}
                    className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center text-white shadow-lg cursor-pointer transform hover:scale-105 transition-all outline outline-2 outline-offset-2"
                    style={{ backgroundColor: color, outlineColor: color, boxShadow: `0 4px 14px 0 ${color}40` }}
                >
                    <SelectedIcon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                    <input
                        type="text" required autoFocus placeholder="Ej: Alimentación..."
                        value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full text-base font-bold text-[var(--text-primary)] placeholder:text-[var(--text-muted)] border-b-2 border-transparent focus:border-[#6366f1] bg-transparent py-1 transition-all outline-none"
                    />
                    {(!category || category.type === "expense") && (type === "expense" || category?.type === "expense") && (
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-[var(--text-muted)]">Ppto. Mensual:</span>
                            <div className="relative flex-1">
                                <span className="absolute left-2 top-1.5 text-[11px] text-[var(--text-muted)]">$</span>
                                <input
                                    type="number" min="0" placeholder="Ilimitado"
                                    value={monthlyBudget} onChange={(e) => setMonthlyBudget(e.target.value)}
                                    className="w-full text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] border border-[var(--glass-border)] rounded-lg bg-[var(--bg-nested)] py-1 pl-5 pr-2 transition-all outline-none focus:border-[#6366f1]"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {showIcons && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-3 bg-[var(--bg-nested)] border border-[var(--glass-border)] rounded-xl mt-1 grid grid-cols-6 gap-1.5">
                            {PREDEFINED_ICONS.map(iName => {
                                const Icn = resolveIcon(iName);
                                return (
                                    <button
                                        key={iName} type="button"
                                        onClick={() => { setIcon(iName); setShowIcons(false); }}
                                        className={`aspect-square flex items-center justify-center rounded-lg transition-all ${icon === iName ? 'bg-[#6366f1]/10 text-[#6366f1]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]'}`}
                                    >
                                        <Icn className="w-4 h-4" />
                                    </button>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between mt-1 pt-3 border-t border-[var(--glass-border)]">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pr-4">
                    {PREDEFINED_COLORS.map(c => (
                        <button
                            key={c} type="button" onClick={() => setColor(c)}
                            className={`w-5 h-5 rounded-full flex-shrink-0 transition-transform ${color === c ? 'scale-125 ring-2 ring-offset-2 ring-[var(--text-primary)] ring-offset-[var(--bg-card)]' : 'hover:scale-110'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <button type="button" onClick={onCancel} className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-nested)] rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                    <button
                        type="submit" disabled={isPending || !name.trim()}
                        className="p-2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-lg transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-[#6366f1]/25"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </form>
    );
}
