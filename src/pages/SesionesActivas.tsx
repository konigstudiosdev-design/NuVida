import { useAuth } from '../context/AuthContext'

export default function SesionesActivas() {
  const { activeSessions, revokeSession, revokeAllOtherSessions } = useAuth()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Gestión de Sesiones Activas</h2>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>Monitorea y revoca accesos en diferentes dispositivos asociados a tu cuenta.</p>
        </div>

        <button
          onClick={revokeAllOtherSessions}
          style={{ padding: '8px 16px', background: '#FDECEA', color: '#E85C45', border: '1px solid #F5C6CB', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}
        >
          🚫 Cerrar Sesión en Todos los Demás Dispositivos
        </button>
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontSize: 14, fontWeight: 700, color: 'var(--foreground)' }}>
          Dispositivos Conectados ({activeSessions.length})
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {activeSessions.map(sess => (
            <div
              key={sess.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid var(--border)',
                background: sess.isCurrent ? '#E8F5EE' : 'transparent',
              }}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ fontSize: 24 }}>{sess.device.includes('iPhone') ? '📱' : '💻'}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)' }}>
                    {sess.device} {sess.isCurrent && <span style={{ color: 'var(--accent)', fontSize: 12 }}>(Este dispositivo)</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>
                    {sess.platform} · {sess.location} · {sess.lastAccess}
                  </div>
                </div>
              </div>

              {!sess.isCurrent && (
                <button
                  onClick={() => revokeSession(sess.id)}
                  style={{ padding: '6px 12px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#E85C45' }}
                >
                  Cerrar Sesión
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
