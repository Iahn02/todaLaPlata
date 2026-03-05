export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#080c18] text-[#f8fafc] selection:bg-[#6366f1]/30 w-full relative flex items-center justify-center p-4">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />
            <div className="absolute left-10 top-1/3 h-[300px] w-[300px] rounded-full bg-[#6366f1]/10 blur-[100px]" />
            <div className="absolute right-10 bottom-1/3 h-[300px] w-[300px] rounded-full bg-[#8b5cf6]/8 blur-[100px]" />

            {/* Grid background */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Container holding the Clerk component */}
            <div className="relative z-10 w-full max-w-lg">
                {/* Logo */}
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center mb-4 shadow-lg shadow-[#6366f1]/20">
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
                    <h1 className="text-2xl font-bold tracking-tight">
                        toda<span className="bg-gradient-to-r from-[#818cf8] to-[#a78bfa] bg-clip-text text-transparent">LaPlata</span>
                    </h1>
                    <p className="text-white/40 text-sm mt-1 text-center">Toma control absoluto de tus finanzas</p>
                </div>

                {/* Clerk component wrapper */}
                <div className="flex justify-center w-full shadow-2xl overflow-hidden rounded-2xl">
                    {children}
                </div>
            </div>
        </div>
    );
}
