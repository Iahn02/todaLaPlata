"use client";

import { useState } from "react";
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

export function AddTransactionButton() {
    const [isOpen, setIsOpen] = useState(false);
    const utils = trpc.useUtils();

    const { data: lookups } = trpc.lookups.getEssentialData.useQuery(undefined, {
        enabled: isOpen, // Only fetch when modal opens
    });

    const createMutation = trpc.transactions.create.useMutation({
        onSuccess: () => {
            utils.transactions.getAll.invalidate();
            utils.accounts.getAll.invalidate();
            setIsOpen(false);
            reset();
        },
    });

    const transferMutation = trpc.transactions.transfer.useMutation({
        onSuccess: () => {
            utils.transactions.getAll.invalidate();
            utils.accounts.getAll.invalidate();
            setIsOpen(false);
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

    // Filtrar categorías según el tipo seleccionado (ingreso vs gasto)
    const availableCategories = lookups?.categories.filter((c: Category) => c.type === txType) ?? [];

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 md:bottom-12 right-6 md:right-12 z-40 bg-[#f3701e] hover:bg-[#d55f15] text-white rounded-full p-4 shadow-xl shadow-[#f3701e]/30 hover:shadow-[#f3701e]/50 hover:scale-105 transition-all duration-300"
            >
                <span className="sr-only">Añadir Gasto</span>
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
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-[#1a1a1a]/40 backdrop-blur-sm z-50 transition-opacity"
                        />

                        {/* Modal / Drawer */}
                        <motion.div
                            initial={{ y: "100%", opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: "100%", opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 bg-white md:rounded-3xl rounded-t-3xl shadow-2xl md:w-full md:max-w-md overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Drag handle visible only on mobile */}
                            <div className="w-full flex justify-center pt-3 pb-2 md:hidden">
                                <div className="w-12 h-1.5 bg-[#e8d8c9] rounded-full" />
                            </div>

                            <div className="px-6 py-4 flex items-center justify-between border-b border-[#e8d8c9]/60 hidden md:flex">
                                <h3 className="text-xl font-bold text-[#1a1a1a]">Nueva Transacción</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-[#9a9a9a] hover:text-[#1a1a1a] hover:bg-[#f5f0eb] rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                {/* Type Toggle */}
                                <div className="flex bg-[#f5f0eb] p-1.5 rounded-2xl mb-6">
                                    <button
                                        type="button"
                                        onClick={() => { setValue("type", "expense"); setValue("categoryId", ""); setValue("toAccountId", ""); }}
                                        className={`flex-1 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${txType === "expense"
                                            ? "bg-white text-[#c95d45] shadow-sm"
                                            : "text-[#6b6b6b] hover:text-[#1a1a1a]"
                                            }`}
                                    >
                                        <ArrowDownCircle className="w-4 h-4 hidden sm:block" /> Gasto
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setValue("type", "income"); setValue("categoryId", ""); setValue("toAccountId", ""); }}
                                        className={`flex-1 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${txType === "income"
                                            ? "bg-white text-[#4b607f] shadow-sm"
                                            : "text-[#6b6b6b] hover:text-[#1a1a1a]"
                                            }`}
                                    >
                                        <ArrowUpCircle className="w-4 h-4 hidden sm:block" /> Ingreso
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setValue("type", "transfer"); setValue("categoryId", ""); }}
                                        className={`flex-1 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${txType === "transfer"
                                            ? "bg-white text-[#f3701e] shadow-sm"
                                            : "text-[#6b6b6b] hover:text-[#1a1a1a]"
                                            }`}
                                    >
                                        <ArrowRightLeft className="w-4 h-4 hidden sm:block" /> Transferencia
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    {/* Monto */}
                                    <div>
                                        <label className="block text-xs font-semibold text-[#6b6b6b] uppercase tracking-wider mb-2">
                                            Monto
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-[#9a9a9a] font-medium text-lg">$</span>
                                            </div>
                                            <input
                                                type="number"
                                                placeholder="0"
                                                {...register("amount", { valueAsNumber: true })}
                                                className={`block w-full pl-10 pr-4 py-4 bg-[#f5f0eb] border border-[#e8d8c9] rounded-2xl text-2xl font-bold tracking-tight text-[#1a1a1a] focus:bg-white focus:ring-4 focus:ring-[#f3701e]/10 focus:border-[#f3701e] transition-all outline-none ${errors.amount ? "border-[#c95d45] focus:ring-[#c95d45]/10" : ""
                                                    }`}
                                            />
                                        </div>
                                        {errors.amount && <p className="mt-1.5 text-sm text-[#c95d45] font-medium">{errors.amount.message}</p>}
                                    </div>

                                    {/* Descripción */}
                                    <div>
                                        <label className="block text-xs font-semibold text-[#6b6b6b] uppercase tracking-wider mb-2">
                                            Descripción
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Ej: Súper mercado"
                                            {...register("description")}
                                            className={`block w-full px-4 py-3 bg-[#f5f0eb] border border-[#e8d8c9] rounded-xl text-[#1a1a1a] font-medium focus:bg-white focus:ring-4 focus:ring-[#f3701e]/10 focus:border-[#f3701e] transition-all outline-none ${errors.description ? "border-[#c95d45] focus:ring-[#c95d45]/10" : ""
                                                }`}
                                        />
                                        {errors.description && <p className="mt-1.5 text-sm text-[#c95d45] font-medium">{errors.description.message}</p>}
                                    </div>

                                    {/* Cuenta y Categoría */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Cuenta Origen */}
                                        <div>
                                            <label className="block text-xs font-semibold text-[#6b6b6b] uppercase tracking-wider mb-2">
                                                {txType === "transfer" ? "Desde" : "Cuenta"}
                                            </label>
                                            <select
                                                {...register("accountId")}
                                                className="block w-full px-4 py-3 bg-[#f5f0eb] border border-[#e8d8c9] rounded-xl text-[#1a1a1a] font-medium appearance-none focus:bg-white focus:ring-4 focus:ring-[#f3701e]/10 focus:border-[#f3701e] transition-all outline-none"
                                            >
                                                <option value="" disabled>Selecciona...</option>
                                                {lookups?.accounts.map((acc: Account) => (
                                                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                                                ))}
                                            </select>
                                            {errors.accountId && <p className="mt-1.5 text-sm text-[#c95d45] font-medium">{errors.accountId.message}</p>}
                                        </div>

                                        {/* Categoría o Cuenta Destino */}
                                        {txType !== "transfer" ? (
                                            <div>
                                                <label className="block text-xs font-semibold text-[#6b6b6b] uppercase tracking-wider mb-2">
                                                    Categoría
                                                </label>
                                                <select
                                                    {...register("categoryId")}
                                                    className="block w-full px-4 py-3 bg-[#f5f0eb] border border-[#e8d8c9] rounded-xl text-[#1a1a1a] font-medium appearance-none focus:bg-white focus:ring-4 focus:ring-[#f3701e]/10 focus:border-[#f3701e] transition-all outline-none"
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
                                                <label className="block text-xs font-semibold text-[#6b6b6b] uppercase tracking-wider mb-2">
                                                    Hacia
                                                </label>
                                                <select
                                                    {...register("toAccountId")}
                                                    className="block w-full px-4 py-3 bg-[#f5f0eb] border border-[#e8d8c9] rounded-xl text-[#1a1a1a] font-medium appearance-none focus:bg-white focus:ring-4 focus:ring-[#f3701e]/10 focus:border-[#f3701e] transition-all outline-none"
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

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={createMutation.isPending || transferMutation.isPending}
                                        className="w-full mt-4 flex items-center justify-center gap-2 py-4 bg-[#1a1a1a] hover:bg-[#f3701e] text-white rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-[#f3701e]/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
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
