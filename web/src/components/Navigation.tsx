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
            <nav className="hidden md:flex flex-col gap-2 mt-8">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                    ? "bg-indigo-50 text-indigo-600 font-semibold shadow-sm shadow-indigo-100/50"
                                    : "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50"
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Mobile Bottom Navigation Glassmorphism */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2">
                <div className="bg-white/80 backdrop-blur-xl border border-white max-w-sm mx-auto shadow-2xl shadow-indigo-500/10 rounded-2xl flex items-center justify-between px-6 py-3">
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
                                            ? "bg-indigo-50 text-indigo-600"
                                            : "text-gray-400 group-hover:text-indigo-500"
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} />
                                </div>
                                <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-indigo-600" : "text-transparent"}`}>
                                    {item.name}
                                </span>

                                {isActive && (
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
