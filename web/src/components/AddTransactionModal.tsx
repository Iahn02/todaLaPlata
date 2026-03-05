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

function formatClpInput(value: string): string {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    return Number(digits).toLocaleString("es-CL");
}

function parseClpInput(formatted: string): number {
    const digits = formatted.replace(/\D/g, "");
    return Number(digits) || 0;
}

export function AddTransactionButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [displayAmount, setDisplayAmount] = useState("");
    const utils = trpc.useUtils();

    const { data: lookups } = trpc.lookups.getEssentialData.useQuery(undefined, {
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
                className="fixed bottom-24 md:bottom-10 right-6 md:right-10 z-40 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:shadow-xl hover:shadow-[#6366f1]/30 text-white rounded-full p-4 shadow-lg shadow-[#6366f1]/20 hover:scale-105 transition-all duration-300"
            >
                <span className="sr-only">Añadir Transacción</span>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ y: "100%", opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: "100%", opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 bg-[var(--bg-card)] md:rounded-2xl rounded-t-2xl shadow-2xl md:w-full md:max-w-md overflow-hidden flex flex-col max-h-[90vh] transition-colors border border-[var(--glass-border)]"
                        >
                            {/* Drag handle mobile */}
                            <div className="w-full flex justify-center pt-3 pb-2 md:hidden">
                                <div className="w-10 h-1 bg-[var(--text-muted)]/30 rounded-full" />
                            </div>

                            <div className="px-6 py-4 items-center justify-between border-b border-[var(--glass-border)] hidden md:flex">
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">Nueva Transacción</h3>
                                <button
                                    onClick={handleClose}
                                    className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-nested)] rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                {/* Type Toggle */}
                                <div className="flex bg-[var(--bg-nested)] p-1 rounded-xl mb-6 transition-colors border border-[var(--glass-border)]">
                                    <button
                                        type="button"
                                        onClick={() => { setValue("type", "expense"); setValue("categoryId", ""); setValue("toAccountId", ""); }}
                                        className={`flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${txType === "expense"
                                            ? "bg-[var(--bg-card)] text-[#ef4444] shadow-sm"
                                            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                            }`}
                                    >
                                        <ArrowDownCircle className="w-4 h-4 hidden sm:block" /> Gasto
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setValue("type", "income"); setValue("categoryId", ""); setValue("toAccountId", ""); }}
                                        className={`flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${txType === "income"
                                            ? "bg-[var(--bg-card)] text-[#10b981] shadow-sm"
                                            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                            }`}
                                    >
                                        <ArrowUpCircle className="w-4 h-4 hidden sm:block" /> Ingreso
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setValue("type", "transfer"); setValue("categoryId", ""); }}
                                        className={`flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${txType === "transfer"
                                            ? "bg-[var(--bg-card)] text-[#6366f1] dark:text-[#818cf8] shadow-sm"
                                            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                            }`}
                                    >
                                        <ArrowRightLeft className="w-4 h-4 hidden sm:block" /> Transfer
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    {/* Amount */}
                                    <div>
                                        <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Monto</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-[var(--text-muted)] font-bold text-lg">$</span>
                                            </div>
                                            <input
                                                type="text" inputMode="numeric" placeholder="0"
                                                value={displayAmount} onChange={handleAmountChange}
                                                className={`block w-full pl-9 pr-4 py-3.5 bg-[var(--bg-nested)] border border-[var(--glass-border)] rounded-xl text-2xl font-bold tracking-tight text-[var(--text-primary)] focus:ring-2 focus:ring-[#6366f1]/15 focus:border-[#6366f1]/30 transition-all outline-none ${errors.amount ? "border-[#ef4444] focus:ring-[#ef4444]/10" : ""}`}
                                            />
                                        </div>
                                        {errors.amount && <p className="mt-1.5 text-xs text-[#ef4444] font-medium">{errors.amount.message}</p>}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Descripción</label>
                                        <input
                                            type="text" placeholder="Ej: Súper mercado"
                                            {...register("description")}
                                            className={`block w-full px-4 py-3 bg-[var(--bg-nested)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] text-sm font-medium focus:ring-2 focus:ring-[#6366f1]/15 focus:border-[#6366f1]/30 transition-all outline-none ${errors.description ? "border-[#ef4444]" : ""}`}
                                        />
                                        {errors.description && <p className="mt-1.5 text-xs text-[#ef4444] font-medium">{errors.description.message}</p>}
                                    </div>

                                    {/* Account & Category */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                                                {txType === "transfer" ? "Desde" : "Cuenta"}
                                            </label>
                                            <select
                                                {...register("accountId")}
                                                className="block w-full px-4 py-3 bg-[var(--bg-nested)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] text-sm font-medium appearance-none focus:ring-2 focus:ring-[#6366f1]/15 outline-none"
                                            >
                                                <option value="" disabled>Selecciona...</option>
                                                {lookups?.accounts.map((acc: Account) => (
                                                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                                                ))}
                                            </select>
                                            {errors.accountId && <p className="mt-1.5 text-xs text-[#ef4444] font-medium">{errors.accountId.message}</p>}
                                        </div>

                                        {txType !== "transfer" ? (
                                            <div>
                                                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Categoría</label>
                                                <select
                                                    {...register("categoryId")}
                                                    className="block w-full px-4 py-3 bg-[var(--bg-nested)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] text-sm font-medium appearance-none focus:ring-2 focus:ring-[#6366f1]/15 outline-none"
                                                    disabled={!lookups}
                                                >
                                                    <option value="" disabled>Selecciona...</option>
                                                    {availableCategories.map((cat: Category) => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                                {errors.categoryId && <p className="mt-1.5 text-xs text-[#ef4444] font-medium">{errors.categoryId.message}</p>}
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Hacia</label>
                                                <select
                                                    {...register("toAccountId")}
                                                    className="block w-full px-4 py-3 bg-[var(--bg-nested)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] text-sm font-medium appearance-none focus:ring-2 focus:ring-[#6366f1]/15 outline-none"
                                                >
                                                    <option value="" disabled>Selecciona...</option>
                                                    {lookups?.accounts.map((acc: Account) => (
                                                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                                                    ))}
                                                </select>
                                                {errors.toAccountId && <p className="mt-1.5 text-xs text-[#ef4444] font-medium">{errors.toAccountId.message}</p>}
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={createMutation.isPending || transferMutation.isPending}
                                        className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-xl font-semibold text-base hover:shadow-xl hover:shadow-[#6366f1]/25 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
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
