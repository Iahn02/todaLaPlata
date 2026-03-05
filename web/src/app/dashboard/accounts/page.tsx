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
    "#6366f1", "#8b5cf6", "#06b6d4", "#10b981",
    "#f59e0b", "#ef4444", "#ec4899", "#3b82f6",
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
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Billeteras & Cuentas</h1>
                    <p className="text-[var(--text-tertiary)] text-sm mt-1">Administra tus métodos de pago y cuentas bancarias.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-medium text-sm rounded-xl hover:shadow-lg hover:shadow-[#6366f1]/25 active:scale-95 transition-all"
                >
                    <Plus className="w-4 h-4" /> Añadir Cuenta
                </button>
            </header>

            <button
                onClick={() => setIsCreating(true)}
                className="md:hidden fixed bottom-24 left-6 z-40 w-12 h-12 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-full shadow-xl shadow-[#6366f1]/25 flex items-center justify-center transition-all active:scale-90"
            >
                <Plus className="w-5 h-5" />
            </button>

            {/* Total Balance */}
            <div className="bg-gradient-to-br from-[#111827] to-[#1e293b] dark:from-[#0f172a] dark:to-[#1e293b] rounded-2xl p-6 md:p-8 mb-8 text-white relative overflow-hidden shadow-xl border border-white/[0.06]">
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#6366f1]/10 rounded-tl-full pointer-events-none" />
                <div className="absolute left-10 -top-10 w-32 h-32 bg-[#8b5cf6]/15 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute right-20 top-5 w-20 h-20 bg-[#06b6d4]/10 rounded-full blur-xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <p className="font-medium text-white/50 flex items-center gap-2 mb-2 text-sm">
                            <Wallet className="w-4 h-4 opacity-70" /> Patrimonio Total
                        </p>
                        {isLoading ? (
                            <div className="w-48 h-10 bg-white/10 animate-pulse rounded-xl" />
                        ) : (
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                {formatCurrency(totalBalance)}
                            </h2>
                        )}
                        <p className="text-white/30 text-xs mt-2">{accounts?.filter(a => a.includeInTotal).length || 0} cuentas activas</p>
                    </div>
                </div>
            </div>

            {/* Accounts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence>
                    {isCreating && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="col-span-1 md:col-span-2 lg:col-span-3 mb-2"
                        >
                            <AccountEditorForm
                                onCancel={() => setIsCreating(false)}
                                onSuccess={() => { setIsCreating(false); utils.accounts.getAll.invalidate(); utils.lookups.getEssentialData.invalidate(); }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {isLoading && !accounts ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-[var(--bg-nested)] h-48 rounded-2xl animate-pulse" />
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
            className="group relative h-48 rounded-2xl p-5 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
            style={{
                backgroundColor: account.color,
                boxShadow: `0 10px 30px -10px ${account.color}50`,
                opacity: account.includeInTotal ? 1 : 0.8
            }}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-125 duration-700" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between text-white">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <TypeIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-base leading-tight truncate max-w-[130px]" title={account.name}>{account.name}</h3>
                        <p className="text-white/50 text-[11px] font-medium">{resolveDictType(account.type)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-0.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 backdrop-blur-md rounded-lg p-0.5">
                    <button onClick={onEdit} className="p-1.5 text-white/70 hover:text-white hover:bg-white/15 rounded-md transition-colors">
                        <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => { if (confirm(`¿ELIMINAR ${account.name}?\n⚠️ ESTO BORRARÁ TODAS TUS TRANSACCIONES ASOCIADAS.`)) deleteMut.mutate({ id: account.id }) }}
                        disabled={deleteMut.isPending}
                        className="p-1.5 text-white/70 hover:text-rose-300 hover:bg-rose-500/20 rounded-md transition-colors"
                    >
                        {deleteMut.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                    </button>
                </div>
            </div>

            <div className="relative z-10 mt-auto">
                {!account.includeInTotal && (
                    <span className="inline-block px-2 py-0.5 bg-black/20 backdrop-blur-md text-white/80 text-[9px] uppercase font-bold tracking-wider rounded-md mb-2">
                        No suma al total
                    </span>
                )}
                <p className="text-white/40 text-[11px] font-medium mb-0.5">Saldo Real</p>
                <h4 className="text-2xl font-bold tracking-tight text-white line-clamp-1">
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
        <form onSubmit={handleSubmit} className="bg-[var(--bg-card)] p-6 rounded-2xl shadow-[var(--shadow-lg)] border border-[var(--glass-border)] flex flex-col gap-5 relative z-20 transition-colors">
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-4">
                <div>
                    <h3 className="font-bold text-lg text-[var(--text-primary)]">{account ? "Editar Cuenta" : "Nueva Cuenta"}</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-0.5">Configura tu billetera para transacciones.</p>
                </div>
                <button type="button" onClick={onCancel} className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-nested)] rounded-xl transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="lg:col-span-2">
                    <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Nombre</label>
                    <input
                        type="text" required placeholder="Ej: Banco Estado..."
                        value={name} onChange={(e) => setName(e.target.value)}
                        className="block w-full px-4 py-3 bg-[var(--bg-nested)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] text-sm font-medium focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]/30 transition-all outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Tipo</label>
                    <div className="relative">
                        <select
                            value={type} onChange={(e) => setType(e.target.value as AccountType)}
                            className="block w-full px-4 py-3 bg-[var(--bg-nested)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] text-sm font-medium appearance-none focus:ring-2 focus:ring-[#6366f1]/20 outline-none"
                        >
                            <option value="bank">Banco</option>
                            <option value="credit_card">Tarjeta de Crédito</option>
                            <option value="savings">Ahorros</option>
                            <option value="investment">Inversiones</option>
                            <option value="cash">Efectivo</option>
                        </select>
                        <Settings2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Saldo Inicial</label>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[var(--text-muted)] text-sm">$</span>
                        <input
                            type="number" required value={balance}
                            onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
                            className="block w-full pl-8 pr-4 py-3 bg-[var(--bg-nested)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] text-sm font-bold focus:ring-2 focus:ring-[#6366f1]/20 outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pt-2 border-t border-[var(--glass-border)]">
                <div className="flex flex-col md:flex-row md:items-center gap-5">
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                        {ACC_COLORS.map(c => (
                            <button
                                key={c} type="button" onClick={() => setColor(c)}
                                className={`w-6 h-6 rounded-full flex-shrink-0 transition-transform shadow-sm ${color === c ? 'scale-125 ring-2 ring-offset-2 ring-[#6366f1] ring-offset-[var(--bg-card)]' : 'hover:scale-110'}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                            <input type="checkbox" checked={includeInTotal} onChange={(e) => setIncludeInTotal(e.target.checked)} className="sr-only peer" />
                            <div className="w-10 h-5 bg-[var(--bg-nested)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6366f1]"></div>
                        </div>
                        <span className="text-sm font-medium text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">Sumar al Total</span>
                    </label>
                </div>

                <div className="flex gap-3">
                    <button type="button" onClick={onCancel} className="px-5 py-2.5 font-medium text-sm text-[var(--text-muted)] hover:bg-[var(--bg-nested)] rounded-xl transition-all">
                        Cancelar
                    </button>
                    <button
                        type="submit" disabled={isPending || !name.trim()}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-[#6366f1]/25 transition-all disabled:opacity-50 active:scale-95"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {account ? "Guardar" : "Crear"}
                    </button>
                </div>
            </div>
        </form>
    );
}
