import React from "react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col font-sans bg-[#080c18] text-white">

      {/* ═══════ BACKGROUND EFFECTS ═══════ */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#6366f1]/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#8b5cf6]/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#06b6d4]/5 rounded-full blur-[150px]" />
      </div>

      {/* ═══════ GRID/NOISE BACKGROUND ═══════ */}
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

      {/* ═══════ NAVBAR ═══════ */}
      <nav className="relative z-50 py-5">
        <div className="container-app flex items-center justify-between">
          <div className="flex items-center gap-10">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[#6366f1]/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight">
                toda<span className="bg-gradient-to-r from-[#818cf8] to-[#a78bfa] bg-clip-text text-transparent">LaPlata</span>
              </span>
            </div>

            {/* Links Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {["Características", "Seguridad", "Precios"].map((link) => (
                <a key={link} href="#" className="text-sm font-medium text-white/50 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-all">
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SignedOut>
              <div className="hidden md:flex items-center gap-3">
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-white/60 hover:text-white px-4 py-2 rounded-lg transition-all">
                    Iniciar sesión
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="btn-primary text-sm px-5 py-2.5">
                    Empezar gratis
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-4">
                <a href="/dashboard" className="btn-primary text-sm px-5 py-2.5">
                  Ir al Dashboard
                </a>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* ═══════ HERO SECTION ═══════ */}
      <main className="flex-1 container-app relative z-10 flex flex-col items-center justify-center text-center pt-16 lg:pt-24 pb-32">

        {/* Badge */}
        <div className="animate-fade-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
          <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
          <span className="text-xs font-medium text-white/70">+11 millones de usuarios confían en nosotros</span>
        </div>

        {/* HERO TITLE */}
        <h1 className="animate-slide-up text-[48px] sm:text-[56px] md:text-[68px] lg:text-[80px] font-extrabold leading-[1.05] tracking-tight mb-6 max-w-4xl">
          Tus finanzas,{" "}
          <span className="bg-gradient-to-r from-[#818cf8] via-[#a78bfa] to-[#22d3ee] bg-clip-text text-transparent animate-gradient">
            bajo control total
          </span>
        </h1>

        {/* Subtitle */}
        <p className="animate-slide-up text-lg md:text-xl text-white/50 leading-relaxed mb-10 max-w-2xl" style={{ animationDelay: "100ms" }}>
          La plataforma inteligente que te ayuda a registrar gastos, ahorrar dinero
          y alcanzar tus metas financieras con claridad y simplicidad.
        </p>

        {/* CTAs */}
        <div className="animate-slide-up flex flex-wrap items-center justify-center gap-4 mb-16" style={{ animationDelay: "200ms" }}>
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="btn-primary text-base px-8 py-3.5 shadow-xl shadow-[#6366f1]/25">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Comienza gratis
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <a href="/dashboard" className="btn-primary text-base px-8 py-3.5 shadow-xl shadow-[#6366f1]/25">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Ir al Dashboard
            </a>
          </SignedIn>
          <a href="#features" className="btn-secondary text-base px-8 py-3.5">
            Ver características
          </a>
        </div>

        {/* ═══════ FLOATING DASHBOARD PREVIEW ═══════ */}
        <div className="animate-slide-up relative w-full max-w-4xl" style={{ animationDelay: "400ms" }}>
          {/* Glow behind */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/20 via-[#8b5cf6]/15 to-[#06b6d4]/20 rounded-[28px] blur-2xl scale-95 opacity-60" />

          {/* Dashboard Mockup Card */}
          <div className="relative bg-[#111827]/80 backdrop-blur-xl rounded-[24px] border border-white/10 p-6 md:p-8 shadow-2xl overflow-hidden">

            {/* Top bar mockup */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]/80" />
                <div className="w-3 h-3 rounded-full bg-[#f59e0b]/80" />
                <div className="w-3 h-3 rounded-full bg-[#22c55e]/80" />
              </div>
              <div className="flex items-center gap-2 text-white/30 text-xs">
                <div className="w-32 h-5 bg-white/5 rounded-full" />
              </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Balance Total", value: "$3.315.000", color: "from-[#6366f1] to-[#8b5cf6]", icon: "💰" },
                { label: "Ingresos", value: "+$5.000.000", color: "from-[#10b981] to-[#059669]", icon: "📈" },
                { label: "Gastos", value: "-$1.684.000", color: "from-[#ef4444] to-[#dc2626]", icon: "📉" },
              ].map((card) => (
                <div key={card.label} className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{card.icon}</span>
                    <span className="text-xs text-white/40 font-medium">{card.label}</span>
                  </div>
                  <p className={`text-lg md:text-xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Chart Placeholder */}
            <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-white/60">Flujo de Caja Mensual</span>
                <div className="flex gap-3 text-xs text-white/30">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#818cf8]" />Ingresos</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ef4444]" />Gastos</span>
                </div>
              </div>
              {/* SVG Chart */}
              <svg viewBox="0 0 600 120" className="w-full h-24 md:h-32">
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Income area */}
                <path d="M0,100 C50,90 100,70 150,65 C200,60 250,50 300,40 C350,30 400,35 450,25 C500,15 550,20 600,10 L600,120 L0,120Z" fill="url(#incomeGrad)" />
                <path d="M0,100 C50,90 100,70 150,65 C200,60 250,50 300,40 C350,30 400,35 450,25 C500,15 550,20 600,10" fill="none" stroke="#818cf8" strokeWidth="2.5" />
                {/* Expense area */}
                <path d="M0,110 C50,108 100,105 150,100 C200,95 250,85 300,80 C350,75 400,70 450,65 C500,70 550,60 600,55 L600,120 L0,120Z" fill="url(#expenseGrad)" />
                <path d="M0,110 C50,108 100,105 150,100 C200,95 250,85 300,80 C350,75 400,70 450,65 C500,70 550,60 600,55" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 3" />
              </svg>
            </div>
          </div>
        </div>

        {/* ═══════ TRUST METRICS ═══════ */}
        <div className="animate-fade-in mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12 text-white/30" style={{ animationDelay: "600ms" }}>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-bold text-white/80">4.8 ★</span>
            <span className="text-xs">App Store</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-bold text-white/80">11M+</span>
            <span className="text-xs">Descargas</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-bold text-white/80">256-bit</span>
            <span className="text-xs">Encriptación</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-bold text-white/80">99.9%</span>
            <span className="text-xs">Uptime</span>
          </div>
        </div>

      </main>

      {/* ═══════ FEATURES SECTION ═══════ */}
      <section id="features" className="relative z-10 container-app pb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Todo lo que necesitas para{" "}
            <span className="bg-gradient-to-r from-[#818cf8] to-[#22d3ee] bg-clip-text text-transparent">controlar tu dinero</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">Herramientas poderosas diseñadas para ser simples y efectivas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: "📊", title: "Dashboard inteligente", desc: "Visualiza tu situación financiera con gráficos interactivos y métricas en tiempo real." },
            { icon: "🏷️", title: "Categorías personalizadas", desc: "Organiza tus gastos con categorías, íconos y colores a tu gusto." },
            { icon: "💳", title: "Múltiples cuentas", desc: "Gestiona efectivo, bancos, tarjetas de crédito e inversiones en un solo lugar." },
            { icon: "🔄", title: "Gastos recurrentes", desc: "Automatiza suscripciones, arriendos y pagos fijos para nunca olvidar uno." },
            { icon: "📋", title: "Presupuestos mensuales", desc: "Define límites por categoría y recibe alertas cuando te acerques al tope." },
            { icon: "📱", title: "App Móvil + Web", desc: "Accede desde cualquier dispositivo. Tus datos siempre sincronizados." },
          ].map((feature) => (
            <div key={feature.title} className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-[#6366f1]/30 hover:bg-white/[0.05] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2 text-white/90">{feature.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="relative z-10 border-t border-white/5 py-8">
        <div className="container-app flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white/50">todaLaPlata</span>
          </div>
          <p className="text-xs text-white/25">© 2026 todaLaPlata. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
