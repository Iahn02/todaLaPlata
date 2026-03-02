"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";
import { RefreshCw, Plus, Trash2, Pause, Play } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

const FREQUENCY_LABELS: Record<string, string> = {
    daily: "Diario",
    weekly: "Semanal",
    biweekly: "Quincenal",
    monthly: "Mensual",
    yearly: "Anual",
};

export default function RecurringPage() {
    const { data: recurrings, isLoading } = trpc.recurring.getAll.useQuery();
    const { data: lookups } = trpc.lookups.getEssentialData.useQuery();
    const utils = trpc.useUtils();

    const [showForm, setShowForm] = useState(false);
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<"expense" | "income">("expense");
    const [frequency, setFrequency] = useState<"daily" | "weekly" | "biweekly" | "monthly" | "yearly">("monthly");
    const [accountId, setAccountId] = useState("");
    const [categoryId, setCategoryId] = useState("");

    const createMutation = trpc.recurring.create.useMutation({
        onSuccess: () => {
            utils.recurring.getAll.invalidate();
            setShowForm(false);
            setAmount("");
            setDescription("");
        },
    });

    const toggleMutation = trpc.recurring.toggle.useMutation({
        onSuccess: () => utils.recurring.getAll.invalidate(),
    });

    const deleteMutation = trpc.recurring.delete.useMutation({
        onSuccess: () => utils.recurring.getAll.invalidate(),
    });

    const processMutation = trpc.recurring.processDue.useMutation({
        onSuccess: (data) => {
            utils.recurring.getAll.invalidate();
            utils.transactions.getAll.invalidate();
            alert(`✅ Se procesaron ${data.processed} transacciones recurrentes.`);
        },
    });

    const accounts = lookups?.accounts ?? [];
    const categories = lookups?.categories ?? [];

    const formatCurrency = (n: number) =>
        new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(n);

    const handleCreate = () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) return;
        if (!accountId && accounts.length > 0) setAccountId(accounts[0].id);

        createMutation.mutate({
            amount: numAmount,
            type,
            description: description.trim() || undefined,
            frequency,
            accountId: accountId || accounts[0]?.id,
            categoryId: categoryId || undefined,
        });
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto space-y-6">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                        Transacciones Recurrentes
                    </h1>
                    <p className="text-[var(--text-tertiary)] mt-1">
                        Automatiza sueldo, arriendo, Netflix y más.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => processMutation.mutate()}
                        disabled={processMutation.isPending}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm bg-[var(--bg-nested)] text-[var(--text-tertiary)] hover:bg-[#4b607f]/10 hover:text-[#4b607f] transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${processMutation.isPending ? "animate-spin" : ""}`} />
                        Procesar
                    </button>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm bg-[#f3701e] text-white hover:bg-[#d55f15] transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva
                    </button>
                </div>
            </header>

            {/* Formulario de creación */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-[var(--bg-card)] p-6 rounded-3xl shadow-sm border border-[var(--brand-cream)]/60 space-y-4 transition-colors">
                            <h3 className="font-semibold text-[var(--text-primary)]">Nueva recurrente</h3>

                            {/* Type toggle */}
                            <div className="flex bg-[var(--bg-nested)] p-1.5 rounded-2xl">
                                {(["expense", "income"] as const).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setType(t)}
                                        className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${type === t
                                            ? t === "expense"
                                                ? "bg-white dark:bg-white/10 text-[#c95d45] shadow-sm"
                                                : "bg-white dark:bg-white/10 text-[#4b607f] shadow-sm"
                                            : "text-[var(--text-muted)]"
                                            }`}
                                    >
                                        {t === "expense" ? "Gasto" : "Ingreso"}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Monto"
                                    className="bg-[var(--bg-nested)] border-none rounded-2xl py-3 px-4 text-[var(--text-primary)] font-medium placeholder:text-[var(--text-muted)] outline-none focus:ring-2 focus:ring-[#f3701e]/20"
                                />
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Descripción (ej: Netflix, Arriendo)"
                                    className="bg-[var(--bg-nested)] border-none rounded-2xl py-3 px-4 text-[var(--text-primary)] font-medium placeholder:text-[var(--text-muted)] outline-none focus:ring-2 focus:ring-[#f3701e]/20"
                                />
                            </div>

                            {/* Frequency */}
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(FREQUENCY_LABELS).map(([val, label]) => (
                                    <button
                                        key={val}
                                        onClick={() => setFrequency(val as typeof frequency)}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${frequency === val
                                            ? "bg-[#f3701e] text-white"
                                            : "bg-[var(--bg-nested)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* Account & Category */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <select
                                    value={accountId}
                                    onChange={(e) => setAccountId(e.target.value)}
                                    className="bg-[var(--bg-nested)] border-none rounded-2xl py-3 px-4 text-[var(--text-primary)] font-medium outline-none"
                                >
                                    <option value="">Cuenta</option>
                                    {accounts.map((a) => (
                                        <option key={a.id} value={a.id}>{a.name}</option>
                                    ))}
                                </select>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="bg-[var(--bg-nested)] border-none rounded-2xl py-3 px-4 text-[var(--text-primary)] font-medium outline-none"
                                >
                                    <option value="">Categoría (opcional)</option>
                                    {categories.filter((c) => c.type === type).map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleCreate}
                                    disabled={createMutation.isPending || !amount}
                                    className="px-5 py-2.5 rounded-2xl text-sm font-semibold bg-[#f3701e] text-white hover:bg-[#d55f15] transition-all disabled:opacity-50"
                                >
                                    {createMutation.isPending ? "Creando..." : "Crear recurrente"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lista de recurrentes */}
            <div className="bg-[var(--bg-card)] rounded-3xl shadow-sm border border-[var(--brand-cream)]/60 overflow-hidden transition-colors">
                <div className="p-5 border-b border-[var(--brand-cream)]/40">
                    <h2 className="font-semibold text-[var(--text-primary)]">
                        Tus recurrentes ({recurrings?.length ?? 0})
                    </h2>
                </div>

                {isLoading ? (
                    <div className="p-8 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-[var(--bg-nested)] rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : recurrings?.length === 0 ? (
                    <div className="p-12 text-center">
                        <RefreshCw className="w-12 h-12 mx-auto text-[var(--brand-cream)] mb-4" />
                        <p className="text-[var(--text-primary)] font-medium">Sin recurrentes</p>
                        <p className="text-[var(--text-muted)] text-sm mt-1">Crea una para automatizar tus gastos fijos.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-[var(--brand-cream)]/40">
                        <AnimatePresence>
                            {recurrings?.map((rec: any) => (
                                <motion.div
                                    key={rec.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className={`flex items-center justify-between p-4 md:p-5 gap-4 transition-colors ${!rec.isActive ? "opacity-50" : ""
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white ${rec.type === "income" ? "bg-[#4b607f]" : "bg-[#c95d45]"
                                                }`}
                                        >
                                            <RefreshCw className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[var(--text-primary)] text-sm">
                                                {rec.description || "Recurrente"}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mt-0.5">
                                                <span className="bg-[var(--bg-nested)] px-2 py-0.5 rounded-lg font-medium">
                                                    {FREQUENCY_LABELS[rec.frequency] || rec.frequency}
                                                </span>
                                                <span>
                                                    Próximo: {format(new Date(rec.nextDueDate), "dd MMM", { locale: es })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`font-bold text-sm ${rec.type === "income" ? "text-[#4b607f]" : "text-[#c95d45]"
                                                }`}
                                        >
                                            {rec.type === "income" ? "+" : "-"}
                                            {formatCurrency(rec.amount)}
                                        </span>

                                        <button
                                            onClick={() => toggleMutation.mutate({ id: rec.id })}
                                            className="p-2 rounded-xl hover:bg-[var(--bg-nested)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
                                            title={rec.isActive ? "Pausar" : "Activar"}
                                        >
                                            {rec.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                        </button>

                                        <button
                                            onClick={() => {
                                                if (confirm("¿Eliminar esta recurrente?"))
                                                    deleteMutation.mutate({ id: rec.id });
                                            }}
                                            className="p-2 rounded-xl hover:bg-[#c95d45]/10 text-[var(--text-muted)] hover:text-[#c95d45] transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
