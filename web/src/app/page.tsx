export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      {/* ═══════════════════════════════════════
          NAVBAR
          ═══════════════════════════════════════ */}
      <nav
        className="sticky top-0 z-50"
        style={{
          background: "rgba(255, 255, 255, 0.72)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
        }}
      >
        <div className="container-app flex h-14 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--accent)] text-sm font-semibold text-white">
              $
            </div>
            <span
              className="text-[17px] font-semibold text-[var(--text-primary)]"
              style={{ letterSpacing: "-0.03em" }}
            >
              toda<span className="text-[var(--brand-primary)]">LaPlata</span>
            </span>
          </div>

          <div className="hidden items-center gap-1 md:flex">
            <a href="#" className="nav-link nav-link-active">
              Dashboard
            </a>
            <a href="#" className="nav-link">
              Transacciones
            </a>
            <a href="#" className="nav-link">
              Presupuestos
            </a>
            <a href="#" className="nav-link">
              Cuentas
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button className="btn btn-icon btn-secondary text-sm" aria-label="Notificaciones">
              🔔
            </button>
            <div className="avatar">VP</div>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════
          CONTENIDO
          ═══════════════════════════════════════ */}
      <main className="container-app pt-16 pb-20">
        {/* Header */}
        <div className="animate-fade-in mb-14">
          <p className="mb-3 text-sm text-[var(--text-tertiary)]">Martes, 25 de febrero 2026</p>
          <h1
            className="max-w-xl text-[48px] font-bold text-[var(--text-primary)]"
            style={{ letterSpacing: "-0.045em", lineHeight: 1.05 }}
          >
            Bienvenido de vuelta.
          </h1>
        </div>

        {/* ─── RESUMEN FINANCIERO ─── */}
        <div className="mb-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Balance */}
          <div
            className="card animate-fade-in-up"
            style={{
              opacity: 0,
              animationDelay: "100ms",
              animationFillMode: "forwards",
              padding: "2rem 2.25rem",
            }}
          >
            <p className="mb-1 text-[13px] font-medium text-[var(--text-secondary)]">
              Balance Total
            </p>
            <p
              className="amount font-bold text-[var(--text-primary)]"
              style={{ fontSize: "2.75rem", letterSpacing: "-0.04em", lineHeight: 1.1 }}
            >
              $1.250.000
            </p>
            <p className="mt-4 text-sm text-[var(--text-tertiary)]">
              <span className="font-medium text-[var(--income)]">↑ 12.5%</span> respecto al mes
              anterior
            </p>
          </div>

          {/* Ingresos */}
          <div
            className="card animate-fade-in-up"
            style={{
              opacity: 0,
              animationDelay: "200ms",
              animationFillMode: "forwards",
              padding: "2rem 2.25rem",
            }}
          >
            <p className="mb-1 text-[13px] font-medium text-[var(--text-secondary)]">
              Ingresos del mes
            </p>
            <p
              className="amount amount-income font-bold"
              style={{ fontSize: "2.75rem", letterSpacing: "-0.04em", lineHeight: 1.1 }}
            >
              +$850.000
            </p>
            <div className="progress-bar mt-5" style={{ height: "8px" }}>
              <div
                className="progress-bar-fill"
                style={{ width: "100%", background: "var(--income)" }}
              ></div>
            </div>
          </div>

          {/* Gastos */}
          <div
            className="card animate-fade-in-up"
            style={{
              opacity: 0,
              animationDelay: "300ms",
              animationFillMode: "forwards",
              padding: "2rem 2.25rem",
            }}
          >
            <p className="mb-1 text-[13px] font-medium text-[var(--text-secondary)]">
              Gastos del mes
            </p>
            <p
              className="amount amount-expense font-bold"
              style={{ fontSize: "2.75rem", letterSpacing: "-0.04em", lineHeight: 1.1 }}
            >
              -$420.000
            </p>
            <div className="progress-bar mt-5" style={{ height: "8px" }}>
              <div
                className="progress-bar-fill"
                style={{ width: "65%", background: "var(--expense)" }}
              ></div>
            </div>
          </div>
        </div>

        {/* ─── GRID PRINCIPAL ─── */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
          {/* ─── TRANSACCIONES ─── */}
          <div className="lg:col-span-3">
            <div
              className="card animate-fade-in-up"
              style={{
                opacity: 0,
                animationDelay: "400ms",
                animationFillMode: "forwards",
                padding: "2rem 2.25rem",
              }}
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[13px] font-medium text-[var(--text-secondary)]">
                  Actividad reciente
                </p>
                <a href="#" className="text-[13px] text-[var(--brand-primary)] hover:underline">
                  Ver todas →
                </a>
              </div>
              <h2
                className="mb-8 text-[28px] font-bold text-[var(--text-primary)]"
                style={{ letterSpacing: "-0.03em", lineHeight: 1.15 }}
              >
                Transacciones Recientes
              </h2>

              <div className="space-y-2">
                {/* Transacción 1 */}
                <div className="tx-row">
                  <div className="tx-icon" style={{ background: "var(--expense-subtle)" }}>
                    🛒
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-[var(--text-primary)]">
                      Supermercado Líder
                    </p>
                    <p className="mt-0.5 text-[13px] text-[var(--text-tertiary)]">
                      Alimentación · Hoy
                    </p>
                  </div>
                  <span className="amount amount-expense text-[15px] font-semibold">-$45.600</span>
                </div>

                {/* Transacción 2 */}
                <div className="tx-row">
                  <div className="tx-icon" style={{ background: "var(--income-subtle)" }}>
                    💼
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-[var(--text-primary)]">
                      Sueldo Mensual
                    </p>
                    <p className="mt-0.5 text-[13px] text-[var(--text-tertiary)]">Salario · Ayer</p>
                  </div>
                  <span className="amount amount-income text-[15px] font-semibold">+$850.000</span>
                </div>

                {/* Transacción 3 */}
                <div className="tx-row">
                  <div className="tx-icon" style={{ background: "var(--expense-subtle)" }}>
                    🚗
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-[var(--text-primary)]">
                      Bencina
                    </p>
                    <p className="mt-0.5 text-[13px] text-[var(--text-tertiary)]">
                      Transporte · Hace 2 días
                    </p>
                  </div>
                  <span className="amount amount-expense text-[15px] font-semibold">-$32.000</span>
                </div>

                {/* Transacción 4 */}
                <div className="tx-row">
                  <div className="tx-icon" style={{ background: "var(--expense-subtle)" }}>
                    🎮
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-[var(--text-primary)]">
                      Netflix + Spotify
                    </p>
                    <p className="mt-0.5 text-[13px] text-[var(--text-tertiary)]">
                      Entretenimiento · Hace 3 días
                    </p>
                  </div>
                  <span className="amount amount-expense text-[15px] font-semibold">-$12.990</span>
                </div>

                {/* Transacción 5 */}
                <div className="tx-row">
                  <div className="tx-icon" style={{ background: "var(--income-subtle)" }}>
                    💻
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-[var(--text-primary)]">
                      Freelance Diseño Web
                    </p>
                    <p className="mt-0.5 text-[13px] text-[var(--text-tertiary)]">
                      Freelance · Hace 5 días
                    </p>
                  </div>
                  <span className="amount amount-income text-[15px] font-semibold">+$180.000</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── SIDEBAR ─── */}
          <div className="space-y-5 lg:col-span-2">
            {/* Cuentas */}
            <div
              className="card animate-fade-in-up"
              style={{
                opacity: 0,
                animationDelay: "500ms",
                animationFillMode: "forwards",
                padding: "2rem 2.25rem",
              }}
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[13px] font-medium text-[var(--text-secondary)]">Tus finanzas</p>
                <div className="add-btn">+</div>
              </div>
              <h2
                className="mb-7 text-[28px] font-bold text-[var(--text-primary)]"
                style={{ letterSpacing: "-0.03em", lineHeight: 1.15 }}
              >
                Mis Cuentas
              </h2>

              <div className="space-y-3">
                <div className="account-row">
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-lg"
                    style={{ background: "var(--brand-primary-subtle)" }}
                  >
                    🏦
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-semibold text-[var(--text-primary)]">
                      Banco Santander
                    </p>
                    <p className="amount mt-0.5 text-[13px] text-[var(--text-secondary)]">
                      $980.000
                    </p>
                  </div>
                </div>

                <div className="account-row">
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-lg"
                    style={{ background: "var(--income-subtle)" }}
                  >
                    💵
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-semibold text-[var(--text-primary)]">Efectivo</p>
                    <p className="amount mt-0.5 text-[13px] text-[var(--text-secondary)]">
                      $120.000
                    </p>
                  </div>
                </div>

                <div className="account-row">
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-lg"
                    style={{ background: "var(--expense-subtle)" }}
                  >
                    💳
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-semibold text-[var(--text-primary)]">
                      Tarjeta CMR
                    </p>
                    <p className="amount amount-expense mt-0.5 text-[13px]">-$150.000</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Presupuestos */}
            <div
              className="card animate-fade-in-up"
              style={{
                opacity: 0,
                animationDelay: "600ms",
                animationFillMode: "forwards",
                padding: "2rem 2.25rem",
              }}
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[13px] font-medium text-[var(--text-secondary)]">
                  Control mensual
                </p>
                <span className="badge badge-neutral">Febrero</span>
              </div>
              <h2
                className="mb-7 text-[28px] font-bold text-[var(--text-primary)]"
                style={{ letterSpacing: "-0.03em", lineHeight: 1.15 }}
              >
                Presupuestos
              </h2>

              <div className="space-y-7">
                {/* Alimentación */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[15px] font-semibold text-[var(--text-primary)]">
                      🛒 Alimentación
                    </span>
                    <span className="amount text-[13px] text-[var(--text-secondary)]">
                      $85.000 / $120.000
                    </span>
                  </div>
                  <div className="progress-bar" style={{ height: "8px" }}>
                    <div
                      className="progress-bar-fill"
                      style={{ width: "71%", background: "var(--warning)" }}
                    ></div>
                  </div>
                  <p className="mt-2 text-[12px] font-medium" style={{ color: "var(--warning)" }}>
                    71% utilizado
                  </p>
                </div>

                {/* Transporte */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[15px] font-semibold text-[var(--text-primary)]">
                      🚗 Transporte
                    </span>
                    <span className="amount text-[13px] text-[var(--text-secondary)]">
                      $32.000 / $80.000
                    </span>
                  </div>
                  <div className="progress-bar" style={{ height: "8px" }}>
                    <div
                      className="progress-bar-fill"
                      style={{ width: "40%", background: "var(--income)" }}
                    ></div>
                  </div>
                  <p className="mt-2 text-[12px] font-medium" style={{ color: "var(--income)" }}>
                    40% utilizado
                  </p>
                </div>

                {/* Entretenimiento */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[15px] font-semibold text-[var(--text-primary)]">
                      🎮 Entretenimiento
                    </span>
                    <span className="amount text-[13px] text-[var(--text-secondary)]">
                      $42.990 / $50.000
                    </span>
                  </div>
                  <div className="progress-bar" style={{ height: "8px" }}>
                    <div
                      className="progress-bar-fill"
                      style={{ width: "86%", background: "var(--expense)" }}
                    ></div>
                  </div>
                  <p className="mt-2 text-[12px] font-medium" style={{ color: "var(--expense)" }}>
                    86% utilizado ⚠️
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón flotante */}
        <button className="fab-button" aria-label="Agregar transacción">
          +
        </button>
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--border-default)" }}>
        <div className="container-app flex items-center justify-between py-8">
          <p className="text-[13px] text-[var(--text-tertiary)]">
            © 2026 todaLaPlata — Control de Finanzas Personales
          </p>
          <p className="text-[13px] text-[var(--text-tertiary)]">Hecho con 💙 en Chile</p>
        </div>
      </footer>
    </div>
  );
}
