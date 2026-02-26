export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#1a1a1a] text-[#f5f0eb] selection:bg-[#f3701e]/30 w-full relative flex items-center justify-center p-4">
            {/* Background decoration elements for premium feel */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(75,96,127,0.25),rgba(255,255,255,0))]" />
            <div className="absolute left-10 top-1/3 h-[300px] w-[300px] rounded-full bg-[#4b607f]/15 blur-[100px]" />
            <div className="absolute right-10 bottom-1/3 h-[300px] w-[300px] rounded-full bg-[#f3701e]/10 blur-[100px]" />

            {/* Container holding the Clerk component */}
            <div className="relative z-10 w-full max-w-lg">
                {/* Simple elegant logo text above the form */}
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-[#f3701e] flex items-center justify-center mb-4 shadow-lg shadow-[#f3701e]/20">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">todaLaPlata</h1>
                    <p className="text-[#f5f0eb]/50 text-sm mt-1 text-center">Toma control absoluto de tus finanzas</p>
                </div>

                {/* Clerk component wrapper with glassmorphism */}
                <div className="flex justify-center w-full shadow-2xl overflow-hidden rounded-2xl">
                    {children}
                </div>
            </div>
        </div>
    );
}
