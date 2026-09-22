import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

export default function ProductionReadiness() {
  const { organization } = useApp()
  const { currentUser } = useAuth()

  const checklist = [
    { name: 'Firebase Authentication (Google OAuth, Email, Phone)', status: 'ready', desc: 'Firebase Auth activo en nuvida-8f975' },
    { name: 'Base de Datos Firestore & Isolation Multi-Tenant', status: 'ready', desc: 'Reglas firestore.rules aplicadas con validación organizationId' },
    { name: 'Reglas de Seguridad Firebase Storage', status: 'ready', desc: 'Acceso privado restringido a fotos y PDFs clínicos' },
    { name: 'Arquitectura PWA, Offline & Outbox Queue', status: 'ready', desc: 'Service Worker + IndexedDB + Cola de Sincronización' },
    { name: 'App de Escritorio Nativa (Electron)', status: 'ready', desc: 'main.cjs compilado con rutas relativas ./assets' },
    { name: 'Integración WhatsApp Business API', status: 'external', desc: 'Ruta Cloud Function lista (requiere Meta API Token)' },
    { name: 'Dominio de Producción HTTPS (nuvida.app)', status: 'external', desc: 'Requiere apuntar registros DNS A/CNAME' },
    { name: 'Resguardos & Copias de Seguridad (Backups)', status: 'ready', desc: 'Exportación periódica en JSON / Firestore Backups' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Banner */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#E8F5EE', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Release Candidate Status
          </span>
          <h2 style={{ margin: '6px 0 2px', fontSize: 22, fontWeight: 700, color: 'var(--foreground)' }}>
            Estado de Preparación para Producción
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--muted-foreground)' }}>
            Organización Activa: {organization.name} · Administrador: {currentUser?.name}
          </p>
        </div>

        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
          🟢 RELEASE CANDIDATE 1.0
        </div>
      </div>

      {/* Checklist Grid */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontSize: 15, fontWeight: 700, color: 'var(--foreground)' }}>
          Auditoría de Requisitos para Despliegue Real
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {checklist.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: idx < checklist.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--foreground)' }}>{item.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>{item.desc}</div>
              </div>

              <span
                style={{
                  fontSize: 11.5,
                  padding: '4px 12px',
                  borderRadius: 20,
                  background: item.status === 'ready' ? '#E8F5EE' : '#FEF3E2',
                  color: item.status === 'ready' ? 'var(--accent)' : '#D4882A',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                {item.status === 'ready' ? '✓ Listo / Validado' : '🟡 Configuración Externa'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
