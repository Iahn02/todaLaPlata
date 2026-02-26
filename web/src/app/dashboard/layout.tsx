import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { getCurrentUser } from "@/lib/prisma";
import { Navigation } from "@/components/Navigation";
import { AddTransactionButton } from "@/components/AddTransactionModal";

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
        <div className="min-h-screen bg-[#f5f0eb] text-[#1a1a1a] flex flex-col md:flex-row font-sans selection:bg-[#f3701e]/20">

            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex flex-col w-72 bg-[#1a1a1a] sticky top-0 h-screen p-6 z-20">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-[#f3701e] flex items-center justify-center shadow-lg shadow-[#f3701e]/20 text-white font-bold text-lg">
                        $
                    </div>
                    <span className="text-xl font-bold tracking-tight text-[#f5f0eb]">
                        toda<span className="text-[#f3701e]">LaPlata</span>
                    </span>
                </div>

                <Navigation />

                <div className="mt-auto bg-white/10 backdrop-blur-sm border border-white/10 p-4 rounded-xl flex items-center gap-3">
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: { userButtonAvatarBox: "w-10 h-10" },
                        }}
                    />
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold truncate text-[#f5f0eb]">{dbUser.name}</span>
                        <span className="text-xs text-[#f5f0eb]/50 truncate">{dbUser.email}</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen relative pb-24 md:pb-0">

                {/* Mobile Header */}
                <header className="md:hidden sticky top-0 z-30 bg-[#1a1a1a] px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#f3701e] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            $
                        </div>
                        <span className="text-lg font-bold tracking-tight text-[#f5f0eb]">
                            toda<span className="text-[#f3701e]">LaPlata</span>
                        </span>
                    </div>
                    <UserButton afterSignOutUrl="/" />
                </header>

                {/* Dashboard Pages Content */}
                <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8">
                    {children}
                </main>
            </div>

            {/* Navigation Mobile Component is inserted anywhere because it uses Fixed positioning */}
            <Navigation />

            {/* Global FAB (Floating Action Button) to add transactions from any sub-page */}
            <AddTransactionButton />
        </div>
    );
}
