import type { PageId } from '../App'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS: { id: PageId; label: string; icon: string; section?: string }[] = [
  { id: 'dashboard', label: 'Dashboard & Mi Día', icon: '📊', section: '' },

  { id: 'pacientes', label: 'Pacientes & Lista', icon: '👤', section: 'Clínica' },
  { id: 'perfil-paciente', label: 'Perfil del Paciente 360°', icon: '📇', section: 'Clínica' },
  { id: 'consultas', label: 'Consultas Clínicas', icon: '📋', section: 'Clínica' },
  { id: 'antropometria', label: 'Antropometría', icon: '📏', section: 'Clínica' },
  { id: 'planes', label: 'Planes Alimenticios', icon: '🥗', section: 'Clínica' },
  { id: 'editor-semanal', label: 'Editor Semanal', icon: '📅', section: 'Clínica' },
  { id: 'lista-compras', label: 'Lista de Compras', icon: '🛒', section: 'Clínica' },
  { id: 'alimentos', label: 'Alimentos y Recetas', icon: '🍎', section: 'Clínica' },

  { id: 'centro-seguimiento', label: 'Centro de Seguimiento', icon: '🩺', section: 'Análisis & IA' },
  { id: 'seguimiento', label: 'Fotos Antes / Después', icon: '📈', section: 'Análisis & IA' },
  { id: 'asistente-ia', label: 'NuVida AI Copilot', icon: '🤖', section: 'Análisis & IA' },
  { id: 'reportes', label: 'Reportes y Analítica', icon: '📊', section: 'Análisis & IA' },

  { id: 'agenda', label: 'Agenda y Citas', icon: '🗓️', section: 'Gestión' },
  { id: 'notificaciones', label: 'Notificaciones', icon: '🔔', section: 'Gestión' },
  { id: 'pagos', label: 'Pagos y Facturación', icon: '💳', section: 'Gestión' },

  { id: 'portal-paciente', label: 'Portal del Paciente', icon: '📱', section: 'Experiencias' },

  { id: 'usuarios-permisos', label: 'Usuarios y Roles', icon: '👥', section: 'Administración SaaS' },
  { id: 'registro-actividad', label: 'Registro de Actividad', icon: '📜', section: 'Administración SaaS' },
  { id: 'centro-piloto', label: 'Panel Piloto 1.0', icon: '🧪', section: 'Administración SaaS' },
  { id: 'preparacion-produccion', label: 'Release Candidate Status', icon: '🟢', section: 'Administración SaaS' },
  { id: 'suscripcion-billing', label: 'Suscripción & Plan', icon: '⚡', section: 'Administración SaaS' },
  { id: 'configuracion', label: 'Configuración', icon: '⚙️', section: 'Administración SaaS' },
]

interface SidebarProps {
  currentPage: PageId
  onNavigate: (page: PageId) => void
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ currentPage, onNavigate, collapsed, onToggle }: SidebarProps) {
  const { organization } = useApp()
  const { currentUser, logout } = useAuth()

  const sections = ['', 'Clínica', 'Análisis & IA', 'Gestión', 'Experiencias', 'Administración SaaS']
  const itemsBySection = sections.map(section => ({
    section,
    items: NAV_ITEMS.filter(item => (item.section ?? '') === section),
  })).filter(g => g.items.length > 0)

  return (
    <aside
      style={{
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
        width: collapsed ? 64 : 240,
        minWidth: collapsed ? 64 : 240,
        transition: 'width 0.22s ease, min-width 0.22s ease',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: collapsed ? '20px 0' : '16px 20px',
          borderBottom: '1px solid var(--sidebar-border)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          minHeight: 64,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <img
          src="/nuvida-logo.png"
          alt="NuVida Logo"
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            objectFit: 'contain',
            flexShrink: 0,
          }}
        />
        {!collapsed && (
          <div>
            <div style={{ color: '#fff', fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>
              NuVida
            </div>
            <div style={{ color: 'var(--sidebar-text)', fontSize: 10, marginTop: 3, letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>● {organization.planTier}</span> · Consultorio
            </div>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {itemsBySection.map(({ section, items }) => (
          <div key={section} style={{ marginBottom: 6 }}>
            {section && !collapsed && (
              <div
                style={{
                  color: 'var(--sidebar-text)',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '12px 20px 4px',
                  opacity: 0.5,
                }}
              >
                {section}
              </div>
            )}
            {items.map(item => {
              const isActive = currentPage === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: collapsed ? '9px 0' : '8px 20px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    background: isActive ? 'var(--sidebar-active)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: isActive ? 'var(--sidebar-text-active)' : 'var(--sidebar-text)',
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    fontFamily: 'var(--font-jakarta)',
                    transition: 'all 0.15s ease',
                    borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                    whiteSpace: 'nowrap',
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
                  {!collapsed && item.label}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer Profile & Logout */}
      <div style={{ borderTop: '1px solid var(--sidebar-border)', padding: collapsed ? '12px 0' : '12px 16px' }}>
        {!collapsed && currentUser && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {currentUser.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: '#fff', fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser.name}</div>
                <div style={{ color: 'var(--sidebar-text)', fontSize: 11, textTransform: 'capitalize' }}>{currentUser.role}</div>
              </div>
            </div>

            <button
              onClick={() => logout()}
              title="Cerrar sesión"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E85C45', fontSize: 14, padding: 4 }}
            >
              🚪
            </button>
          </div>
        )}
        <button
          onClick={onToggle}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '7px',
            background: 'transparent',
            border: '1px solid var(--sidebar-border)',
            borderRadius: 6,
            cursor: 'pointer',
            color: 'var(--sidebar-text)',
            transition: 'all 0.15s ease',
          }}
        >
          <span style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.22s ease' }}>◀</span>
          {!collapsed && <span style={{ marginLeft: 8, fontSize: 12 }}>Colapsar Menú</span>}
        </button>
      </div>
    </aside>
  )
}
