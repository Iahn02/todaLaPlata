import React from "react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col font-sans">
      {/* ═══════════════════════════════════════
          NAVBAR — Estilo Retro Landing Page
          ═══════════════════════════════════════ */}
      <nav className="relative z-50 py-6">
        <div className="container-app flex items-center justify-between">
          <div className="flex items-center gap-12">
            {/* Logo */}
            <div className="text-3xl font-bold tracking-tight text-[#1a1a1a]">
              toda<span className="text-[#f3701e]">LaPlata</span>
            </div>

            {/* Links Desktop */}
            <div className="hidden lg:flex items-center gap-6">
              <a href="#" className="text-sm font-semibold text-[#1a1a1a] hover:opacity-70 transition-opacity">Finanzas Personales</a>
              <a href="#" className="text-sm font-medium text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">Inversiones</a>
              <a href="#" className="text-sm font-medium text-[#4b607f] bg-[#4b607f]/10 px-4 py-1.5 rounded-full pointer-events-none">Banca</a>
              <a href="#" className="text-sm font-medium text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">Tarjetas</a>
              <a href="#" className="text-sm font-medium text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">Préstamos</a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <div className="hidden md:flex items-center gap-3">
                <SignInButton mode="modal">
                  <button className="text-sm font-semibold text-[#1a1a1a] hover:opacity-70 transition-opacity">Iniciar sesión</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="btn-dark hidden md:inline-flex">Crear cuenta</button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-4">
                <a href="/dashboard" className="text-sm font-semibold text-[#1a1a1a] hover:opacity-70 transition-opacity hidden sm:block">Ir al Dashboard</a>
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
            <div className="flex items-center gap-2 text-[#f3701e]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" opacity="0.8">
                <path d="M12,22C6.477,22 2,17.523 2,12C2,6.477 6.477,2 12,2C17.523,2 22,6.477 22,12C22,17.523 17.523,22 12,22ZM12,20C16.418,20 20,16.418 20,12C20,7.582 16.418,4 12,4C7.582,4 4,7.582 4,12C4,16.418 7.582,20 12,20ZM11,7L13,7L13,17L11,17L11,7Z" />
              </svg>
              <div className="text-sm font-bold text-[#1a1a1a] leading-tight">
                +11 millones<br />descargas
              </div>
            </div>
            <div className="w-px h-8 bg-[#1a1a1a]/10 mx-2"></div>
            <div className="flex items-center gap-2 text-[#e2ba65]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" opacity="0.8">
                <path d="M12,22C6.477,22 2,17.523 2,12C2,6.477 6.477,2 12,2C17.523,2 22,6.477 22,12C22,17.523 17.523,22 12,22ZM12,20C16.418,20 20,16.418 20,12C20,7.582 16.418,4 12,4C7.582,4 4,7.582 4,12C4,16.418 7.582,20 12,20ZM11,7L13,7L13,17L11,17L11,7Z" />
              </svg>
              <div className="text-sm font-semibold text-[#6b6b6b] leading-tight">
                "Mejor App de Finanzas"<br />🍎
              </div>
            </div>
          </div>

          {/* Gran Título */}
          <h1
            className="text-[52px] lg:text-[72px] font-bold leading-[1.05] tracking-tight text-[#1a1a1a] mb-6"
          >
            Toma el control<br />de tus finanzas
          </h1>

          {/* Párrafo */}
          <p className="text-[17px] text-[#3d3d3d] leading-relaxed mb-10 max-w-md">
            La app inteligente que te ayuda a registrar gastos, ahorrar dinero y alcanzar tus metas financieras con facilidad.
          </p>

          {/* Botones App Stores */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <a href="#" className="store-btn">
              <span className="text-3xl text-white"></span>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-[#f5f0eb]/70">Descargar en la</span>
                <span className="text-lg font-semibold leading-tight">App Store</span>
              </div>
            </a>
            <a href="#" className="store-btn">
              <span className="text-3xl text-white">▶</span>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-[#f5f0eb]/70">Disponible en</span>
                <span className="text-lg font-semibold leading-tight">Google Play</span>
              </div>
            </a>
          </div>

          {/* Reviews */}
          <div>
            <p className="text-sm font-semibold text-[#1a1a1a] mb-2">
              Elegida por +11.000.000 de usuarios en el mundo
            </p>
            <div className="flex items-center gap-2">
              <div className="flex text-[#f3701e] text-xl">
                ★★★★★
              </div>
              <span className="text-sm font-bold text-[#1a1a1a]">4.7</span>
              <span className="text-sm text-[#6b6b6b]">+283,000 valoraciones</span>
            </div>
          </div>
        </div>

        {/* LADO DERECHO — Celular + Elementos Flotantes */}
        <div className="w-full lg:w-[50%] mt-20 lg:mt-0 relative h-[650px] flex items-center justify-center animate-slide-up" style={{ animationDelay: "200ms" }}>

          {/* Múltiples Monedas Flotantes ($) */}
          <div className="absolute top-10 right-10 w-16 h-16 bg-[#f3701e] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-[0_10px_20px_rgba(243,112,30,0.4)] border-b-4 border-r-4 border-[#c55a14] animate-float z-30">
            $
          </div>
          <div className="absolute bottom-16 right-20 w-20 h-20 bg-[#e2ba65] rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-[0_10px_25px_rgba(226,186,101,0.4)] border-b-4 border-r-4 border-[#c99f4d] animate-float z-30" style={{ animationDelay: "1.5s" }}>
            $
          </div>
          <div className="absolute top-1/4 left-10 w-12 h-12 bg-[#4b607f] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-[0_8px_15px_rgba(75,96,127,0.4)] border-b-4 border-r-4 border-[#3a4d66] animate-float-delayed z-0">
            $
          </div>

          {/* Tarjetas de Categorías Flotantes */}
          <div className="absolute top-20 left-12 bg-white/90 backdrop-blur px-4 py-3 rounded-2xl shadow-xl flex flex-col items-center gap-1 border border-[#e8d8c9] z-30 animate-float" style={{ animationDelay: "0.5s", transform: "rotate(-5deg)" }}>
            <div className="w-10 h-10 bg-[#f3701e]/10 rounded-xl flex items-center justify-center text-[#f3701e] text-xl">🛒</div>
            <span className="text-[11px] font-bold text-[#1a1a1a]">Súper</span>
            <span className="text-[10px] text-[#6b6b6b]">$45.90</span>
          </div>

          <div className="absolute top-1/3 right-4 bg-white/90 backdrop-blur px-4 py-3 rounded-2xl shadow-xl flex flex-col items-center gap-1 border border-[#e8d8c9] z-30 animate-float-delayed" style={{ transform: "rotate(8deg)" }}>
            <div className="w-10 h-10 bg-[#c95d45]/10 rounded-xl flex items-center justify-center text-[#c95d45] text-xl">☕</div>
            <span className="text-[11px] font-bold text-[#1a1a1a]">Café</span>
            <span className="text-[10px] text-[#6b6b6b]">$2.49</span>
          </div>

          <div className="absolute bottom-32 left-8 bg-white/90 backdrop-blur px-4 py-3 rounded-2xl shadow-xl flex flex-col items-center gap-1 border border-[#e8d8c9] z-30 animate-float" style={{ animationDelay: "1s", transform: "rotate(-12deg)" }}>
            <div className="w-10 h-10 bg-[#4b607f]/10 rounded-xl flex items-center justify-center text-[#4b607f] text-xl">📺</div>
            <span className="text-[11px] font-bold text-[#1a1a1a]">Netflix</span>
            <span className="text-[10px] text-[#6b6b6b]">$17.99</span>
          </div>

          {/* CELLPHONE MOCKUP CSS */}
          <div
            className="relative w-[300px] h-[610px] bg-[#1a1a1a] rounded-[48px] p-3 shadow-2xl z-20 flex flex-col"
            style={{ transform: "rotate(5deg)", boxShadow: "-20px 30px 60px rgba(26, 26, 26, 0.25)" }}
          >
            {/* Pantalla del celular */}
            <div className="bg-[#f5f0eb] w-full h-full rounded-[38px] overflow-hidden relative flex flex-col pt-8 border-[0.5px] border-black/10">

              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1a1a1a] rounded-b-2xl z-50"></div>

              {/* App Header */}
              <div className="px-6 flex items-center justify-between mb-6 relative z-10">
                <div className="text-xl font-bold" style={{ color: "#1a1a1a" }}>toda<span style={{ color: "#f3701e" }}>LaPlata</span></div>
                <button className="text-[#1a1a1a] opacity-50">🔍</button>
              </div>

              {/* Meses Pestañas */}
              <div className="px-4 flex justify-between items-center mb-8 text-[11px] uppercase tracking-wider font-semibold text-[#6b6b6b] border-b border-black/5 pb-2 relative z-10">
                <span>Septiembre</span>
                <span className="text-[#f3701e] border-b-2 border-[#f3701e] pb-2 -mb-[9px]">Octubre</span>
                <span>Noviembre</span>
              </div>

              {/* Gráfico Donut Chart + Balance */}
              <div className="relative z-10 flex-1 flex flex-col items-center">

                {/* CSS Donut */}
                <div className="relative w-48 h-48 rounded-full border-[18px] border-[#4b607f] shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)] mx-auto"
                  style={{
                    borderTopColor: "#e2ba65",
                    borderLeftColor: "#c95d45",
                    borderRightColor: "#f3701e",
                    transform: "rotate(45deg)"
                  }}
                >
                  <div className="absolute inset-0 rounded-full border-[6px] border-[#f5f0eb]"></div>
                </div>

                {/* Texto Central */}
                <div className="absolute top-24 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center w-full z-20">
                  <span className="text-[22px] font-bold text-[#1a1a1a]">$5,000.00</span>
                  <span className="text-[13px] font-medium text-[#c95d45]">($1,684.00)</span>
                </div>

                {/* Badge Balance */}
                <div className="mt-8 bg-[#4b607f] text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-md">
                  Balance $3,315.00
                </div>

                {/* Botones de acción inferiores (+ y -) */}
                <div className="flex justify-center gap-10 mt-auto mb-10 w-full px-12">
                  <div className="w-14 h-14 rounded-full border-4 border-[#c95d45] text-[#c95d45] flex items-center justify-center text-3xl font-medium bg-[#c95d45]/5 shadow-sm cursor-pointer hover:bg-[#c95d45] hover:text-white transition-colors">-</div>
                  <div className="w-14 h-14 rounded-full border-4 border-[#4b607f] text-[#4b607f] flex items-center justify-center text-3xl font-medium bg-[#4b607f]/5 shadow-sm cursor-pointer hover:bg-[#4b607f] hover:text-white transition-colors">+</div>
                </div>

              </div>

              {/* Footer Phone */}
              <div className="h-12 border-t border-black/5 flex items-center px-6">
                <span className="text-[10px] text-[#6b6b6b] uppercase font-semibold">Transacciones</span>
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
