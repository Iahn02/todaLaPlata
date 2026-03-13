"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ArrowRightLeft, Tags, Wallet, RefreshCw, Activity } from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Análisis", href: "/dashboard/analytics", icon: Activity },
    { name: "Transacciones", href: "/dashboard/transactions", icon: ArrowRightLeft },
    { name: "Cuentas", href: "/dashboard/accounts", icon: Wallet },
    { name: "Categorías", href: "/dashboard/categories", icon: Tags },
    { name: "Recurrentes", href: "/dashboard/recurring", icon: RefreshCw },
];

export function DesktopNavigation() {
    const pathname = usePathname();

    return (
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
    );
}

export function MobileNavigation() {
    const pathname = usePathname();

    return (
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
            <div className="bg-[#18181B]/95 backdrop-blur-xl border border-[var(--glass-border)] max-w-md mx-auto shadow-2xl shadow-black/40 rounded-2xl flex items-center justify-between px-6 py-3">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center gap-1.5 group relative"
                        >
                            <div
                                className={`w-11 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive
                                    ? "bg-[#6366f1]/15 text-[#818cf8] shadow-inner shadow-[#6366f1]/10"
                                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-white/[0.02]"
                                    }`}
                            >
                                <Icon className={`w-[20px] h-[20px] transition-transform duration-300 ${isActive ? "scale-110" : "scale-100"}`} />
                            </div>
                            
                            {isActive && (
                                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#818cf8] rounded-full shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
