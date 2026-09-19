import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import EmptyState from '../components/EmptyState'

export default function Dashboard() {
  const { patients, appointments, payments, notifications, openModal } = useApp()
  const { currentUser } = useAuth()

  const [miDiaTasks, setMiDiaTasks] = useState([
    { id: 1, text: 'Configurar perfil profesional y cédula', done: true },
    { id: 2, text: 'Registrar primer paciente en el consultorio', done: false },
    { id: 3, text: 'Diseñar plantilla de plan alimenticio', done: false },
    { id: 4, text: 'Agendar cita en el calendario', done: false },
  ])

  const activePatients = patients.filter(p => p.status === 'activo').length
  const pendingPaymentsTotal = payments.filter(p => p.status === 'pendiente' || p.status === 'vencido').reduce((acc, p) => acc + p.amount, 0)

  const toggleTask = (id: number) => {
    setMiDiaTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Greeting Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', margin: 0, color: 'var(--foreground)' }}>
            Buenos días, {currentUser?.name || 'Nutrióloga'}{' '}
            <span style={{ fontFamily: 'var(--font-instrument)', fontStyle: 'italic', color: 'var(--accent)' }}>
              👋
            </span>
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--muted-foreground)' }}>
            {patients.length === 0
              ? 'Bienvenida a NuVida. Comienza registrando a tu primer paciente para activar el seguimiento.'
              : `Tienes ${appointments.length} consultas programadas hoy.`}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => openModal('nuevo-paciente')}
            style={{ padding: '8px 16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}
          >
            + Nuevo paciente
          </button>
          <button
            onClick={() => openModal('nueva-consulta')}
            style={{ padding: '8px 18px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}
          >
            + Registrar consulta
          </button>
        </div>
      </div>

      {patients.length === 0 && (
        <EmptyState
          icon="🌿"
          title="Tu consultorio NuVida está listo"
          description="Crea el expediente de tu primer paciente para asignar dietas, registrar consultas, evaluar antropometría y dar seguimiento."
          actionLabel="+ Registrar Primer Paciente"
          onAction={() => openModal('nuevo-paciente')}
        />
      )}

      {/* Primary KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Consultas de hoy', value: appointments.length.toString(), sub: 'Programadas', color: 'var(--primary)' },
          { label: 'Pacientes activos', value: activePatients.toString(), sub: `${patients.length} registrados`, color: 'var(--accent)' },
          { label: 'Pagos pendientes', value: `$${pendingPaymentsTotal.toLocaleString()} MXN`, sub: 'En cobro', color: '#D4882A' },
          { label: 'Ingresos acumulados', value: '$0 MXN', sub: 'Mes actual', color: 'var(--foreground)' },
        ].map(k => (
          <div key={k.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: 11.5, color: 'var(--muted-foreground)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: k.color, fontFamily: 'var(--font-jetbrains)', lineHeight: 1, marginBottom: 6 }}>{k.value}</div>
            <div style={{ fontSize: 11.5, color: 'var(--muted-foreground)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Sección "MI DÍA" */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>☀️</span>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--foreground)' }}>Mi Día — Pendientes Prioritarios</h3>
          </div>
          <span style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
            {miDiaTasks.filter(t => t.done).length} de {miDiaTasks.length} completados
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {miDiaTasks.map(task => (
            <label
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                background: task.done ? 'var(--muted)' : 'var(--background)',
                borderRadius: 8,
                border: '1px solid var(--border)',
                cursor: 'pointer',
                opacity: task.done ? 0.6 : 1,
              }}
            >
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
                style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
              />
              <span style={{ fontSize: 13, textDecoration: task.done ? 'line-through' : 'none', color: 'var(--foreground)', fontWeight: 500 }}>
                {task.text}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
