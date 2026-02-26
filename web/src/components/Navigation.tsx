"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ArrowRightLeft, Tags, Wallet } from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transacciones", href: "/dashboard/transactions", icon: ArrowRightLeft },
    { name: "Cuentas", href: "/dashboard/accounts", icon: Wallet },
    { name: "Categorías", href: "/dashboard/categories", icon: Tags },
];

export function Navigation() {
    const pathname = usePathname();

    return (
        <>
            {/* Desktop Sidebar Navigation */}
            <nav className="hidden md:flex flex-col gap-1.5 mt-8">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                ? "bg-[#f3701e]/15 text-[#f3701e] font-semibold"
                                : "text-[#f5f0eb]/50 hover:text-[#f3701e] hover:bg-white/5"
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? "text-[#f3701e]" : "text-[#f5f0eb]/40"}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Mobile Bottom Navigation Glassmorphism */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2">
                <div className="bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 max-w-sm mx-auto shadow-2xl shadow-black/20 rounded-2xl flex items-center justify-between px-6 py-3">
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
                                    className={`w-12 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive
                                        ? "bg-[#f3701e]/15 text-[#f3701e]"
                                        : "text-[#f5f0eb]/40 group-hover:text-[#f3701e]"
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} />
                                </div>
                                <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-[#f3701e]" : "text-transparent"}`}>
                                    {item.name}
                                </span>

                                {isActive && (
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#f3701e] rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
