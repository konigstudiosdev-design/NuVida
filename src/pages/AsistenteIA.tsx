import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function AsistenteIA() {
  const { aiSuggestions, approveAiSuggestion, patients } = useApp()
  const [selectedPatient, setSelectedPatient] = useState(patients[0]?.name || 'Ana Torres Medina')
  const [customPrompt, setCustomPrompt] = useState('')
  const [generatedDraft, setCustomGeneratedDraft] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customPrompt.trim()) return
    setLoading(true)
    setTimeout(() => {
      setCustomGeneratedDraft(`Borrador generado para ${selectedPatient}:\n\n1. Estrategia: Ajuste de ciclo de carbohidratos en días de entrenamiento.\n2. Menú sugerido: Elevar consumo de proteína a 1.8g/kg de peso magro.\n3. Suplementación recomendada: Citrato de Magnesio nocturno (400mg) para mejorar recuperación muscular y sueño.\n\n*Nota: Este borrador requiere revisión y aprobación del profesional.*`)
      setLoading(false)
    }, 1200)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Banner */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
            Asistente Copiloto IA Clínico
          </div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--foreground)' }}>
            Inteligencia Artificial Nutricional
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13.5, color: 'var(--muted-foreground)' }}>
            Analiza evoluciones, detecta riesgos de deserción y redacta borradores de recomendación para tu revisión profesional.
          </p>
        </div>

        <div style={{ background: '#E8F5EE', padding: '8px 14px', borderRadius: 8, color: 'var(--accent)', fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>🛡️ Criterio Profesional Activo</span>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
        {/* Custom Prompt Generator */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
          <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: 'var(--foreground)' }}>Generador de Análisis & Borradores</h3>

          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Seleccionar Paciente</label>
              <select value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)', outline: 'none' }}>
                {patients.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>¿Qué deseas que la IA analice o sugiera?</label>
              <textarea
                rows={4}
                placeholder="Ej. Resumir la evolución de grasa corporal del paciente en las últimas 8 semanas y proponer una dieta con ciclado de carbohidratos..."
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-jakarta)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {loading ? 'Generando análisis IA...' : '⚡ Generar Borrador Clínico con IA'}
            </button>
          </form>

          {generatedDraft && (
            <div style={{ marginTop: 20, padding: 16, background: 'var(--muted)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 8 }}>Borrador Generado por IA</div>
              <pre style={{ margin: 0, fontSize: 12.5, fontFamily: 'var(--font-jakarta)', color: 'var(--foreground)', whitespace: 'pre-wrap' }}>{generatedDraft}</pre>
              <button
                onClick={() => alert('Borrador aprobado y guardado en la consulta del paciente.')}
                style={{ marginTop: 12, padding: '8px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
              >
                ✓ Revisar y Aprobar
              </button>
            </div>
          )}
        </div>

        {/* AI Automated Alerts & Insights */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: 'var(--foreground)' }}>Alertas de Seguimiento Automáticas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {aiSuggestions.map((item, idx) => (
              <div key={idx} style={{ padding: 16, background: 'var(--muted)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--foreground)' }}>{item.title}</span>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: item.approved ? '#E8F5EE' : '#FEF3E2', color: item.approved ? 'var(--accent)' : '#D4882A', fontWeight: 600 }}>
                    {item.approved ? 'Aprobado' : 'Pendiente revisión'}
                  </span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--muted-foreground)', marginBottom: 8 }}>{item.summary}</div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: 'var(--foreground)' }}>
                  {item.details.map((d, di) => <li key={di}>{d}</li>)}
                </ul>
                {!item.approved && (
                  <button
                    onClick={() => approveAiSuggestion(idx)}
                    style={{ marginTop: 12, padding: '6px 14px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Aprobar Sugerencia
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
