import { useState } from 'react'
import { useApp } from '../context/AppContext'
import EmptyState from '../components/EmptyState'

export default function Antropometria() {
  const { anthropometry, patients, openModal } = useApp()
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(patients[0]?.id || null)

  if (anthropometry.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Evaluación Antropométrica</h2>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>Control de composición corporal, perímetros, pliegues e IMC.</p>
          </div>
          <button
            onClick={() => openModal('capturar-antropometria')}
            style={{ padding: '9px 18px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}
          >
            + Registrar Medición
          </button>
        </div>

        <EmptyState
          icon="📏"
          title="No hay evaluaciones antropométricas registradas"
          description="Registra la primera medición corporal (peso, talla, masa grasa, músculo, perímetros) para visualizar la evolución del paciente."
          actionLabel="+ Registrar Primera Medición"
          onAction={() => openModal('capturar-antropometria')}
        />
      </div>
    )
  }

  const filteredEntries = selectedPatientId ? anthropometry.filter(a => a.patientId === selectedPatientId) : anthropometry
  const latest = filteredEntries[0] || anthropometry[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--muted-foreground)', fontWeight: 600 }}>Filtrar por paciente:</span>
          <select
            value={selectedPatientId || ''}
            onChange={e => setSelectedPatientId(e.target.value ? Number(e.target.value) : null)}
            style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card)', fontSize: 13.5, color: 'var(--foreground)', fontWeight: 600 }}
          >
            <option value="">Todos los pacientes</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <button
          onClick={() => openModal('capturar-antropometria')}
          style={{ padding: '9px 18px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}
        >
          + Capturar Medición
        </button>
      </div>

      {/* Main Anthropometry Card */}
      {latest && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>
                Medición del {latest.date}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--muted-foreground)', marginTop: 2 }}>
                Evaluación InBody & Perímetros
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-jetbrains)', color: 'var(--accent)' }}>
              {latest.pesoKg} kg
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[
              { label: 'IMC', val: latest.imc.toString() },
              { label: 'Grasa corporal', val: `${latest.grasaPct}%` },
              { label: 'Masa Muscular', val: `${latest.masaMuscularKg} kg` },
              { label: 'Cintura', val: `${latest.cinturaCm} cm` },
            ].map(m => (
              <div key={m.label} style={{ padding: 14, background: 'var(--muted)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600, textTransform: 'uppercase' }}>{m.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-jetbrains)', color: 'var(--foreground)', marginTop: 4 }}>{m.val}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
