import { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ErrorBoundary } from './components/ErrorBoundary'

import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Modals from './components/Modals'

import OfflineBanner from './components/OfflineBanner'
import PwaUpdateBanner from './components/PwaUpdateBanner'
import SplashScreen from './components/SplashScreen'
import BottomNav from './components/BottomNav'
import CambiarContrasenaModal from './components/CambiarContrasenaModal'
import OnboardingNutriologoModal from './components/OnboardingNutriologoModal'
import ChecklistPrimerUso from './components/ChecklistPrimerUso'

import LoginView from './pages/LoginView'
import RegistroNutriologo from './pages/RegistroNutriologo'

import Dashboard from './pages/Dashboard'
import Pacientes from './pages/Pacientes'
import PerfilPaciente from './pages/PerfilPaciente'
import Consultas from './pages/Consultas'
import Antropometria from './pages/Antropometria'
import Planes from './pages/Planes'
import EditorSemanal from './pages/EditorSemanal'
import ListaCompras from './pages/ListaCompras'
import Alimentos from './pages/Alimentos'
import CentroSeguimiento from './pages/CentroSeguimiento'
import Seguimiento from './pages/Seguimiento'
import AsistenteIA from './pages/AsistenteIA'
import Agenda from './pages/Agenda'
import Notificaciones from './pages/Notificaciones'
import Pagos from './pages/Pagos'
import Reportes from './pages/Reportes'
import PortalPaciente from './pages/PortalPaciente'
import UsuariosPermisos from './pages/UsuariosPermisos'
import RegistroActividad from './pages/RegistroActividad'
import SesionesActivas from './pages/SesionesActivas'
import ProductionReadiness from './pages/ProductionReadiness'
import CentroPiloto from './pages/CentroPiloto'
import SuscripcionBilling from './pages/SuscripcionBilling'
import Configuracion from './pages/Configuracion'

export type PageId =
  | 'dashboard'
  | 'pacientes'
  | 'perfil-paciente'
  | 'consultas'
  | 'antropometria'
  | 'planes'
  | 'editor-semanal'
  | 'lista-compras'
  | 'alimentos'
  | 'centro-seguimiento'
  | 'seguimiento'
  | 'asistente-ia'
  | 'agenda'
  | 'notificaciones'
  | 'pagos'
  | 'reportes'
  | 'portal-paciente'
  | 'usuarios-permisos'
  | 'registro-actividad'
  | 'sesiones-activas'
  | 'centro-piloto'
  | 'preparacion-produccion'
  | 'suscripcion-billing'
  | 'configuracion'

const PAGE_TITLES: Record<PageId, string> = {
  dashboard: 'Dashboard & Mi Día',
  pacientes: 'Pacientes y Lista de Expedientes',
  'perfil-paciente': 'Perfil del Paciente 360°',
  consultas: 'Consultas Clínicas',
  antropometria: 'Evaluación Antropométrica',
  planes: 'Planes Alimenticios y Nutrición',
  'editor-semanal': 'Editor Visual de Menú Semanal',
  'lista-compras': 'Lista de Compras Generada',
  alimentos: 'Base de Alimentos y Recetas',
  'centro-seguimiento': 'Centro de Seguimiento & Cuidado al Paciente',
  seguimiento: 'Seguimiento y Fotografías Antes / Después',
  'asistente-ia': 'NuVida AI — Copiloto Nutricional',
  agenda: 'Agenda de Citas',
  notificaciones: 'Centro de Notificaciones',
  pagos: 'Finanzas, Pagos y Cobros',
  reportes: 'Reportes y Analítica SaaS',
  'portal-paciente': 'Portal del Paciente (Experiencia Mobile)',
  'usuarios-permisos': 'Usuarios, Roles y Permisos RBAC',
  'registro-actividad': 'Registro de Actividad & Audit Log',
  'sesiones-activas': 'Gestión de Sesiones Activas',
  'centro-piloto': 'Panel de Validación NuVida Pilot 1.0',
  'preparacion-produccion': 'Release Candidate Readiness Status',
  'suscripcion-billing': 'Suscripción SaaS y Facturación',
  configuracion: 'Configuración del Consultorio',
}

