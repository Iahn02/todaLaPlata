"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/trpc/client";
import { X, ArrowDownCircle, ArrowUpCircle, CheckCircle2, Loader2, ArrowRightLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Category, Account } from "@prisma/client";

const transactionSchema = z.object({
    amount: z.number().min(1, "El monto debe ser mayor a 0"),
    type: z.enum(["expense", "income", "transfer"]),
    description: z.string().min(1, "La descripción es requerida"),
    accountId: z.string().min(1, "Selecciona una cuenta"),
    categoryId: z.string().optional(),
    toAccountId: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.type !== "transfer" && (!data.categoryId || data.categoryId === "")) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Selecciona una categoría", path: ["categoryId"] });
    }
    if (data.type === "transfer" && (!data.toAccountId || data.toAccountId === "")) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Selecciona cuenta destino", path: ["toAccountId"] });
    }
    if (data.type === "transfer" && data.accountId === data.toAccountId) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Las cuentas no pueden ser iguales", path: ["toAccountId"] });
    }
});

type TransactionForm = z.infer<typeof transactionSchema>;

// Formatea número a formato CLP con puntos: 1000000 -> "1.000.000"
function formatClpInput(value: string): string {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    return Number(digits).toLocaleString("es-CL");
}

// Parsea string formateado a número: "1.000.000" -> 1000000
function parseClpInput(formatted: string): number {
    const digits = formatted.replace(/\D/g, "");
    return Number(digits) || 0;
}

