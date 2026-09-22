import type { PageId } from '../App'

interface BottomNavProps {
  currentPage: PageId
  onNavigate: (page: PageId) => void
  openModal: (modal: any) => void
}

export default function BottomNav({ currentPage, onNavigate, openModal }: BottomNavProps) {
  const navItems: { id: PageId; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Inicio', icon: '📊' },
    { id: 'pacientes', label: 'Pacientes', icon: '👤' },
    { id: 'agenda', label: 'Agenda', icon: '🗓️' },
    { id: 'consultas', label: 'Consultas', icon: '📋' },
    { id: 'portal-paciente', label: 'Portal', icon: '📱' },
  ]

  return (
    <nav
      style={{
        display: 'none', // Shown on mobile viewports via media query or flex overlay
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9000,
        background: 'var(--card)',
        borderTop: '1px solid var(--border)',
        padding: '6px 12px 10px',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: '0 -4px 15px rgba(0,0,0,0.06)',
      }}
      className="mobile-bottom-nav"
    >
      {navItems.map(item => {
        const isActive = currentPage === item.id
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              border: 'none',
              background: 'transparent',
              color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
              fontSize: 11,
              fontWeight: isActive ? 700 : 500,
              fontFamily: 'var(--font-jakarta)',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            {item.label}
          </button>
        )
      })}
      <button
        onClick={() => openModal('nueva-consulta')}
        style={{
          width: 42,
          height: 42,
          borderRadius: '50%',
          background: 'var(--accent)',
          color: '#fff',
          border: 'none',
          fontSize: 20,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(40,132,90,0.3)',
        }}
        title="Nueva Consulta"
      >
        +
      </button>
    </nav>
  )
}
