"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";
import { Plus, Trash2, Edit2, Loader2, Save, X, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Category } from "@prisma/client";

// Mapeo seguro para transformar string "tag" a componente de lucide: <Tag />
const resolveIcon = (iconName: string) => {
    const normalizedName = iconName.split('-').map(str => str.charAt(0).toUpperCase() + str.slice(1)).join('');
    const IconComponent = (LucideIcons as any)[normalizedName];
    return IconComponent || LucideIcons.Tag;
};

// Una UI premium requiere definir una paleta controlada para que el usuario no ponga negro sobre negro.
const PREDEFINED_COLORS = [
    "#f43f5e", "#ef4444", "#f97316", "#f59e0b",
    "#84cc16", "#10b981", "#14b8a6", "#06b6d4",
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

    const filteredCategories = categories?.filter((c: Category) => c.type === filterType) || [];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
            <header className="mb-8 hidden md:flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tus Categorías</h1>
                    <p className="text-slate-500 mt-1">Agrupa tus movimientos y organiza tu dinero.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 active:scale-95 transition-all"
                >
                    <Plus className="w-5 h-5" /> Nueva Categoría
                </button>
            </header>

            {/* Botón Flotante para Móviles (exclusivo) */}
            <button
                onClick={() => setIsCreating(true)}
                className="md:hidden fixed bottom-24 right-6 z-40 w-14 h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-xl hover:shadow-slate-900/20 flex items-center justify-center transition-all active:scale-90"
            >
                <Plus className="w-6 h-6" />
            </button>

            {/* Selector de Tipo (Income / Expense) */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 max-w-sm">
                <button
                    onClick={() => setFilterType("expense")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${filterType === "expense"
                        ? "bg-white text-rose-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                        }`}
                >
                    <ArrowDownCircle className="w-4 h-4" /> Gastos
                </button>
                <button
                    onClick={() => setFilterType("income")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${filterType === "income"
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
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
                        <div key={i} className="bg-slate-100 h-24 rounded-2xl animate-pulse" />
                    )) : (
                        filteredCategories.map((cat: Category) => (
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
                                    <CategoryCard category={cat} onEdit={() => setEditingCatId(cat.id)} />
                                )}
                            </motion.div>
                        ))
                    )}

                    {!isLoading && filteredCategories.length === 0 && !isCreating && (
                        <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                            <LucideIcons.Tags className="w-12 h-12 mb-4 text-slate-300" />
                            <p className="font-medium text-lg text-slate-500">No hay categorías de este tipo.</p>
                            <p className="text-sm mt-1">Toca en Nueva Categoría para crear una.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function CategoryCard({ category, onEdit }: { category: Category, onEdit: () => void }) {
    const Icon = resolveIcon(category.icon);
    const deleteMut = trpc.categories.delete.useMutation({
        onSuccess: () => {
            const utils = trpc.useUtils();
            utils.categories.getAll.invalidate();
        }
    });

    return (
        <div className="group bg-white p-5 rounded-3xl shadow-sm hover:shadow-md border border-slate-100 transition-all duration-300 flex items-center justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-bl-[100px] pointer-events-none transition-transform group-hover:scale-125 duration-500" style={{ backgroundColor: category.color }} />

            <div className="flex items-center gap-4 z-10">
                <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg relative overflow-hidden transition-transform group-hover:-translate-y-1"
                    style={{ backgroundColor: category.color, boxShadow: `0 10px 15px -3px ${category.color}40` }}
                >
                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                    <Icon className="w-6 h-6 z-10" />
                </div>
                <div>
                    <h3 className="font-bold text-[17px] text-slate-800 truncate max-w-[130px]" title={category.name}>{category.name}</h3>
                </div>
            </div>

            <div className="flex items-center gap-1 z-10 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={onEdit}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => { if (confirm("¿Seguro que deseas eliminar esta categoría? Cualquier transacción vinculada perderá su categoría.")) deleteMut.mutate({ id: category.id }) }}
                    disabled={deleteMut.isPending}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
    category?: Category,
    type?: "income" | "expense",
    onCancel: () => void,
    onSuccess: () => void
}) {
    const [name, setName] = useState(category?.name || "");
    const [color, setColor] = useState(category?.color || PREDEFINED_COLORS[0]);
    const [icon, setIcon] = useState(category?.icon || PREDEFINED_ICONS[0]);
    const [showIcons, setShowIcons] = useState(false);

    const createMut = trpc.categories.create.useMutation({ onSuccess });
    const updateMut = trpc.categories.update.useMutation({ onSuccess });

    const isPending = createMut.isPending || updateMut.isPending;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        if (category) {
            updateMut.mutate({ id: category.id, name, color, icon });
        } else {
            createMut.mutate({ name, color, icon, type: type! });
        }
    };

    const SelectedIcon = resolveIcon(icon);

    return (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-3xl shadow-lg border border-indigo-100 ring-2 ring-indigo-50 flex flex-col gap-4 relative z-20">

            {/* HEADER: Name Input and Header Actions */}
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
                        className="w-full text-lg font-bold text-slate-900 placeholder:text-slate-300 border-b-2 border-transparent focus:border-indigo-500 bg-transparent py-1 transition-all outline-none"
                    />
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
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl mt-2 grid grid-cols-6 gap-2">
                            {PREDEFINED_ICONS.map(iName => {
                                const Icn = resolveIcon(iName);
                                return (
                                    <button
                                        key={iName}
                                        type="button"
                                        onClick={() => { setIcon(iName); setShowIcons(false); }}
                                        className={`aspect-square flex items-center justify-center rounded-xl transition-all ${icon === iName ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-200/50 hover:text-slate-600'}`}
                                    >
                                        <Icn className="w-5 h-5" />
                                    </button>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FOOTER: Colors & Actions */}
            <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pr-4">
                    {PREDEFINED_COLORS.map(c => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setColor(c)}
                            className={`w-6 h-6 rounded-full flex-shrink-0 transition-transform ${color === c ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : 'hover:scale-110'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <button
                        type="submit"
                        disabled={isPending || !name.trim()}
                        className="p-2 bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl transition-all disabled:opacity-50 disabled:scale-100 active:scale-95 shadow-lg shadow-indigo-600/30"
                    >
                        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </form>
    );
}
