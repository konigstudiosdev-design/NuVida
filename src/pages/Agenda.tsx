import { useState } from 'react'
import { useApp } from '../context/AppContext'
import EmptyState from '../components/EmptyState'

export default function Agenda() {
  const { appointments, openModal, updateAppointmentStatus } = useApp()
  const [filterDate, setFilterDate] = useState('2026-09-19')

  if (appointments.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Agenda de Citas</h2>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>Gestión de citas, confirmaciones y canal de WhatsApp.</p>
          </div>
          <button
            onClick={() => openModal('nueva-cita')}
            style={{ padding: '9px 18px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}
          >
            + Nueva Cita
          </button>
        </div>

        <EmptyState
          icon="🗓️"
          title="No hay citas agendadas aún"
          description="Agenda la primera cita de consulta para enviar recordatorios por WhatsApp y sincronizar con Google Calendar."
          actionLabel="+ Agendar Primera Cita"
          onAction={() => openModal('nueva-cita')}
        />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, color: 'var(--muted-foreground)', fontWeight: 600 }}>
          {appointments.length} citas registradas
        </div>
        <button
          onClick={() => openModal('nueva-cita')}
          style={{ padding: '9px 18px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}
        >
          + Nueva Cita
        </button>
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
              {['Hora / Fecha', 'Paciente', 'Tipo de Consulta', 'Estado', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {appointments.map(app => (
              <tr key={app.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 16px', fontSize: 13.5, fontWeight: 700, fontFamily: 'var(--font-jetbrains)', color: 'var(--foreground)' }}>
                  {app.time} h · {app.date}
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>
                  {app.patientName}
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--muted-foreground)' }}>
                  {app.type}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: 11.5, padding: '3px 10px', borderRadius: 20, background: '#E8F5EE', color: 'var(--accent)', fontWeight: 700, textTransform: 'capitalize' }}>
                    {app.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <button onClick={() => updateAppointmentStatus(app.id, 'asistio')} style={{ padding: '5px 10px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
                    ✓ Confirmar Asistencia
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