function MainApp() {
  const { openModal } = useApp()
  const { isAuthenticated, currentUser } = useAuth()

  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login')
  const [page, setPage] = useState<PageId>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(true)

  // 1. If not authenticated, render Login / Register view
  if (!isAuthenticated) {
    if (authScreen === 'register') {
      return <RegistroNutriologo onSuccess={() => { setAuthScreen('login') }} onGoToLogin={() => setAuthScreen('login')} />
    }
    return <LoginView onSuccess={() => { setPage('dashboard'); setShowOnboarding(true) }} onGoToRegister={() => setAuthScreen('register')} />
  }

  // 2. Patient Role Restriction (Redirects straight to Patient Portal)
  if (currentUser?.role === 'paciente') {
    return (
      <div style={{ background: '#F7F6F3', minHeight: '100vh', padding: '20px 10px' }}>
        <PortalPaciente />
      </div>
    )
  }

  // 3. Route Guard for Recepcionista (Restricted from Clinical / Plan Editor)
  const isRecepcionistaRestricted = currentUser?.role === 'recepcionista' && ['consultas', 'antropometria', 'planes', 'editor-semanal', 'asistente-ia'].includes(page)

  const renderPage = () => {
    if (isRecepcionistaRestricted) {
      return (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Acceso Restringido</h2>
          <p style={{ margin: '6px 0 16px', fontSize: 13, color: 'var(--muted-foreground)' }}>
            Tu rol de Recepcionista no tiene permisos para acceder a expedientes clínicos o prescripción de planes.
          </p>
          <button onClick={() => setPage('agenda')} style={{ padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
            Ir a Agenda y Citas
          </button>
        </div>
      )
    }

    switch (page) {
      case 'dashboard':
        return (
          <>
            <ChecklistPrimerUso onNavigate={setPage} />
            <Dashboard />
          </>
        )
      case 'pacientes':
        return <Pacientes />
      case 'perfil-paciente':
        return <PerfilPaciente />
      case 'consultas':
        return <Consultas />
      case 'antropometria':
        return <Antropometria />
      case 'planes':
        return <Planes />
      case 'editor-semanal':
        return <EditorSemanal />
      case 'lista-compras':
        return <ListaCompras />
      case 'alimentos':
        return <Alimentos />
      case 'centro-seguimiento':
        return <CentroSeguimiento />
      case 'seguimiento':
        return <Seguimiento />
      case 'asistente-ia':
        return <AsistenteIA />
      case 'agenda':
        return <Agenda />
      case 'notificaciones':
        return <Notificaciones />
      case 'pagos':
        return <Pagos />
      case 'reportes':
        return <Reportes />
      case 'portal-paciente':
        return <PortalPaciente />
      case 'usuarios-permisos':
        return <UsuariosPermisos />
      case 'registro-actividad':
        return <RegistroActividad />
      case 'sesiones-activas':
        return <SesionesActivas />
      case 'centro-piloto':
        return <CentroPiloto />
      case 'preparacion-produccion':
        return <ProductionReadiness />
      case 'suscripcion-billing':
        return <SuscripcionBilling />
      case 'configuracion':
        return <Configuracion />
      default:
        return <Dashboard />
    }
  }

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      {currentUser?.isFirstLogin && <CambiarContrasenaModal onDone={() => {}} />}
      {currentUser?.role === 'nutriologo' && showOnboarding && (
        <OnboardingNutriologoModal onDone={() => setShowOnboarding(false)} />
      )}
      <OfflineBanner />
      <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
        <Sidebar
          currentPage={page}
          onNavigate={setPage}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
        />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <TopBar title={PAGE_TITLES[page]} page={page} onNavigate={setPage} />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-[1400px] mx-auto px-6 py-6">
              {renderPage()}
            </div>
          </main>
        </div>
        <BottomNav currentPage={page} onNavigate={setPage} openModal={openModal} />
        <Modals onNavigate={setPage} />
        <PwaUpdateBanner />
      </div>
    </>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <MainApp />
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
