import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import EmptyState from '../components/EmptyState'

export default function Dashboard() {
  const { patients, appointments, payments, openModal } = useApp()
  const { currentUser } = useAuth()

  // Simulate active data for the "Mi Día" dashboard
  const todayAppointments = appointments.filter(a => a.status === 'confirmada' || a.status === 'pendiente')
  const pendingFollowUps = patients.filter(p => p.status === 'riesgo_desercion' || p.progress < 40).slice(0, 3)
  const pendingPayments = payments.filter(p => p.status === 'pendiente' || p.status === 'vencido').slice(0, 2)
  const activePatientsCount = patients.filter(p => p.status === 'activo').length

  const [miDiaTasks, setMiDiaTasks] = useState([
    { id: 1, text: 'Revisar evolución de Mariana', done: true },
    { id: 2, text: 'Enviar plan nutricional a Carlos', done: false },
    { id: 3, text: 'Preparar consulta de las 11:00 AM', done: false },
  ])

  const toggleTask = (id: number) => {
    setMiDiaTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header: Mi Día */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', margin: 0, color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: 8 }}>
            Mi Día
            <span style={{ fontSize: 18, color: 'var(--muted-foreground)', fontWeight: 500, fontFamily: 'var(--font-jakarta)' }}>— {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--muted-foreground)' }}>
            ¡Hola, {currentUser?.name || 'Nutrióloga'}! {todayAppointments.length > 0 ? `Tienes ${todayAppointments.length} consultas programadas hoy.` : 'No tienes consultas programadas para hoy.'}
          </p>
        </div>

        {/* Acciones Rápidas (Quick Actions) */}
        <div style={{ display: 'flex', gap: 8, background: 'var(--card)', padding: 6, borderRadius: 10, border: '1px solid var(--border)' }}>
          <button onClick={() => openModal('nuevo-paciente')} style={{ padding: '8px 14px', background: 'transparent', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--foreground)' }}>
            👤 Paciente
          </button>
          <button onClick={() => openModal('nueva-consulta')} style={{ padding: '8px 14px', background: 'transparent', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--foreground)' }}>
            📋 Consulta
          </button>
          <button onClick={() => openModal('nuevo-plan')} style={{ padding: '8px 14px', background: 'transparent', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--foreground)' }}>
            🥗 Plan
          </button>
          <button onClick={() => openModal('nueva-cita')} style={{ padding: '8px 14px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            + Cita
          </button>
        </div>
      </div>

      {patients.length === 0 && (
        <EmptyState
          icon="🌿"
          title="Tu consultorio digital está listo"
          description="Comienza tu flujo de trabajo registrando a tu primer paciente. Desde su expediente podrás agendar citas, realizar consultas y prescribir planes."
          actionLabel="+ Registrar Primer Paciente"
          onAction={() => openModal('nuevo-paciente')}
        />
      )}

      {/* Main Grid: Agenda & Pendientes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>

        {/* Left Column: Agenda del Día */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--foreground)' }}>Agenda de Hoy</h3>
            <span style={{ fontSize: 12, color: 'var(--muted-foreground)', background: 'var(--muted)', padding: '4px 10px', borderRadius: 20 }}>{todayAppointments.length} citas</span>
          </div>
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {todayAppointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--muted-foreground)', fontSize: 13 }}>
                Día libre. No hay consultas agendadas.
              </div>
            ) : (
              todayAppointments.map((app, i) => (
                <div key={app.id} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', position: 'relative' }}>
                  {i !== todayAppointments.length - 1 && <div style={{ position: 'absolute', left: 24, top: 40, bottom: -16, width: 1, background: 'var(--border)' }} />}
                  <div style={{ width: 48, fontSize: 13, fontWeight: 600, color: 'var(--muted-foreground)', textAlign: 'right', paddingTop: 4, fontFamily: 'var(--font-jetbrains)' }}>
                    {app.time}
                  </div>
                  <div style={{ flex: 1, background: 'var(--muted)', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)' }}>{app.patientName}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>{app.type} · {app.durationMin} min</div>
                    </div>
                    <button onClick={() => alert('Abriendo expediente de ' + app.patientName)} style={{ padding: '6px 12px', background: '#fff', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--foreground)' }}>
                      Atender
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Pendientes y Alertas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Tareas */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: 'var(--foreground)' }}>Tareas rápidas</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {miDiaTasks.map(task => (
                <label key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} />
                  <span style={{ fontSize: 13, textDecoration: task.done ? 'line-through' : 'none', color: task.done ? 'var(--muted-foreground)' : 'var(--foreground)' }}>
                    {task.text}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Pacientes en Riesgo / Seguimiento */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--foreground)' }}>Requieren Atención</h3>
              <span style={{ fontSize: 11, background: '#FDECEA', color: '#E85C45', padding: '3px 8px', borderRadius: 12, fontWeight: 600 }}>{pendingFollowUps.length} pacientes</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pendingFollowUps.length === 0 ? (
                <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Todos tus pacientes van al corriente.</div>
              ) : (
                pendingFollowUps.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                    <span style={{ fontWeight: 500, color: 'var(--foreground)' }}>{p.name}</span>
                    <span style={{ color: 'var(--muted-foreground)' }}>Progreso: {p.progress}%</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Finanzas Rápidas */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Pacientes Activos</div>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-jetbrains)' }}>{activePatientsCount}</div>
            </div>
            <div style={{ height: 30, width: 1, background: 'var(--border)' }} />
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Pagos Pendientes</div>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-jetbrains)', color: pendingPayments.length > 0 ? '#D4882A' : 'var(--foreground)' }}>
                {pendingPayments.length}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
