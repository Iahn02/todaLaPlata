import React from "react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col font-sans">
      {/* ═══════════════════════════════════════
          NAVBAR — Estilo Monefy Landing Page
          ═══════════════════════════════════════ */}
      <nav className="relative z-50 py-6">
        <div className="container-app flex items-center justify-between">
          <div className="flex items-center gap-12">
            {/* Logo */}
            <div
              className="text-3xl font-bold tracking-tight text-[var(--brand-primary)] italic"
              style={{ fontFamily: "Georgia, serif", paddingRight: "1rem" }}
            >
              todaLaPlata
            </div>

            {/* Links Desktop */}
            <div className="hidden lg:flex items-center gap-6">
              <a href="#" className="text-sm font-semibold text-[var(--text-primary)] hover:opacity-70 transition-opacity">Finanzas Personales</a>
              <a href="#" className="text-sm font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">Inversiones</a>
              <a href="#" className="text-sm font-medium text-[var(--text-light)] bg-white/30 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm pointer-events-none">Banca</a>
              <a href="#" className="text-sm font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">Tarjetas</a>
              <a href="#" className="text-sm font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">Préstamos</a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <div className="hidden md:flex items-center gap-3">
                <SignInButton mode="modal">
                  <button className="text-sm font-semibold text-[var(--text-primary)] hover:opacity-70 transition-opacity">Iniciar sesión</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="btn-dark hidden md:inline-flex">Crear cuenta</button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-4">
                <a href="/dashboard" className="text-sm font-semibold text-[var(--text-primary)] hover:opacity-70 transition-opacity hidden sm:block">Ir al Dashboard</a>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════ */}
      <main className="flex-1 container-app relative z-10 flex flex-col lg:flex-row items-center justify-between pt-12 lg:pt-20 pb-24">

        {/* LADO IZQUIERDO — Textos y Call to Actions */}
        <div className="w-full lg:w-[45%] z-20 animate-slide-left">
          {/* Badge Downloads */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-[var(--brand-gold)]">
              {/* SVG Laurel wreath (simulado) */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" opacity="0.8">
                <path d="M12,22C6.477,22 2,17.523 2,12C2,6.477 6.477,2 12,2C17.523,2 22,6.477 22,12C22,17.523 17.523,22 12,22ZM12,20C16.418,20 20,16.418 20,12C20,7.582 16.418,4 12,4C7.582,4 4,7.582 4,12C4,16.418 7.582,20 12,20ZM11,7L13,7L13,17L11,17L11,7Z" />
              </svg>
              <div className="text-sm font-bold text-[var(--text-primary)] leading-tight">
                +11 millones<br />descargas
              </div>
            </div>
            <div className="w-px h-8 bg-black/10 mx-2"></div>
            <div className="flex items-center gap-2 text-[var(--brand-gold)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" opacity="0.8">
                <path d="M12,22C6.477,22 2,17.523 2,12C2,6.477 6.477,2 12,2C17.523,2 22,6.477 22,12C22,17.523 17.523,22 12,22ZM12,20C16.418,20 20,16.418 20,12C20,7.582 16.418,4 12,4C7.582,4 4,7.582 4,12C4,16.418 7.582,20 12,20ZM11,7L13,7L13,17L11,17L11,7Z" />
              </svg>
              <div className="text-sm font-semibold text-[var(--text-tertiary)] opacity-60 leading-tight">
                "Mejor App de Finanzas"<br />🍎
              </div>
            </div>
          </div>

          {/* Gran Título */}
          <h1
            className="text-[52px] lg:text-[72px] font-bold leading-[1.05] tracking-tight text-[var(--text-primary)] mb-6"
          >
            Toma el control<br />de tus finanzas
          </h1>

          {/* Párrafo */}
          <p className="text-[17px] text-[var(--text-secondary)] leading-relaxed mb-10 max-w-md">
            La app inteligente que te ayuda a registrar gastos, ahorrar dinero y alcanzar tus metas financieras con facilidad.
          </p>

          {/* Botones App Stores */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <a href="#" className="store-btn">
              <span className="text-3xl text-white"></span>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-white/70">Descargar en la</span>
                <span className="text-lg font-semibold leading-tight">App Store</span>
              </div>
            </a>
            <a href="#" className="store-btn">
              <span className="text-3xl text-white">▶</span>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-white/70">Disponible en</span>
                <span className="text-lg font-semibold leading-tight">Google Play</span>
              </div>
            </a>
          </div>

          {/* Reviews */}
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">
              Elegida por +11.000.000 de usuarios en el mundo
            </p>
            <div className="flex items-center gap-2">
              <div className="flex text-[var(--brand-gold)] text-xl">
                ★★★★★
              </div>
              <span className="text-sm font-bold text-[var(--text-primary)]">4.7</span>
              <span className="text-sm text-[var(--text-tertiary)]">+283,000 valoraciones</span>
            </div>
          </div>
        </div>

        {/* LADO DERECHO — Celular + Elementos Flotantes */}
        <div className="w-full lg:w-[50%] mt-20 lg:mt-0 relative h-[650px] flex items-center justify-center animate-slide-up" style={{ animationDelay: "200ms" }}>

          {/* Múltiples Monedas Flotantes ($) */}
          <div className="absolute top-10 right-10 w-16 h-16 bg-[var(--brand-gold)] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-[0_10px_20px_rgba(226,186,101,0.5)] border-b-4 border-r-4 border-[#c99f4d] animate-float z-30">
            $
          </div>
          <div className="absolute bottom-16 right-20 w-20 h-20 bg-[var(--brand-gold)] rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-[0_10px_25px_rgba(226,186,101,0.5)] border-b-4 border-r-4 border-[#c99f4d] animate-float z-30" style={{ animationDelay: "1.5s" }}>
            $
          </div>
          <div className="absolute top-1/4 left-10 w-12 h-12 bg-[var(--brand-gold)] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-[0_8px_15px_rgba(226,186,101,0.5)] border-b-4 border-r-4 border-[#c99f4d] animate-float-delayed z-0">
            $
          </div>

          {/* Tarjetas de Categorías Flotantes */}
          <div className="absolute top-20 left-12 bg-white/90 backdrop-blur px-4 py-3 rounded-2xl shadow-xl flex flex-col items-center gap-1 border border-white z-30 animate-float" style={{ animationDelay: "0.5s", transform: "rotate(-5deg)" }}>
            <div className="w-10 h-10 bg-[#e8f2ec] rounded-xl flex items-center justify-center text-[var(--brand-accent)] text-xl">🛒</div>
            <span className="text-[11px] font-bold text-[var(--text-primary)]">Súper</span>
            <span className="text-[10px] text-[var(--text-secondary)]">$45.90</span>
          </div>

          <div className="absolute top-1/3 right-4 bg-white/90 backdrop-blur px-4 py-3 rounded-2xl shadow-xl flex flex-col items-center gap-1 border border-white z-30 animate-float-delayed" style={{ transform: "rotate(8deg)" }}>
            <div className="w-10 h-10 bg-[#f9ebeb] rounded-xl flex items-center justify-center text-[var(--expense)] text-xl">☕</div>
            <span className="text-[11px] font-bold text-[var(--text-primary)]">Café</span>
            <span className="text-[10px] text-[var(--text-secondary)]">$2.49</span>
          </div>

          <div className="absolute bottom-32 left-8 bg-white/90 backdrop-blur px-4 py-3 rounded-2xl shadow-xl flex flex-col items-center gap-1 border border-white z-30 animate-float" style={{ animationDelay: "1s", transform: "rotate(-12deg)" }}>
            <div className="w-10 h-10 bg-[#e8eef2] rounded-xl flex items-center justify-center text-[#5a8fd4] text-xl">📺</div>
            <span className="text-[11px] font-bold text-[var(--text-primary)]">Netflix</span>
            <span className="text-[10px] text-[var(--text-secondary)]">$17.99</span>
          </div>

          {/* CELLPHONE MOCKUP CSS */}
          <div
            className="relative w-[300px] h-[610px] bg-[#1a1a1c] rounded-[48px] p-3 shadow-2xl z-20 flex flex-col"
            style={{ transform: "rotate(5deg)", boxShadow: "-20px 30px 60px rgba(12, 62, 46, 0.2)" }}
          >
            {/* Pantalla del celular */}
            <div className="bg-[#f0f4f1] w-full h-full rounded-[38px] overflow-hidden relative flex flex-col pt-8 border-[0.5px] border-black/10">

              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1a1a1c] rounded-b-2xl z-50"></div>

              {/* App Header */}
              <div className="px-6 flex items-center justify-between mb-6 relative z-10">
                <div className="text-xl font-bold italic" style={{ fontFamily: "Georgia, serif", color: "var(--brand-accent)" }}>toda<span className="text-[#1a1a1c]">LaPlata</span></div>
                <button className="text-[var(--text-primary)] opacity-50">🔍</button>
              </div>

              {/* Meses Pestañas */}
              <div className="px-4 flex justify-between items-center mb-8 text-[11px] uppercase tracking-wider font-semibold text-[var(--text-tertiary)] border-b border-black/5 pb-2 relative z-10">
                <span>Septiembre</span>
                <span className="text-[var(--brand-accent)] border-b-2 border-[var(--brand-accent)] pb-2 -mb-[9px]">Octubre</span>
                <span>Noviembre</span>
              </div>

              {/* Gráfico Donut Chart + Balance */}
              <div className="relative z-10 flex-1 flex flex-col items-center">

                {/* CSS Donut */}
                <div className="relative w-48 h-48 rounded-full border-[18px] border-[var(--brand-accent)] shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)] mx-auto"
                  style={{
                    borderTopColor: "var(--brand-gold)",
                    borderLeftColor: "var(--expense)",
                    borderRightColor: "#5a8fd4",
                    transform: "rotate(45deg)"
                  }}
                >
                  <div className="absolute inset-0 rounded-full border-[6px] border-[#f0f4f1]"></div>
                </div>

                {/* Texto Central */}
                <div className="absolute top-24 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center w-full z-20">
                  <span className="text-[22px] font-bold text-[var(--brand-primary)]">$5,000.00</span>
                  <span className="text-[13px] font-medium text-[var(--expense)]">($1,684.00)</span>
                </div>

                {/* Badge Balance */}
                <div className="mt-8 bg-[var(--brand-accent)] text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-md">
                  Balance $3,315.00
                </div>

                {/* Botones de acción inferiores (+ y -) */}
                <div className="flex justify-center gap-10 mt-auto mb-10 w-full px-12">
                  <div className="w-14 h-14 rounded-full border-4 border-[var(--expense)] text-[var(--expense)] flex items-center justify-center text-3xl font-medium bg-[#fcf2f2] shadow-sm cursor-pointer hover:bg-[var(--expense)] hover:text-white transition-colors">-</div>
                  <div className="w-14 h-14 rounded-full border-4 border-[var(--brand-accent)] text-[var(--brand-accent)] flex items-center justify-center text-3xl font-medium bg-[#f0f9f3] shadow-sm cursor-pointer hover:bg-[var(--brand-accent)] hover:text-white transition-colors">+</div>
                </div>

              </div>

              {/* Footer Phone */}
              <div className="h-12 border-t border-black/5 flex items-center px-6">
                <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Transacciones</span>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Botón Flotante (Izquierda abajo estilo soporte) */}
      <button className="fixed bottom-6 left-6 btn-accent text-sm hidden md:flex items-center gap-2 z-50 rounded-lg shadow-lg">
        <span>×</span> OBTENER CONSEJOS
      </button>

    </div>
  );
}
