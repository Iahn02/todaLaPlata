"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ArrowRightLeft, Tags, Wallet, RefreshCw } from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transacciones", href: "/dashboard/transactions", icon: ArrowRightLeft },
    { name: "Cuentas", href: "/dashboard/accounts", icon: Wallet },
    { name: "Categorías", href: "/dashboard/categories", icon: Tags },
    { name: "Recurrentes", href: "/dashboard/recurring", icon: RefreshCw },
];

export function Navigation() {
    const pathname = usePathname();

    return (
        <>
            {/* Desktop Sidebar Navigation */}
            <nav className="hidden md:flex flex-col gap-1 mt-6">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/25 px-3 mb-2">Menú</span>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${isActive
                                ? "bg-[#6366f1]/10 text-[#818cf8] font-semibold"
                                : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]"
                                }`}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-[#6366f1] to-[#8b5cf6] rounded-full" />
                            )}
                            <Icon className={`w-[18px] h-[18px] ${isActive ? "text-[#818cf8]" : "text-white/30 group-hover:text-white/60"}`} />
                            <span className="text-[13px]">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 pt-2">
                <div className="bg-[var(--bg-sidebar)]/90 backdrop-blur-xl border border-white/[0.08] max-w-sm mx-auto shadow-2xl shadow-black/30 rounded-2xl flex items-center justify-between px-5 py-2.5">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex flex-col items-center gap-1 group relative pb-1"
                            >
                                <div
                                    className={`w-10 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${isActive
                                        ? "bg-[#6366f1]/15 text-[#818cf8]"
                                        : "text-white/30 group-hover:text-[#818cf8]"
                                        }`}
                                >
                                    <Icon className={`w-[18px] h-[18px] ${isActive ? "scale-110" : ""}`} />
                                </div>
                                <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-[#818cf8]" : "text-transparent"}`}>
                                    {item.name}
                                </span>

                                {isActive && (
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#818cf8] rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
