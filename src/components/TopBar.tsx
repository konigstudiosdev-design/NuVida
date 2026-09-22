import type { PageId } from '../App'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

interface TopBarProps {
  title: string
  page: PageId
  onNavigate: (page: PageId) => void
}

const QUICK_ACTIONS: Record<PageId, { label: string; modal: any } | null> = {
  dashboard: { label: '+ Nueva consulta', modal: 'nueva-consulta' },
  pacientes: { label: '+ Nuevo paciente', modal: 'nuevo-paciente' },
  'perfil-paciente': { label: '+ Nueva consulta', modal: 'nueva-consulta' },
  consultas: { label: '+ Nueva consulta', modal: 'nueva-consulta' },
  antropometria: { label: '+ Registrar medición', modal: 'capturar-antropometria' },
  planes: { label: '+ Crear plan', modal: 'nuevo-plan' },
  'editor-semanal': { label: '🖨️ Exportar PDF', modal: 'pdf-preview' },
  'lista-compras': null,
  alimentos: { label: '+ Agregar alimento', modal: 'nuevo-alimento' },
  'centro-seguimiento': { label: '🤖 Analizar con IA', modal: 'asistente-ia' },
  seguimiento: { label: '🤖 Asistente IA', modal: 'asistente-ia' },
  'asistente-ia': { label: '🤖 Abrir Copiloto', modal: 'asistente-ia' },
  agenda: { label: '+ Nueva cita', modal: 'nueva-cita' },
  notificaciones: null,
  pagos: { label: '+ Registrar cobro', modal: 'registrar-pago' },
  reportes: null,
  'portal-paciente': null,
  'usuarios-permisos': null,
  'registro-actividad': null,
  'centro-piloto': null,
  'sesiones-activas': null,
  'preparacion-produccion': null,
  'suscripcion-billing': { label: '⚡ Upgrade Plan', modal: 'upgrade-plan' },
  configuracion: null,
}

export default function TopBar({ title, page, onNavigate }: TopBarProps) {
  const { openModal, notifications, currentRole, setCurrentRole } = useApp()
  const { currentUser, logout } = useAuth()
  const action = QUICK_ACTIONS[page]
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header
      style={{
        background: 'var(--background)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h1
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--foreground)',
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          {title}
        </h1>

        {/* Discrete Pilot 1.0 Indicator Pill */}
        <span
          onClick={() => onNavigate('centro-piloto')}
          style={{
            fontSize: 10,
            padding: '3px 8px',
            borderRadius: 12,
            background: '#E8F5EE',
            color: 'var(--accent)',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'var(--font-jetbrains)',
            letterSpacing: '0.04em',
            border: '1px solid #C3E6D4',
          }}
          title="NuVida Pilot 1.0 Validation Mode"
        >
          PILOT 1.0
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Role Selector Pill (Nutriólogo, Recepcionista, Paciente) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--muted)', padding: '4px 10px', borderRadius: 20, fontSize: 12 }}>
          <span style={{ color: 'var(--muted-foreground)' }}>Vista:</span>
          <select
            value={currentRole}
            onChange={e => setCurrentRole(e.target.value as any)}
            style={{ border: 'none', background: 'transparent', fontSize: 12, fontWeight: 700, color: 'var(--primary)', cursor: 'pointer', outline: 'none' }}
          >
            <option value="nutriologo">Nutrióloga / Nutriólogo</option>
            <option value="recepcionista">Recepcionista</option>
            <option value="paciente">Interfaz Paciente</option>
          </select>
        </div>

        {/* Search Command Palette Trigger */}
        <div
          onClick={() => openModal('command-palette')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '7px 12px',
            width: 220,
            cursor: 'pointer',
            transition: 'border-color 0.15s ease',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span style={{ fontSize: 13, color: 'var(--muted-foreground)', fontFamily: 'var(--font-jakarta)', flex: 1 }}>
            Buscar paciente o comando...
          </span>
          <kbd
            style={{
              fontSize: 10,
              color: 'var(--muted-foreground)',
              background: 'var(--muted)',
              padding: '2px 5px',
              borderRadius: 4,
              fontFamily: 'var(--font-jetbrains)',
            }}
          >
            ⌘K
          </kbd>
        </div>

        {/* AI Assistant Quick Trigger (Visible for Nutriólogo) */}
        {currentRole === 'nutriologo' && (
          <button
            onClick={() => openModal('asistente-ia')}
            style={{
              padding: '7px 12px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: '#E8F5EE',
              color: 'var(--accent)',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            🤖 Copiloto IA
          </button>
        )}

        {/* Notifications Button */}
        <button
          onClick={() => onNavigate('notificaciones')}
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--muted-foreground)',
            position: 'relative',
          }}
          title="Notificaciones"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#E85C45',
                border: '1.5px solid var(--background)',
              }}
            />
          )}
        </button>

        {/* Logout Button */}
        {currentUser && (
          <button
            onClick={() => logout()}
            style={{
              padding: '7px 12px',
              background: '#FDECEA',
              color: '#E85C45',
              border: '1px solid #F5C6CB',
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-jakarta)',
            }}
          >
            🚪 Cerrar sesión
          </button>
        )}

        {/* Action Button */}
        {action && currentRole !== 'paciente' && (
          <button
            onClick={() => openModal(action.modal)}
            style={{
              padding: '8px 16px',
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'var(--font-jakarta)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'opacity 0.15s ease',
            }}
          >
            {action.label}
          </button>
        )}
      </div>
    </header>
  )
}
