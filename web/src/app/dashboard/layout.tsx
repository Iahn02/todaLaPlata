import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { getCurrentUser } from "@/lib/prisma";
import { Navigation } from "@/components/Navigation";
import { AddTransactionButton } from "@/components/AddTransactionModal";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const dbUser = await getCurrentUser();

    if (!dbUser) {
        redirect("/sign-in");
    }

    return (
        <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col md:flex-row font-sans selection:bg-[#6366f1]/20 transition-colors duration-300">

            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex flex-col w-[260px] bg-[var(--bg-sidebar)] sticky top-0 h-screen p-5 z-20 border-r border-white/[0.06]">
                {/* Logo */}
                <div className="flex items-center gap-2.5 mb-8 pl-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[#6366f1]/15">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className="text-lg font-bold tracking-tight text-[#f8fafc]">
                        toda<span className="bg-gradient-to-r from-[#818cf8] to-[#a78bfa] bg-clip-text text-transparent">LaPlata</span>
                    </span>
                </div>

                <Navigation />

                {/* Theme Toggle */}
                <div className="mt-4">
                    <ThemeToggle />
                </div>

                {/* User Profile */}
                <div className="mt-auto bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] p-3.5 rounded-xl flex items-center gap-3">
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: { userButtonAvatarBox: "w-9 h-9" },
                        }}
                    />
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold truncate text-[#f8fafc]">{dbUser.name}</span>
                        <span className="text-[11px] text-[#f8fafc]/35 truncate">{dbUser.email}</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen relative pb-24 md:pb-0">

                {/* Mobile Header */}
                <header className="md:hidden sticky top-0 z-30 bg-[var(--bg-sidebar)] border-b border-white/[0.06] px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-base font-bold tracking-tight text-[#f8fafc]">
                            toda<span className="bg-gradient-to-r from-[#818cf8] to-[#a78bfa] bg-clip-text text-transparent">LaPlata</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </header>

                {/* Dashboard Pages Content */}
                <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8">
                    {children}
                </main>
            </div>

            {/* Navigation Mobile */}
            <Navigation />

            {/* Global FAB */}
            <AddTransactionButton />
        </div>
    );
}
