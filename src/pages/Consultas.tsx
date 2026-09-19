import { useState } from 'react'
import { useApp } from '../context/AppContext'

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  completada: { color: '#28845A', bg: '#E8F5EE' },
  'en progreso': { color: '#D4882A', bg: '#FEF3E2' },
  pendiente: { color: '#6B7280', bg: '#F3F4F6' },
}

const TYPE_COLORS: Record<string, string> = {
  'Primera consulta': '#14432C',
  Seguimiento: '#28845A',
  Evaluación: '#D4882A',
}

export default function Consultas() {
  const { consultations, openModal } = useApp()
  const [selected, setSelected] = useState<number>(consultations[0]?.id || 1)
  const sel = consultations.find(c => c.id === selected) || consultations[0]

  return (
    <div style={{ display: 'flex', gap: 20, height: 'calc(100vh - 120px)', minHeight: 0 }}>
      {/* List */}
      <div style={{ width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12.5, color: 'var(--muted-foreground)', fontWeight: 500 }}>
            {consultations.length} consultas registradas
          </div>
          <button
            onClick={() => openModal('nueva-consulta')}
            style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            + Nueva
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
          {consultations.map(c => (
            <div
              key={c.id}
              onClick={() => setSelected(c.id)}
              style={{
                background: selected === c.id ? 'var(--primary)' : 'var(--card)',
                border: `1px solid ${selected === c.id ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 10,
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: selected === c.id ? '#fff' : 'var(--foreground)' }}>
                  {c.patientName}
                </div>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: selected === c.id ? 'rgba(255,255,255,0.7)' : STATUS_STYLE[c.status]?.color ?? '#6B7280',
                    background: selected === c.id ? 'rgba(255,255,255,0.15)' : STATUS_STYLE[c.status]?.bg ?? '#F3F4F6',
                    padding: '3px 8px',
                    borderRadius: 20,
                  }}
                >
                  {c.status}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: selected === c.id ? 'rgba(255,255,255,0.6)' : TYPE_COLORS[c.type] ?? '#6B7280',
                  }}
                >
                  {c.type}
                </span>
                <span style={{ color: selected === c.id ? 'rgba(255,255,255,0.4)' : 'var(--border)', fontSize: 12 }}>·</span>
                <span style={{ fontSize: 12, color: selected === c.id ? 'rgba(255,255,255,0.6)' : 'var(--muted-foreground)' }}>
                  {c.date} {c.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail */}
      {sel && (
        <div style={{ flex: 1, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 28, overflowY: 'auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: TYPE_COLORS[sel.type] ?? '#6B7280',
                    background: '#E8F5EE',
                    padding: '4px 10px',
                    borderRadius: 20,
                  }}
                >
                  {sel.type}
                </span>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: STATUS_STYLE[sel.status]?.color,
                    background: STATUS_STYLE[sel.status]?.bg,
                    padding: '4px 10px',
                    borderRadius: 20,
                  }}
                >
                  {sel.status}
                </span>
              </div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--foreground)' }}>
                {sel.patientName}
              </h2>
              <div style={{ marginTop: 4, fontSize: 13, color: 'var(--muted-foreground)' }}>
                {sel.date} a las {sel.time} · {sel.motivo}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => openModal('expediente', { patientId: sel.patientId })} style={{ padding: '8px 16px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-jakarta)', color: 'var(--foreground)' }}>
                Ver Expediente
              </button>
              <button onClick={() => openModal('nueva-consulta')} style={{ padding: '8px 16px', background: 'var(--primary)', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)', color: '#fff' }}>
                + Nueva consulta
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
            {[
              { label: 'Peso actual', value: `${sel.peso} kg`, mono: true },
              { label: 'IMC', value: sel.imc.toString(), mono: true },
              { label: 'Variación', value: sel.delta, mono: true, highlight: true },
              { label: 'Plan activo', value: sel.planName, mono: false },
            ].map(m => (
              <div
                key={m.label}
                style={{
                  background: m.highlight ? '#E8F5EE' : 'var(--muted)',
                  borderRadius: 10,
                  padding: '16px 18px',
                  border: m.highlight ? '1px solid #C3E6D4' : '1px solid transparent',
                }}
              >
                <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>{m.label}</div>
                <div
                  style={{
                    fontSize: m.mono ? 20 : 14,
                    fontWeight: 700,
                    color: m.highlight ? 'var(--accent)' : 'var(--foreground)',
                    fontFamily: m.mono ? 'var(--font-jetbrains)' : 'var(--font-jakarta)',
                    letterSpacing: m.mono ? '-0.02em' : 'normal',
                    lineHeight: 1.2,
                  }}
                >
                  {m.value}
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted-foreground)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>
              Observaciones clínicas
            </div>
            {sel.obs ? (
              <div
                style={{
                  padding: '16px 20px',
                  background: 'var(--muted)',
                  borderRadius: 10,
                  fontSize: 14,
                  color: 'var(--foreground)',
                  lineHeight: 1.7,
                  border: '1px solid var(--border)',
                }}
              >
                {sel.obs}
              </div>
            ) : (
              <div
                onClick={() => openModal('nueva-consulta')}
                style={{
                  padding: '16px 20px',
                  background: 'var(--muted)',
                  borderRadius: 10,
                  fontSize: 14,
                  color: 'var(--muted-foreground)',
                  border: '2px dashed var(--border)',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                + Agregar observaciones
              </div>
            )}
          </div>

          {/* Anthropometric fields */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted-foreground)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 14 }}>
              Evaluación antropométrica detallada
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { label: 'Cintura', val: sel.cinturaCm ? `${sel.cinturaCm} cm` : '78 cm' },
                { label: 'Cadera', val: sel.caderaCm ? `${sel.caderaCm} cm` : '98 cm' },
                { label: 'ICC (Cintura/Cadera)', val: sel.cinturaCm && sel.caderaCm ? (sel.cinturaCm / sel.caderaCm).toFixed(2) : '0.80' },
                { label: 'Grasa corporal', val: sel.grasaPct ? `${sel.grasaPct}%` : '28.2%' },
                { label: 'Masa muscular', val: sel.musculoKg ? `${sel.musculoKg} kg` : '45.5 kg' },
                { label: 'Presión arterial', val: sel.presionArt || '120/80 mmHg' },
              ].map(f => (
                <div key={f.label} style={{ background: 'var(--muted)', borderRadius: 8, padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 4 }}>{f.label}</div>
                  <div style={{ fontSize: 14, color: 'var(--foreground)', fontFamily: 'var(--font-jetbrains)', fontWeight: 600 }}>{f.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
