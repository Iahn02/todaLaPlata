"use client";

import { createContext, useContext, useCallback, useMemo, useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
    theme: Theme;
    resolvedTheme: "light" | "dark";
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
}

// --- External store for theme persistence ---
let listeners: Array<() => void> = [];
function emitChange() {
    listeners.forEach((l) => l());
}

function getStoredTheme(): Theme {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem("todaLaPlata-theme") as Theme) || "light";
}

function getSystemTheme(): "light" | "dark" {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(theme: Theme): "light" | "dark" {
    return theme === "system" ? getSystemTheme() : theme;
}

function applyThemeToDOM(resolved: "light" | "dark") {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
}

function subscribeToTheme(callback: () => void) {
    listeners.push(callback);
    return () => {
        listeners = listeners.filter((l) => l !== callback);
    };
}

function getThemeSnapshot(): Theme {
    return getStoredTheme();
}

function getServerSnapshot(): Theme {
    return "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerSnapshot);
    const resolved = resolveTheme(theme);

    // Apply to DOM (this is a side-effect-free derivation applied during render commit)
    if (typeof window !== "undefined") {
        applyThemeToDOM(resolved);
    }

    const setTheme = useCallback((newTheme: Theme) => {
        localStorage.setItem("todaLaPlata-theme", newTheme);
        applyThemeToDOM(resolveTheme(newTheme));
        emitChange();
    }, []);

    const toggleTheme = useCallback(() => {
        const current = resolveTheme(getStoredTheme());
        setTheme(current === "light" ? "dark" : "light");
    }, [setTheme]);

    const value = useMemo(
        () => ({ theme, resolvedTheme: resolved, setTheme, toggleTheme }),
        [theme, resolved, setTheme, toggleTheme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
