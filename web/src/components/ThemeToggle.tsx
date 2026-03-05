"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const options = [
        { value: "light" as const, icon: Sun, label: "Claro" },
        { value: "dark" as const, icon: Moon, label: "Oscuro" },
        { value: "system" as const, icon: Monitor, label: "Auto" },
    ];

    return (
        <div className="flex bg-white/[0.04] p-1 rounded-xl gap-0.5 border border-white/[0.06]">
            {options.map(({ value, icon: Icon, label }) => {
                const isActive = theme === value;
                return (
                    <button
                        key={value}
                        onClick={() => setTheme(value)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${isActive
                            ? "bg-[#6366f1]/15 text-[#818cf8] shadow-sm"
                            : "text-white/30 hover:text-white/60"
                            }`}
                        title={label}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">{label}</span>
                    </button>
                );
            })}
        </div>
    );
}
