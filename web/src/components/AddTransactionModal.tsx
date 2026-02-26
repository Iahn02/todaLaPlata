"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/trpc/client";
import { X, ArrowDownCircle, ArrowUpCircle, CheckCircle2, Loader2, MinusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Category, Account } from "@prisma/client";

const transactionSchema = z.object({
    amount: z.number().min(1, "El monto debe ser mayor a 0"),
    type: z.enum(["expense", "income"]),
    description: z.string().min(1, "La descripción es requerida"),
    accountId: z.string().min(1, "Selecciona una cuenta"),
    categoryId: z.string().min(1, "Selecciona una categoría"),
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
        },
    });

    const txType = watch("type");

    const onSubmit = (data: TransactionForm) => {
        createMutation.mutate(data);
    };

    // Filtrar categorías según el tipo seleccionado (ingreso vs gasto)
    const availableCategories = lookups?.categories.filter((c: Category) => c.type === txType) ?? [];

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 md:bottom-12 right-6 md:right-12 z-40 bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full p-4 shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300"
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
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
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
                                <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
                            </div>

                            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100/60 hidden md:flex">
                                <h3 className="text-xl font-bold text-slate-900">Nueva Transacción</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                {/* Type Toggle */}
                                <div className="flex bg-slate-100/80 p-1.5 rounded-2xl mb-6">
                                    <button
                                        onClick={() => { setValue("type", "expense"); setValue("categoryId", ""); }}
                                        className={`flex-1 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${txType === "expense"
                                            ? "bg-white text-rose-600 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                            }`}
                                    >
                                        <ArrowDownCircle className="w-4 h-4" /> Gasto
                                    </button>
                                    <button
                                        onClick={() => { setValue("type", "income"); setValue("categoryId", ""); }}
                                        className={`flex-1 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${txType === "income"
                                            ? "bg-white text-emerald-600 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                            }`}
                                    >
                                        <ArrowUpCircle className="w-4 h-4" /> Ingreso
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    {/* Monto */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                            Monto
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-slate-400 font-medium text-lg">$</span>
                                            </div>
                                            <input
                                                type="number"
                                                placeholder="0"
                                                {...register("amount", { valueAsNumber: true })}
                                                className={`block w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-2xl font-bold tracking-tight text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all ${errors.amount ? "border-rose-400 focus:ring-rose-500/10" : ""
                                                    }`}
                                            />
                                        </div>
                                        {errors.amount && <p className="mt-1.5 text-sm text-rose-500 font-medium">{errors.amount.message}</p>}
                                    </div>

                                    {/* Descripción */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                            Descripción
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Ej: Súper mercado"
                                            {...register("description")}
                                            className={`block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all ${errors.description ? "border-rose-400 focus:ring-rose-500/10" : ""
                                                }`}
                                        />
                                        {errors.description && <p className="mt-1.5 text-sm text-rose-500 font-medium">{errors.description.message}</p>}
                                    </div>

                                    {/* Cuenta y Categoría (2 col on modern layout) */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Cuenta */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                                Cuenta
                                            </label>
                                            <select
                                                {...register("accountId")}
                                                className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium appearance-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                            >
                                                <option value="" disabled>Selecciona...</option>
                                                {lookups?.accounts.map((acc: Account) => (
                                                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                                                ))}
                                            </select>
                                            {errors.accountId && <p className="mt-1.5 text-sm text-rose-500 font-medium">{errors.accountId.message}</p>}
                                        </div>

                                        {/* Categoría */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                                Categoría
                                            </label>
                                            <select
                                                {...register("categoryId")}
                                                className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium appearance-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                                disabled={!lookups}
                                            >
                                                <option value="" disabled>Selecciona...</option>
                                                {availableCategories.map((cat: Category) => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                            {errors.categoryId && <p className="mt-1.5 text-sm text-rose-500 font-medium">{errors.categoryId.message}</p>}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={createMutation.isPending}
                                        className="w-full mt-4 flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-slate-900/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
                                    >
                                        {createMutation.isPending ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="w-5 h-5" />
                                        )}
                                        {txType === "expense" ? "Registrar Gasto" : "Añadir Ingreso"}
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
