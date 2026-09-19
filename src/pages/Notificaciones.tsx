import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Notificaciones() {
  const { notifications, markNotificationRead } = useApp()
  const [filter, setFilter] = useState<'todas' | 'no_leidas'>('todas')

  const filtered = filter === 'todas' ? notifications : notifications.filter(n => !n.read)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Centro de Notificaciones y Recordatorios</h2>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>Monitorea alertas del sistema, avisos de citas por WhatsApp y avisos de pago.</p>
        </div>

        <div style={{ display: 'flex', gap: 8, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 4 }}>
          <button
            onClick={() => setFilter('todas')}
            style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: filter === 'todas' ? 'var(--primary)' : 'transparent', color: filter === 'todas' ? '#fff' : 'var(--muted-foreground)', fontSize: 12.5, cursor: 'pointer' }}
          >
            Todas ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('no_leidas')}
            style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: filter === 'no_leidas' ? 'var(--primary)' : 'transparent', color: filter === 'no_leidas' ? '#fff' : 'var(--muted-foreground)', fontSize: 12.5, cursor: 'pointer' }}
          >
            No leídas ({notifications.filter(n => !n.read).length})
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 14 }}>
            🔔 No tienes notificaciones pendientes.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map(n => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border)',
                  background: n.read ? 'transparent' : '#E8F5EE',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                    {n.type === 'cita' ? '📅' : n.type === 'pago' ? '💳' : n.type === 'ia_alert' ? '🤖' : '🔔'}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)' }}>{n.title}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--muted-foreground)', marginTop: 2 }}>{n.message}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>{n.time}</span>
                  <span style={{ fontSize: 10.5, padding: '3px 8px', borderRadius: 12, background: 'var(--muted)', fontWeight: 600, color: 'var(--foreground)' }}>
                    Canal: {n.channel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
