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
    "#c95d45", "#f3701e", "#e2ba65", "#f59e0b",
    "#5a8a6a", "#10b981", "#14b8a6", "#4b607f",
    "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef",
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
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Tus Categorías</h1>
                    <p className="text-[var(--text-tertiary)] mt-1">Agrupa tus movimientos y organiza tu dinero.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[var(--brand-primary)] text-[var(--text-light)] font-medium rounded-xl hover:bg-[#f3701e] hover:shadow-lg hover:shadow-[#f3701e]/20 active:scale-95 transition-all"
                >
                    <Plus className="w-5 h-5" /> Nueva Categoría
                </button>
            </header>

            <button
                onClick={() => setIsCreating(true)}
                className="md:hidden fixed bottom-24 right-6 z-40 w-14 h-14 bg-[var(--brand-primary)] hover:bg-[#f3701e] text-[var(--text-light)] rounded-full shadow-xl flex items-center justify-center transition-all active:scale-90"
            >
                <Plus className="w-6 h-6" />
            </button>

            {/* Type Selector */}
            <div className="flex bg-[var(--bg-nested)] p-1.5 rounded-2xl mb-8 max-w-sm transition-colors">
                <button
                    onClick={() => setFilterType("expense")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${filterType === "expense"
                        ? "bg-[var(--bg-card)] text-[#c95d45] shadow-sm"
                        : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                        }`}
                >
                    <ArrowDownCircle className="w-4 h-4" /> Gastos
                </button>
                <button
                    onClick={() => setFilterType("income")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${filterType === "income"
                        ? "bg-[var(--bg-card)] text-[#4b607f] shadow-sm"
                        : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
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
                                layout
                                key={cat.id}
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
                        <div className="col-span-full py-16 flex flex-col items-center justify-center text-[var(--text-muted)] border-2 border-dashed border-[var(--brand-cream)]/60 rounded-3xl bg-[var(--bg-nested)] transition-colors">
                            <LucideIcons.Tags className="w-12 h-12 mb-4 text-[var(--brand-cream)]" />
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
        <div className="group bg-[var(--bg-card)] p-5 flex-col md:flex-row rounded-3xl shadow-sm hover:shadow-md border border-[var(--brand-cream)]/60 transition-all duration-300 flex md:items-center justify-between overflow-hidden relative gap-3">
            <div className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-bl-[100px] pointer-events-none transition-transform group-hover:scale-125 duration-500" style={{ backgroundColor: category.color }} />

            <div className="flex items-center gap-4 z-10">
                <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg relative overflow-hidden transition-transform group-hover:-translate-y-1 flex-shrink-0"
                    style={{ backgroundColor: category.color, boxShadow: `0 10px 15px -3px ${category.color}40` }}
                >
                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                    <Icon className="w-6 h-6 z-10" />
                </div>
                <div className="flex flex-col">
                    <h3 className="font-bold text-[17px] text-[var(--text-primary)] truncate max-w-[150px]" title={category.name}>{category.name}</h3>
                    {budget && budget.amount > 0 && (
                        <p className="text-xs font-medium text-[var(--text-tertiary)]">Ppto: {formatCurrency(budget.amount)}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-1 z-10 self-end md:self-auto opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity mt-2 md:mt-0">
                <button
                    onClick={onEdit}
                    className="p-2 text-[var(--text-muted)] hover:text-[#f3701e] hover:bg-[var(--bg-nested)] rounded-lg transition-colors"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => { if (confirm("¿Seguro que deseas eliminar esta categoría?")) deleteMut.mutate({ id: category.id }) }}
                    disabled={deleteMut.isPending}
                    className="p-2 text-[var(--text-muted)] hover:text-[#c95d45] hover:bg-[#c95d45]/10 rounded-lg transition-colors"
                >
                    {deleteMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}


function CategoryEditorForm({
    category,
    type,
    onCancel,
    onSuccess
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
        <form onSubmit={handleSubmit} className="bg-[var(--bg-card)] p-5 rounded-3xl shadow-lg border border-[var(--brand-cream)]/60 ring-2 ring-[#f3701e]/10 flex flex-col gap-4 relative z-20 transition-colors">

            <div className="flex items-start gap-4">
                <div
                    onClick={() => setShowIcons(!showIcons)}
                    className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-white shadow-lg cursor-pointer transform hover:scale-105 transition-all outline outline-2 outline-offset-2"
                    style={{ backgroundColor: color, outlineColor: color, boxShadow: `0 4px 14px 0 ${color}50` }}
                >
                    <SelectedIcon className="w-6 h-6" />
                </div>

                <div className="flex-1">
                    <input
                        type="text"
                        required
                        autoFocus
                        placeholder="Ej: Alimentación..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-lg font-bold text-[var(--text-primary)] placeholder:text-[var(--brand-cream)] border-b-2 border-transparent focus:border-[#f3701e] bg-transparent py-1 transition-all outline-none"
                    />
                    {(!category || category.type === "expense") && (type === "expense" || category?.type === "expense") && (
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs font-semibold text-[var(--text-tertiary)]">Ppto. Mensual:</span>
                            <div className="relative flex-1">
                                <span className="absolute left-2 top-1.5 text-xs text-[var(--text-muted)]">$</span>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Ilimitado"
                                    value={monthlyBudget}
                                    onChange={(e) => setMonthlyBudget(e.target.value)}
                                    className="w-full text-sm text-[var(--text-primary)] placeholder:text-[var(--brand-cream)] border border-[var(--brand-cream)]/40 rounded-lg bg-[var(--bg-nested)] py-1 pl-5 pr-2 transition-all outline-none focus:border-[#f3701e]"
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
                        <div className="p-3 bg-[var(--bg-nested)] border border-[var(--brand-cream)]/40 rounded-2xl mt-2 grid grid-cols-6 gap-2">
                            {PREDEFINED_ICONS.map(iName => {
                                const Icn = resolveIcon(iName);
                                return (
                                    <button
                                        key={iName}
                                        type="button"
                                        onClick={() => { setIcon(iName); setShowIcons(false); }}
                                        className={`aspect-square flex items-center justify-center rounded-xl transition-all ${icon === iName ? 'bg-[#f3701e]/10 text-[#f3701e]' : 'text-[var(--text-muted)] hover:bg-[var(--brand-cream)]/30 hover:text-[var(--text-primary)]'}`}
                                    >
                                        <Icn className="w-5 h-5" />
                                    </button>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between mt-2 pt-4 border-t border-[var(--brand-cream)]/40">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pr-4">
                    {PREDEFINED_COLORS.map(c => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setColor(c)}
                            className={`w-6 h-6 rounded-full flex-shrink-0 transition-transform ${color === c ? 'scale-125 ring-2 ring-offset-2 ring-[var(--text-primary)]' : 'hover:scale-110'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-nested)] rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <button
                        type="submit"
                        disabled={isPending || !name.trim()}
                        className="p-2 bg-[#f3701e] text-white hover:bg-[#d55f15] rounded-xl transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-[#f3701e]/30"
                    >
                        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </form>
    );
}
