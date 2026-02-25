import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserButton } from "@clerk/nextjs";

export default async function DashboardPage() {
    // Verificamos en el servidor si el usuario está autenticado
    const { userId } = await auth();

    // Si no hay sesión (alguien intentó entrar por la URL directa), 
    // Clerk automáticamente redirigirá al login gracias el proxy.ts, pero 
    // por seguridad y buenas prácticas validamos el server-side auth.
    if (!userId) {
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-page text-primary flex flex-col font-sans">
            {/* NAVBAR PRIVADA */}
            <nav className="border-b border-black/5 bg-white">
                <div className="container-app h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm" style={{ background: "var(--brand-primary)" }}>
                            $
                        </div>
                        <span className="text-base font-semibold text-[var(--text-primary)]" style={{ letterSpacing: "-0.03em" }}>
                            toda<span className="text-[var(--brand-accent)]">LaPlata</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-[var(--text-secondary)] hidden sm:inline-block">Sesión activa ({userId.slice(-5)})</span>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </div>
            </nav>

            <main className="container-app py-12 flex-1">
                <h1 className="text-3xl font-bold mb-8">🛠️ Dashboard en Construcción</h1>

                <p className="text-[var(--text-secondary)] mb-6 text-lg max-w-2xl">
                    ¡Felicidades! Lograste entrar a una ruta protegida. Aquí implementaremos el verdadero dashboard con tus datos de SQLite/Prisma muy pronto.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
                        <h3 className="font-semibold text-xl mb-2 text-[var(--text-primary)]">Ingresos</h3>
                        <p className="text-[var(--income)] text-2xl font-bold">$0.00</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
                        <h3 className="font-semibold text-xl mb-2 text-[var(--text-primary)]">Gastos</h3>
                        <p className="text-[var(--expense)] text-2xl font-bold">$0.00</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
                        <h3 className="font-semibold text-xl mb-2 text-[var(--text-primary)]">Balance</h3>
                        <p className="text-[var(--brand-accent)] text-2xl font-bold">$0.00</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