export function AddTransactionButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [displayAmount, setDisplayAmount] = useState("");
    const utils = trpc.useUtils();

    const { data: lookups } = trpc.lookups.getEssentialData.useQuery(undefined, {
        // Refetch when modal opens so new accounts/categories always appear
        refetchOnWindowFocus: true,
    });

    const createMutation = trpc.transactions.create.useMutation({
        onSuccess: () => {
            utils.transactions.getAll.invalidate();
            utils.accounts.getAll.invalidate();
            setIsOpen(false);
            setDisplayAmount("");
            reset();
        },
    });

    const transferMutation = trpc.transactions.transfer.useMutation({
        onSuccess: () => {
            utils.transactions.getAll.invalidate();
            utils.accounts.getAll.invalidate();
            setIsOpen(false);
            setDisplayAmount("");
            reset();
        },
    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<TransactionForm>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            type: "expense",
            amount: undefined,
            description: "",
            accountId: "",
            categoryId: "",
            toAccountId: "",
        },
    });

    const txType = watch("type");

    const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const formatted = formatClpInput(raw);
        setDisplayAmount(formatted);
        setValue("amount", parseClpInput(raw), { shouldValidate: true });
    }, [setValue]);

    const handleOpen = () => {
        // Refetch lookups when opening to get latest accounts/categories
        utils.lookups.getEssentialData.invalidate();
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setDisplayAmount("");
        reset();
    };

    const onSubmit = (data: TransactionForm) => {
        if (data.type === "transfer") {
            transferMutation.mutate({
                amount: data.amount,
                description: data.description,
                fromAccountId: data.accountId,
                toAccountId: data.toAccountId!,
            });
        } else {
            createMutation.mutate({
                amount: data.amount,
                description: data.description,
                type: data.type,
                accountId: data.accountId,
                categoryId: data.categoryId,
            });
        }
    };

    const availableCategories = lookups?.categories.filter((c: Category) => c.type === txType) ?? [];

    return (
        <>
            <button
                onClick={handleOpen}
                className="fixed bottom-24 md:bottom-12 right-6 md:right-12 z-40 bg-[#f3701e] hover:bg-[#d55f15] text-white rounded-full p-4 shadow-xl shadow-[#f3701e]/30 hover:shadow-[#f3701e]/50 hover:scale-105 transition-all duration-300"
            >
                <span className="sr-only">Añadir Transacción</span>
                <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ y: "100%", opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: "100%", opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 bg-[var(--bg-card)] md:rounded-3xl rounded-t-3xl shadow-2xl md:w-full md:max-w-md overflow-hidden flex flex-col max-h-[90vh] transition-colors"
                        >
                            {/* Drag handle mobile */}
                            <div className="w-full flex justify-center pt-3 pb-2 md:hidden">
                                <div className="w-12 h-1.5 bg-[var(--brand-cream)] rounded-full" />
                            </div>

                            <div className="px-6 py-4 flex items-center justify-between border-b border-[var(--brand-cream)]/40 hidden md:flex">
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">Nueva Transacción</h3>
                                <button
                                    onClick={handleClose}
                                    className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-nested)] rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                {/* Type Toggle */}
                                <div className="flex bg-[var(--bg-nested)] p-1.5 rounded-2xl mb-6 transition-colors">
                                    <button
                                        type="button"
                                        onClick={() => { setValue("type", "expense"); setValue("categoryId", ""); setValue("toAccountId", ""); }}
                                        className={`flex-1 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${txType === "expense"
                                            ? "bg-[var(--bg-card)] text-[#c95d45] shadow-sm"
                                            : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                                            }`}
                                    >
                                        <ArrowDownCircle className="w-4 h-4 hidden sm:block" /> Gasto
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setValue("type", "income"); setValue("categoryId", ""); setValue("toAccountId", ""); }}
                                        className={`flex-1 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${txType === "income"
                                            ? "bg-[var(--bg-card)] text-[#4b607f] shadow-sm"
                                            : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                                            }`}
                                    >
                                        <ArrowUpCircle className="w-4 h-4 hidden sm:block" /> Ingreso
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setValue("type", "transfer"); setValue("categoryId", ""); }}
                                        className={`flex-1 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${txType === "transfer"
                                            ? "bg-[var(--bg-card)] text-[#f3701e] shadow-sm"
                                            : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                                            }`}
                                    >
                                        <ArrowRightLeft className="w-4 h-4 hidden sm:block" /> Transferencia
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    {/* Monto con formato CLP */}
                                    <div>
                                        <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                                            Monto
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-[var(--text-muted)] font-bold text-xl">$</span>
                                            </div>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                placeholder="0"
                                                value={displayAmount}
                                                onChange={handleAmountChange}
                                                className={`block w-full pl-10 pr-4 py-4 bg-[var(--bg-nested)] border border-[var(--brand-cream)]/40 rounded-2xl text-2xl font-bold tracking-tight text-[var(--text-primary)] focus:ring-4 focus:ring-[#f3701e]/10 focus:border-[#f3701e] transition-all outline-none ${errors.amount ? "border-[#c95d45] focus:ring-[#c95d45]/10" : ""
                                                    }`}
                                            />
                                        </div>
                                        {errors.amount && <p className="mt-1.5 text-sm text-[#c95d45] font-medium">{errors.amount.message}</p>}
                                    </div>

                                    {/* Descripción */}
                                    <div>
                                        <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                                            Descripción
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Ej: Súper mercado"
                                            {...register("description")}
                                            className={`block w-full px-4 py-3 bg-[var(--bg-nested)] border border-[var(--brand-cream)]/40 rounded-xl text-[var(--text-primary)] font-medium focus:ring-4 focus:ring-[#f3701e]/10 focus:border-[#f3701e] transition-all outline-none ${errors.description ? "border-[#c95d45] focus:ring-[#c95d45]/10" : ""
                                                }`}
                                        />
                                        {errors.description && <p className="mt-1.5 text-sm text-[#c95d45] font-medium">{errors.description.message}</p>}
                                    </div>

                                    {/* Cuenta y Categoría */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                                                {txType === "transfer" ? "Desde" : "Cuenta"}
                                            </label>
                                            <select
                                                {...register("accountId")}
                                                className="block w-full px-4 py-3 bg-[var(--bg-nested)] border border-[var(--brand-cream)]/40 rounded-xl text-[var(--text-primary)] font-medium appearance-none focus:ring-4 focus:ring-[#f3701e]/10 focus:border-[#f3701e] transition-all outline-none"
                                            >
                                                <option value="" disabled>Selecciona...</option>
                                                {lookups?.accounts.map((acc: Account) => (
                                                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                                                ))}
                                            </select>
                                            {errors.accountId && <p className="mt-1.5 text-sm text-[#c95d45] font-medium">{errors.accountId.message}</p>}
                                        </div>

                                        {txType !== "transfer" ? (
                                            <div>
                                                <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                                                    Categoría
                                                </label>
                                                <select
                                                    {...register("categoryId")}
                                                    className="block w-full px-4 py-3 bg-[var(--bg-nested)] border border-[var(--brand-cream)]/40 rounded-xl text-[var(--text-primary)] font-medium appearance-none focus:ring-4 focus:ring-[#f3701e]/10 focus:border-[#f3701e] transition-all outline-none"
                                                    disabled={!lookups}
                                                >
                                                    <option value="" disabled>Selecciona...</option>
                                                    {availableCategories.map((cat: Category) => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                                {errors.categoryId && <p className="mt-1.5 text-sm text-[#c95d45] font-medium">{errors.categoryId.message}</p>}
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                                                    Hacia
                                                </label>
                                                <select
                                                    {...register("toAccountId")}
                                                    className="block w-full px-4 py-3 bg-[var(--bg-nested)] border border-[var(--brand-cream)]/40 rounded-xl text-[var(--text-primary)] font-medium appearance-none focus:ring-4 focus:ring-[#f3701e]/10 focus:border-[#f3701e] transition-all outline-none"
                                                >
                                                    <option value="" disabled>Selecciona...</option>
                                                    {lookups?.accounts.map((acc: Account) => (
                                                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                                                    ))}
                                                </select>
                                                {errors.toAccountId && <p className="mt-1.5 text-sm text-[#c95d45] font-medium">{errors.toAccountId.message}</p>}
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={createMutation.isPending || transferMutation.isPending}
                                        className="w-full mt-4 flex items-center justify-center gap-2 py-4 bg-[var(--brand-primary)] hover:bg-[#f3701e] text-[var(--text-light)] rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-[#f3701e]/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
                                    >
                                        {createMutation.isPending || transferMutation.isPending ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="w-5 h-5" />
                                        )}
                                        {txType === "expense" ? "Registrar Gasto" : txType === "income" ? "Registrar Ingreso" : "Transferir"}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
