import { useState } from 'react'
import { useApp } from '../context/AppContext'

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const

export default function EditorSemanal() {
  const { plans, openModal } = useApp()
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id || 1)
  const [activeDay, setActiveDay] = useState<typeof DAYS[number]>('Lunes')

  const currentPlan = plans.find(p => p.id === Number(selectedPlanId)) || plans[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Editor Visual de Menú Semanal</h2>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>Planifica y estructura las tomas diarias de Lunes a Domingo.</p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select
            value={selectedPlanId}
            onChange={e => setSelectedPlanId(Number(e.target.value))}
            style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)', outline: 'none' }}
          >
            {plans.map(p => <option key={p.id} value={p.id}>{p.name} ({p.patientName})</option>)}
          </select>

          <button
            onClick={() => alert(`Día ${activeDay} copiado al resto de la semana exitosamente.`)}
            style={{ padding: '8px 14px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}
          >
            📋 Copiar {activeDay} a toda la semana
          </button>

          <button
            onClick={() => openModal('pdf-preview', { plan: currentPlan })}
            style={{ padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}
          >
            🖨️ Exportar Menú PDF
          </button>
        </div>
      </div>

      {/* Days Tabs Bar */}
      <div style={{ display: 'flex', gap: 6, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 6, overflowX: 'auto' }}>
        {DAYS.map(day => {
          const isActive = activeDay === day
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 8,
                border: 'none',
                background: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? '#fff' : 'var(--foreground)',
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                fontFamily: 'var(--font-jakarta)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {day}
            </button>
          )
        })}
      </div>

      {/* Meals Grid for Active Day */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)' }}>Menú del {activeDay}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted-foreground)' }}>Estructura de 5 tomas · Meta diaria: {currentPlan?.kcal || 1450} kcal</div>
          </div>
          <span style={{ fontSize: 12, padding: '4px 10px', background: '#E8F5EE', color: 'var(--accent)', fontWeight: 600, borderRadius: 20 }}>
            Proteína: {currentPlan?.macros?.p || 110}g · Carbs: {currentPlan?.macros?.c || 140}g · Grasas: {currentPlan?.macros?.g || 45}g
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { name: 'Desayuno', time: '07:30', foods: ['Avena integral en hojuelas (40g)', 'Claras de huevo cocidas (3 pzas)', 'Café negro sin azúcar'] },
            { name: 'Colación AM', time: '10:30', foods: ['Manzana verde (1 pza)', 'Almendras naturales (15g)'] },
            { name: 'Comida', time: '13:30', foods: ['Pechuga de pollo a la plancha (150g)', 'Arroz integral cocido (½ taza)', 'Ensalada de espinacas y jitomate'] },
            { name: 'Colación PM', time: '16:30', foods: ['Yogur griego 0% grasa (150g)', 'Fresas frescas (½ taza)'] },
            { name: 'Cena', time: '19:30', foods: ['Salmón fresco a la plancha (120g)', 'Brócoli al vapor (1 taza)', 'Aguacate Hass (⅓ pza)'] },
          ].map((meal, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 16,
                padding: '16px 20px',
                background: 'var(--muted)',
                borderRadius: 10,
                border: '1px solid var(--border)',
                alignItems: 'center',
              }}
            >
              <div style={{ width: 50, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600, fontFamily: 'var(--font-jetbrains)' }}>{meal.time}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', marginTop: 2 }}>{meal.name}</div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {meal.foods.map((food, fi) => (
                  <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: '4px 10px', fontSize: 12.5, color: 'var(--foreground)' }}>
                    <span>• {food}</span>
                    <button onClick={() => alert(`Sustituir alimento: ${food}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', fontSize: 10 }}>⇄</button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => alert(`Añadir platillo a ${meal.name}`)}
                style={{ padding: '6px 12px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                + Añadir
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
