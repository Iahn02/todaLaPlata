# 💰 Plan de Desarrollo: todaLaPlata — App de Finanzas Personales
¡Excelente proyecto para tu portafolio! He preparado un plan de desarrollo por etapas con tecnologías que están en altísima demanda en el mercado laboral actual.

## 🛠️ Stack Tecnológico Recomendado
| Capa | Tecnología | Demanda Laboral |
| :--- | :--- | :--- |
| Frontend Web | Next.js 15 (React) | 🔥🔥🔥🔥🔥 — El framework React más demandado |
| Mobile (iPhone) | React Native + Expo | 🔥🔥🔥🔥🔥 — Comparte conocimiento con React |
| Styling | Tailwind CSS 4 | 🔥🔥🔥🔥🔥 — Estándar de la industria |
| Backend / API | Next.js API Routes + tRPC | 🔥🔥🔥🔥 — Type-safe APIs, muy valorado |
| Base de datos | PostgreSQL + Prisma ORM | 🔥🔥🔥🔥🔥 — La DB relacional más demandada |
| Autenticación | Clerk o NextAuth.js | 🔥🔥🔥🔥 — Auth moderna y segura |
| State Management | Zustand + TanStack Query | 🔥🔥🔥🔥 — Reemplazo moderno de Redux |
| Gráficos | Recharts o Chart.js | 🔥🔥🔥 — Visualización de datos |
| Testing | Vitest + Playwright | 🔥🔥🔥🔥 — Testing moderno |
| CI/CD & Deploy | Vercel + GitHub Actions | 🔥🔥🔥🔥🔥 — DevOps esencial |
| Lenguaje | TypeScript | 🔥🔥🔥🔥🔥 — Obligatorio para roles senior |

**¿Por qué este stack?**
- TypeScript + React + Next.js aparecen en +70% de las ofertas laborales frontend/fullstack.
- React Native te permite reutilizar tu conocimiento de React para móvil, y es la opción cross-platform más demandada.
- PostgreSQL + Prisma es el combo más solicitado en backend moderno.
- Tailwind CSS se ha convertido en el estándar para styling en 2025-2026.

## 📋 Plan de Desarrollo por Etapas

### 🟢 Etapa 1 — Fundación y Setup (Semana 1-2)
**Objetivo:** Tener el proyecto configurado con buenas prácticas desde el inicio.

| Tarea | Detalle |
| :--- | :--- |
| 1.1 | ✅ Inicializar proyecto Next.js 15 con TypeScript y Tailwind CSS |
| 1.2 | ✅ Configurar ESLint + Prettier |
| 1.3 | ✅ Configurar SQLite local + Prisma ORM |
| 1.4 | ✅ Definir esquema de base de datos inicial (usuarios, transacciones, categorías, cuentas) |
| 1.5 | ✅ Configurar repositorio Git + GitHub con branching strategy |
| 1.6 | ✅ Configurar Vercel para deploy automático |
| 1.7 | ✅ Crear Design System base: colores, tipografía, componentes UI reutilizables |

**Entregable:** Proyecto desplegado en Vercel con landing page básica y DB conectada.

### 🟡 Etapa 2 — Autenticación y Modelo de Datos (Semana 3-4)
**Objetivo:** Sistema de login seguro y estructura de datos completa.

| Tarea | Detalle |
| :--- | :--- |
| 2.1 | ✅ Implementar autenticación con Clerk (Google, Email, Apple) |
| 2.2 | ✅ Diseñar y migrar esquema completo de Prisma:<br>→ User, Account (cuentas bancarias/efectivo)<br>→ Transaction (ingresos/gastos)<br>→ Category (categorías personalizables)<br>→ Budget (presupuestos por categoría) |
| 2.3 | ✅ Crear API routes con tRPC para CRUD de transacciones |
| 2.4 | ✅ Implementar middleware de protección de rutas |
| 2.5 | ✅ Crear páginas de login/registro con diseño premium |

**Entregable:** Usuarios pueden registrarse, loguearse y su sesión persiste.

### 🟠 Etapa 3 — Core Features Web (Semana 5-8)
**Objetivo:** Funcionalidad principal de la app financiera.

| Tarea | Detalle |
| :--- | :--- |
| 3.1 | ✅ Dashboard principal con resumen financiero (ingresos, gastos, balance) |
| 3.2 | ✅ Registro de transacciones — formulario para agregar ingresos/gastos |
| 3.3 | ✅ Lista de transacciones con filtros (fecha, categoría, tipo, monto) |
| 3.4 | ✅ Gestión de categorías — crear, editar, eliminar categorías con iconos |
| 3.5 | ✅ Múltiples cuentas — banco, efectivo, tarjeta de crédito |
| 3.6 | Transferencias entre cuentas |
| 3.7 | Gráficos interactivos con Recharts (gastos por categoría, tendencia mensual) |
| 3.8 | Presupuestos — definir límite por categoría y ver progreso |

