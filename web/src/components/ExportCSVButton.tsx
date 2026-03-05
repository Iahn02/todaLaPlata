"use client";

import { trpc } from "@/trpc/client";
import { Download } from "lucide-react";
import { useState } from "react";

export function ExportCSVButton() {
    const [isExporting, setIsExporting] = useState(false);
    const utils = trpc.useUtils();

    const handleExport = async () => {
        try {
            setIsExporting(true);
            const csvData = await utils.transactions.exportCSV.fetch();
            const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `todaLaPlata_transacciones_${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error exporting CSV:", err);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all
                bg-[var(--bg-nested)] border border-[var(--glass-border)] text-[var(--text-tertiary)] hover:bg-[#6366f1]/10 hover:text-[#6366f1] dark:hover:text-[#818cf8]
                disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Download className={`w-4 h-4 ${isExporting ? "animate-bounce" : ""}`} />
            {isExporting ? "Exportando..." : "Exportar CSV"}
        </button>
    );
}
