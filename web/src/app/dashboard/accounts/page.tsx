"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";
import {
    Plus, Wallet, Landmark, CreditCard, Banknote, LineChart,
    Settings2, Edit2, Trash2, Save, X, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Account } from "@prisma/client";

type AccountType = "bank" | "cash" | "credit_card" | "savings" | "investment";

const resolveTypeIcon = (type: string) => {
    switch (type) {
        case "bank": return Landmark;
        case "credit_card": return CreditCard;
        case "savings": return Wallet;
        case "investment": return LineChart;
        case "cash": default: return Banknote;
    }
};

const resolveDictType = (type: string) => {
    switch (type) {
        case "bank": return "Cuenta Bancaria";
        case "credit_card": return "Tarjeta de Crédito";
        case "savings": return "Cuenta de Ahorros";
        case "investment": return "Inversiones";
        case "cash": default: return "Efectivo";
    }
}

const ACC_COLORS = [
    "#1a1a1a", "#4b607f", "#f3701e", "#c95d45",
    "#e2ba65", "#5a8a6a", "#8b5cf6", "#3b82f6",
    "#14b8a6", "#64748b", "#0f172a"
];

export default function AccountsPage() {
    const { data: accountsRaw, isLoading } = trpc.accounts.getAll.useQuery();
    const utils = trpc.useUtils();

    type ExtendedAccount = Account & { realBalance: number };
    const accounts = accountsRaw as unknown as ExtendedAccount[];

    const [editingAccId, setEditingAccId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const totalBalance = accounts?.reduce((acc, current) => current.includeInTotal ? acc + current.realBalance : acc, 0) || 0;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
            <header className="mb-8 hidden md:flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Billeteras & Cuentas</h1>
                    <p className="text-[var(--text-tertiary)] mt-1">Administra tus métodos de pago y cuentas bancarias.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[var(--brand-primary)] text-[var(--text-light)] font-medium rounded-xl hover:bg-[#f3701e] hover:shadow-lg hover:shadow-[#f3701e]/20 active:scale-95 transition-all"
                >
                    <Plus className="w-5 h-5" /> Añadir Cuenta
                </button>
            </header>

            <button
                onClick={() => setIsCreating(true)}
                className="md:hidden fixed bottom-24 left-6 z-40 w-14 h-14 bg-[var(--brand-primary)] text-[var(--text-light)] rounded-full shadow-xl flex items-center justify-center transition-all active:scale-90"
            >
                <Plus className="w-6 h-6" />
            </button>

            {/* Resumen Total */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-3xl p-6 md:p-8 mb-8 text-white relative overflow-hidden shadow-xl shadow-black/10">
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#f3701e]/10 rounded-tl-full pointer-events-none" />
                <div className="absolute left-10 -top-10 w-32 h-32 bg-[#4b607f]/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute right-20 top-5 w-20 h-20 bg-[#e2ba65]/10 rounded-full blur-xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <p className="font-medium text-white/60 flex items-center gap-2 mb-2 text-sm">
                            <Wallet className="w-4 h-4 opacity-80" /> Patrimonio Total
                        </p>
                        {isLoading ? (
                            <div className="w-48 h-10 bg-white/20 animate-pulse rounded-xl" />
                        ) : (
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                {formatCurrency(totalBalance)}
                            </h2>
                        )}
                        <p className="text-white/40 text-xs mt-2">{accounts?.filter(a => a.includeInTotal).length || 0} cuentas activas</p>
                    </div>
                </div>
            </div>

            {/* Grid de Cuentas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {isCreating && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="col-span-1 md:col-span-2 lg:col-span-3 mb-4"
                        >
                            <AccountEditorForm
                                onCancel={() => setIsCreating(false)}
                                onSuccess={() => { setIsCreating(false); utils.accounts.getAll.invalidate(); utils.lookups.getEssentialData.invalidate(); }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {isLoading && !accounts ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-[var(--bg-nested)] h-48 rounded-3xl animate-pulse" />
                )) : (
                    accounts?.map((acc) => (
                        <motion.div
                            layout
                            key={acc.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={editingAccId === acc.id ? "col-span-1 md:col-span-2 lg:col-span-3" : "col-span-1"}
                        >
                            {editingAccId === acc.id ? (
                                <AccountEditorForm
                                    account={acc}
                                    onCancel={() => setEditingAccId(null)}
                                    onSuccess={() => { setEditingAccId(null); utils.accounts.getAll.invalidate(); utils.lookups.getEssentialData.invalidate(); }}
                                />
                            ) : (
                                <AccountCard account={acc} onEdit={() => setEditingAccId(acc.id)} formatCurrency={formatCurrency} />
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}

function AccountCard({
    account,
    onEdit,
    formatCurrency
}: {
    account: Account & { realBalance: number },
    onEdit: () => void,
    formatCurrency: (amount: number) => string
}) {
    const TypeIcon = resolveTypeIcon(account.type);
    const deleteMut = trpc.accounts.delete.useMutation({
        onSuccess: () => {
            const utils = trpc.useUtils();
            utils.accounts.getAll.invalidate();
        }
    });

    return (
        <div
            className="group relative h-48 rounded-3xl p-6 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
            style={{
                backgroundColor: account.color,
                boxShadow: `0 10px 30px -10px ${account.color}70`,
                opacity: account.includeInTotal ? 1 : 0.85
            }}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-125 duration-700" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/5 rounded-tl-full pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between text-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <TypeIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg md:text-xl leading-tight truncate max-w-[130px]" title={account.name}>{account.name}</h3>
                        <p className="text-white/60 text-xs font-medium">{resolveDictType(account.type)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 backdrop-blur-md rounded-lg p-1">
                    <button
                        onClick={onEdit}
                        className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-md transition-colors"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => { if (confirm(`¿ELIMINAR ${account.name}?\n⚠️ ESTO BORRARÁ TODAS TUS TRANSACCIONES ASOCIADAS.`)) deleteMut.mutate({ id: account.id }) }}
                        disabled={deleteMut.isPending}
                        className="p-1.5 text-white/80 hover:text-rose-300 hover:bg-rose-500/20 rounded-md transition-colors"
                    >
                        {deleteMut.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>

            <div className="relative z-10 mt-auto">
                {!account.includeInTotal && (
                    <span className="inline-block px-2 py-1 bg-black/20 backdrop-blur-md text-white/90 text-[10px] uppercase font-bold tracking-wider rounded-md mb-2">
                        No suma al total
                    </span>
                )}
                <p className="text-white/50 text-xs font-medium mb-0.5">Saldo Real</p>
                <h4 className="text-3xl font-bold tracking-tight text-white line-clamp-1">
                    {formatCurrency(account.realBalance)}
                </h4>
            </div>
        </div>
    );
}

function AccountEditorForm({
    account,
    onCancel,
    onSuccess
}: {
    account?: Account,
    onCancel: () => void,
    onSuccess: () => void
}) {
    const [name, setName] = useState(account?.name || "");
    const [type, setType] = useState<AccountType>((account?.type as AccountType) || "bank");
    const [color, setColor] = useState(account?.color || ACC_COLORS[0]);
    const [balance, setBalance] = useState(account?.balance || 0);
    const [includeInTotal, setIncludeInTotal] = useState(account?.includeInTotal ?? true);

    const createMut = trpc.accounts.create.useMutation({ onSuccess });
    const updateMut = trpc.accounts.update.useMutation({ onSuccess });

    const isPending = createMut.isPending || updateMut.isPending;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        if (account) {
            updateMut.mutate({ id: account.id, name, type, color, balance, includeInTotal });
        } else {
            createMut.mutate({ name, type, color, balance, includeInTotal });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-[var(--bg-card)] p-6 rounded-3xl shadow-xl border border-[var(--brand-cream)]/60 flex flex-col gap-6 relative z-20 transition-colors">
            <div className="flex items-center justify-between border-b border-[var(--brand-cream)]/40 pb-4">
                <div>
                    <h3 className="font-bold text-xl text-[var(--text-primary)]">{account ? "Editar Cuenta" : "Nueva Cuenta"}</h3>
                    <p className="text-sm text-[var(--text-tertiary)] font-medium mt-0.5">Configura tu billetera para transacciones.</p>
                </div>
                <button type="button" onClick={onCancel} className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-nested)] rounded-full transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2">
                    <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Nombre de la cuenta</label>
                    <input
                        type="text"
                        required
                        placeholder="Ej: Banco Estado, Billetera Física..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full px-4 py-3.5 bg-[var(--bg-nested)] border border-[var(--brand-cream)]/40 rounded-xl text-[var(--text-primary)] font-medium focus:ring-2 focus:ring-[#f3701e]/20 focus:border-[#f3701e] transition-all outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Tipo de Institución</label>
                    <div className="relative">
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as AccountType)}
                            className="block w-full px-4 py-3.5 bg-[var(--bg-nested)] border border-[var(--brand-cream)]/40 rounded-xl text-[var(--text-primary)] font-medium appearance-none focus:ring-2 focus:ring-[#f3701e]/20 focus:border-[#f3701e] transition-all outline-none"
                        >
                            <option value="bank">Banco Local / Internacional</option>
                            <option value="credit_card">Tarjeta de Crédito</option>
                            <option value="savings">Cuenta de Ahorros</option>
                            <option value="investment">Inversiones (Stocks/Crypto)</option>
                            <option value="cash">Efectivo Físico</option>
                        </select>
                        <Settings2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Saldo Inicial (Base)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[var(--text-muted)]">$</span>
                        <input
                            type="number"
                            required
                            value={balance}
                            onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
                            className="block w-full pl-9 pr-4 py-3.5 bg-[var(--bg-nested)] border border-[var(--brand-cream)]/40 rounded-xl text-[var(--text-primary)] font-bold focus:ring-2 focus:ring-[#f3701e]/20 focus:border-[#f3701e] transition-all outline-none"
                        />
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1.5 font-medium leading-tight">Monto antes de las transacciones.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2 border-t border-[var(--brand-cream)]/40 mt-2">
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2">
                        {ACC_COLORS.map(c => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setColor(c)}
                                className={`w-7 h-7 rounded-full flex-shrink-0 transition-transform shadow-sm ${color === c ? 'scale-125 ring-2 ring-offset-2 ring-[#f3701e]' : 'hover:scale-110'}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={includeInTotal}
                                onChange={(e) => setIncludeInTotal(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-[var(--brand-cream)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--brand-cream)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f3701e]"></div>
                        </div>
                        <span className="text-sm font-semibold text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors">Sumar al Patrimonio Total</span>
                    </label>
                </div>

                <div className="flex gap-3 mt-4 md:mt-0">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 font-semibold text-[var(--text-tertiary)] hover:bg-[var(--bg-nested)] rounded-xl transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isPending || !name.trim()}
                        className="flex items-center gap-2 px-8 py-3 bg-[#f3701e] text-white font-semibold rounded-xl hover:bg-[#d55f15] transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-[#f3701e]/30"
                    >
                        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {account ? "Guardar" : "Crear"}
                    </button>
                </div>
            </div>
        </form>
    );
}
