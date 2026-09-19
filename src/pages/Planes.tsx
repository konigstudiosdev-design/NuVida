import { useState } from 'react'
import { useApp } from '../context/AppContext'
import EmptyState from '../components/EmptyState'

export default function Planes() {
  const { plans, patients, openModal } = useApp()
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(plans[0]?.id || null)

  if (plans.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Planes Alimenticios y Nutrición</h2>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>Prescripción dietética, distribución de macros y porciones SMAE.</p>
          </div>
          <button
            onClick={() => openModal('nuevo-plan')}
            style={{ padding: '9px 18px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}
          >
            + Crear Plan
          </button>
        </div>

        <EmptyState
          icon="🥗"
          title="No hay planes alimenticios creados aún"
          description="Diseña el primer plan nutricional calculando calorías, macronutrientes y distribución de menú semanal para tus pacientes."
          actionLabel="+ Diseñar Primer Plan"
          onAction={() => openModal('nuevo-plan')}
        />
      </div>
    )
  }

  const activePlan = plans.find(p => p.id === selectedPlanId) || plans[0]

  return (
    <div style={{ display: 'flex', gap: 20, height: 'calc(100vh - 120px)', minHeight: 0 }}>
      {/* Plans Sidebar */}
      <div style={{ width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12.5, color: 'var(--muted-foreground)', fontWeight: 600 }}>{plans.length} planes registrados</div>
          <button onClick={() => openModal('nuevo-plan')} style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
            + Nuevo Plan
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
          {plans.map(p => (
            <div
              key={p.id}
              onClick={() => setSelectedPlanId(p.id)}
              style={{
                padding: 16,
                borderRadius: 10,
                background: activePlan?.id === p.id ? 'var(--primary)' : 'var(--card)',
                color: activePlan?.id === p.id ? '#FFF' : 'var(--foreground)',
                border: `1px solid ${activePlan?.id === p.id ? 'var(--primary)' : 'var(--border)'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{p.patientName} · {p.kcal} kcal</div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Detail */}
      {activePlan && (
        <div style={{ flex: 1, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
            <div>
              <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#E8F5EE', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase' }}>
                {activePlan.status}
              </span>
              <h2 style={{ margin: '6px 0 2px', fontSize: 22, fontWeight: 700, color: 'var(--foreground)' }}>{activePlan.name}</h2>
              <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Paciente: {activePlan.patientName} · Válido del {activePlan.since} al {activePlan.until}</div>
            </div>

            <button
              onClick={() => openModal('pdf-preview', { plan: activePlan })}
              style={{ padding: '8px 18px', background: 'var(--primary)', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              🖨️ Exportar PDF
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <div style={{ padding: 16, background: 'var(--muted)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600 }}>ENERGÍA TOTAL</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-jetbrains)', color: 'var(--foreground)', marginTop: 4 }}>{activePlan.kcal} kcal</div>
            </div>
            <div style={{ padding: 16, background: 'var(--muted)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600 }}>PROTEÍNAS</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-jetbrains)', color: 'var(--accent)', marginTop: 4 }}>{activePlan.macros.p}g</div>
            </div>
            <div style={{ padding: 16, background: 'var(--muted)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600 }}>CARBOHIDRATOS</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-jetbrains)', color: 'var(--foreground)', marginTop: 4 }}>{activePlan.macros.c}g</div>
            </div>
            <div style={{ padding: 16, background: 'var(--muted)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600 }}>GRASAS</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-jetbrains)', color: 'var(--foreground)', marginTop: 4 }}>{activePlan.macros.g}g</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