**Entregable:** App web 100% funcional con todas las features core.

### 🔴 Etapa 4 — App Móvil con React Native (Semana 9-12)
**Objetivo:** App móvil nativa para iPhone conectada al mismo backend.

| Tarea | Detalle |
| :--- | :--- |
| 4.1 | Inicializar proyecto Expo (React Native) |
| 4.2 | Configurar navegación con Expo Router |
| 4.3 | Conectar al mismo backend (API tRPC compartida) |
| 4.4 | Implementar autenticación mobile con Clerk |
| 4.5 | Recrear pantallas: Dashboard, Transacciones, Agregar gasto |
| 4.6 | Quick-add widget — agregar gasto rápido desde la pantalla principal |
| 4.7 | Implementar notificaciones push (recordatorios de registro) |
| 4.8 | Optimizar UX mobile (gestos, haptic feedback, animaciones nativas) |
| 4.9 | TestFlight — publicar versión beta para iPhone |

**Entregable:** App iOS instalable vía TestFlight.

### 🟣 Etapa 5 — Features Avanzadas (Semana 13-16)
**Objetivo:** Diferenciadores que hacen al proyecto destacar en un portafolio.

| Tarea | Detalle |
| :--- | :--- |
| 5.1 | Transacciones recurrentes (sueldo, arriendo, Netflix, etc.) |
| 5.2 | Exportar datos a CSV/Excel |
| 5.3 | Dark mode / Light mode con persistencia |
| 5.4 | Dashboard con análisis avanzado: comparativa mes a mes, predicción de gastos |
| 5.5 | Multi-moneda (CLP, USD, EUR) con tasas de cambio |
| 5.6 | PWA — hacer la web instalable como app en cualquier dispositivo |
| 5.7 | Búsqueda global con debouncing |

**Entregable:** App con features premium que la diferencian.

### ⚫ Etapa 6 — Testing, Pulido y Portfolio (Semana 17-18)
**Objetivo:** Proyecto listo para mostrar a reclutadores.

| Tarea | Detalle |
| :--- | :--- |
| 6.1 | Tests unitarios con Vitest (mínimo 80% coverage en lógica de negocio) |
| 6.2 | Tests E2E con Playwright (flujos críticos) |
| 6.3 | CI/CD con GitHub Actions (lint + test + deploy) |
| 6.4 | README profesional con screenshots, tech stack, arquitectura |
| 6.5 | Seed data — datos demo para que reclutadores vean la app en acción |
| 6.6 | Performance — optimizar con Lighthouse (score 90+) |
| 6.7 | SEO y accesibilidad — meta tags, alt texts, aria labels |

**Entregable:** Proyecto desplegado, testeado, y documentado profesionalmente.

## 🏗️ Arquitectura del Proyecto
```text
todaLaPlata/
├── apps/
│   ├── web/                  # Next.js 15 (App Router)
│   │   ├── app/              # Rutas y páginas
│   │   ├── components/       # Componentes React
│   │   ├── lib/              # Utilidades y helpers
│   │   └── styles/           # Tailwind config
│   └── mobile/               # React Native (Expo)
│       ├── app/              # Expo Router
│       ├── components/       # Componentes nativos
│       └── lib/              # Lógica compartida
├── packages/
│   ├── api/                  # tRPC routers compartidos
│   ├── db/                   # Prisma schema + migrations
│   └── shared/               # Types, validaciones (Zod), constantes
├── .github/workflows/        # CI/CD
└── README.md
```
Nota: Esto es un monorepo gestionado con Turborepo, otra tecnología muy valorada en portfolios.

## 📊 Impacto en tu Portafolio
Este proyecto te permite demostrar competencia en:

| Habilidad | Evidencia |
| :--- | :--- |
| Fullstack Development | Frontend + Backend + Mobile |
| TypeScript | Tipado end-to-end |
| Modern React | Server Components, Suspense, App Router |
| Mobile Development | React Native iOS |
| Database Design | Modelado relacional con Prisma |
| API Design | tRPC type-safe APIs |
| DevOps | CI/CD, automated testing, deployment |
| UI/UX | Design system, responsive, dark mode |
| Testing | Unit + E2E testing |
