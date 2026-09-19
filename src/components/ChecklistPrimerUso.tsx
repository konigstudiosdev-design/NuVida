import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

export default function ChecklistPrimerUso({ onNavigate }: { onNavigate: (page: any) => void }) {
  const { patients, consultations, plans, appointments } = useApp()
  const { currentUser } = useAuth()

  const [dismissed, setDismissed] = useState(false)

  if (dismissed || currentUser?.role !== 'nutriologo') return null

  const items = [
    { id: 1, label: 'Información profesional completada', done: Boolean(currentUser?.cedula), page: 'configuracion' },
    { id: 2, label: 'Datos del consultorio configurados', done: Boolean(currentUser?.organizationName), page: 'configuracion' },
    { id: 3, label: 'Horarios de atención definidos', done: true, page: 'configuracion' },
    { id: 4, label: 'Tarifas y servicios de consulta', done: true, page: 'configuracion' },
    { id: 5, label: 'Precios de paquetes registrados', done: true, page: 'configuracion' },
    { id: 6, label: 'Primer paciente registrado', done: patients.length > 0, page: 'pacientes' },
    { id: 7, label: 'Primera consulta clínica guardada', done: consultations.length > 0, page: 'consultas' },
  ]

  const completedCount = items.filter(i => i.done).length
  const progressPct = Math.round((completedCount / items.length) * 100)

  if (completedCount === items.length) return null

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #14432C 0%, #0E2418 100%)',
        color: '#FFFFFF',
        borderRadius: 14,
        padding: '20px 24px',
        border: '1px solid #1C3D2A',
        boxShadow: '0 8px 24px rgba(20,67,44,0.15)',
        marginBottom: 20,
        fontFamily: 'var(--font-jakarta)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#28845A', color: '#FFF', fontWeight: 700 }}>
              🚀 CONFIGURACIÓN INICIAL
            </span>
            <span style={{ fontSize: 12, color: '#A8C4B4', fontFamily: 'var(--font-jetbrains)' }}>
              {completedCount} de {items.length} completado ({progressPct}%)
            </span>
          </div>
          <h3 style={{ margin: '6px 0 2px', fontSize: 16, fontWeight: 700 }}>Configura tu Consultorio NuVida</h3>
          <p style={{ margin: 0, fontSize: 12.5, color: '#A8C4B4' }}>
            Completa estas acciones clave para activar tu consultorio al 100% y atender pacientes.
          </p>
        </div>

        <button
          onClick={() => setDismissed(true)}
          style={{ background: 'none', border: 'none', color: '#A8C4B4', fontSize: 12, cursor: 'pointer' }}
        >
          Ocultar por ahora ✕
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 99, marginBottom: 14, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progressPct}%`, background: '#28845A', borderRadius: 99, transition: 'width 0.3s ease' }} />
      </div>

      {/* Item Checklist Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => onNavigate(item.page)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              background: item.done ? 'rgba(40,132,90,0.2)' : 'rgba(255,255,255,0.05)',
              borderRadius: 8,
              border: item.done ? '1px solid rgba(40,132,90,0.4)' : '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: item.done ? '#28845A' : '#A8C4B4' }}>
              {item.done ? '✓' : '○'}
            </span>
            <span style={{ fontSize: 12, color: item.done ? '#FFF' : '#A8C4B4', textDecoration: item.done ? 'line-through' : 'none' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
