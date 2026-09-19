import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function CentroSeguimiento() {
  const { patients, openModal } = useApp()
  const [filter, setFilter] = useState<'todos' | 'requiere' | 'proxima' | 'al_dia'>('todos')

  // Patient Tracking Status Classification
  const categorized = patients.map(p => {
    let careStatus: 'requiere' | 'proxima' | 'al_dia' = 'al_dia'
    let reason = 'Seguimiento y plan activo al día'

    if (p.status === 'riesgo_desercion' || p.planExpiringSoon || (p.pendingPaymentAmount && p.pendingPaymentAmount > 0)) {
      careStatus = 'requiere'
      reason = p.planExpiringSoon ? 'Plan próximo a vencer / vencido' : p.pendingPaymentAmount ? 'Saldo o consulta pendiente' : 'Sin actividad en últimos 14 días (Riesgo deserción)'
    } else if (p.sessions < 4) {
      careStatus = 'proxima'
      reason = 'Paciente en fase de adaptación inicial'
    }

    return { ...p, careStatus, reason }
  })

  const filtered = filter === 'todos' ? categorized : categorized.filter(p => p.careStatus === filter)

  const requiereCount = categorized.filter(p => p.careStatus === 'requiere').length
  const proximaCount = categorized.filter(p => p.careStatus === 'proxima').length
  const alDiaCount = categorized.filter(p => p.careStatus === 'al_dia').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Centro de Seguimiento & Cuidado al Paciente</h2>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>Detección automática de pacientes que requieren intervención o ajustes de plan.</p>
        </div>

        <button
          onClick={() => openModal('asistente-ia')}
          style={{ padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          🤖 Copiloto IA — Analizar Casos
        </button>
      </div>

      {/* Triage Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        <div
          onClick={() => setFilter('requiere')}
          style={{
            background: filter === 'requiere' ? '#FDECEA' : 'var(--card)',
            border: `2px solid ${filter === 'requiere' ? '#E85C45' : 'var(--border)'}`,
            borderRadius: 12,
            padding: '18px 20px',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: '#E85C45', textTransform: 'uppercase' }}>🔴 Requiere Atención ({requiereCount})</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--foreground)', fontFamily: 'var(--font-jetbrains)', margin: '4px 0' }}>{requiereCount} pacientes</div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Planes vencidos, pagos pendientes o riesgo deserción</div>
        </div>

        <div
          onClick={() => setFilter('proxima')}
          style={{
            background: filter === 'proxima' ? '#FEF3E2' : 'var(--card)',
            border: `2px solid ${filter === 'proxima' ? '#D4882A' : 'var(--border)'}`,
            borderRadius: 12,
            padding: '18px 20px',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: '#D4882A', textTransform: 'uppercase' }}>🟡 Atención Próxima ({proximaCount})</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--foreground)', fontFamily: 'var(--font-jetbrains)', margin: '4px 0' }}>{proximaCount} pacientes</div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Consultas cercanas o fase de inicio</div>
        </div>

        <div
          onClick={() => setFilter('al_dia')}
          style={{
            background: filter === 'al_dia' ? '#E8F5EE' : 'var(--card)',
            border: `2px solid ${filter === 'al_dia' ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 12,
            padding: '18px 20px',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>🟢 Al Día ({alDiaCount})</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--foreground)', fontFamily: 'var(--font-jetbrains)', margin: '4px 0' }}>{alDiaCount} pacientes</div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Apego constante y evolución positiva</div>
        </div>
      </div>

      {/* Patient Care Triage List */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontSize: 15, fontWeight: 700, color: 'var(--foreground)' }}>
          Pacientes Monitoreados ({filtered.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filtered.map(p => (
            <div
              key={p.id}
              onClick={() => openModal('expediente', { patientId: p.id })}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'background 0.12s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--muted)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <img src={p.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt={p.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)' }}>{p.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted-foreground)', marginTop: 2 }}>
                    Objetivo: {p.goal} · Última consulta: {p.lastConsult}
                  </div>
                  <div style={{ fontSize: 12, color: p.careStatus === 'requiere' ? '#E85C45' : p.careStatus === 'proxima' ? '#D4882A' : 'var(--accent)', fontWeight: 600, marginTop: 4 }}>
                    • {p.reason}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-jetbrains)', fontWeight: 700, color: 'var(--foreground)' }}>
                  {p.progress}% avance
                </span>
                <button
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    background: 'var(--card)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Abrir Expediente
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
