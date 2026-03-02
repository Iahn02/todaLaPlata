"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const options = [
        { value: "light" as const, icon: Sun, label: "Claro" },
        { value: "dark" as const, icon: Moon, label: "Oscuro" },
        { value: "system" as const, icon: Monitor, label: "Sistema" },
    ];

    return (
        <div className="flex bg-[var(--bg-nested)] dark:bg-white/5 p-1 rounded-xl gap-0.5">
            {options.map(({ value, icon: Icon, label }) => {
                const isActive = theme === value;
                return (
                    <button
                        key={value}
                        onClick={() => setTheme(value)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${isActive
                            ? "bg-white dark:bg-white/10 text-[#f3701e] shadow-sm"
                            : "text-[var(--text-muted)] hover:text-[var(--text-primary)] dark:hover:text-white"
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
