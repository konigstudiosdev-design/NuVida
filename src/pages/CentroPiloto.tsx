import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { pilotAnalytics } from '../services/pilotAnalytics'
import { featureFlags, FeatureFlags } from '../services/featureFlags'

export default function CentroPiloto() {
  const { patients, consultations, plans, appointments, payments, organization } = useApp()
  const { currentUser } = useAuth()

  const [flags, setFlags] = useState<FeatureFlags>(featureFlags.getFlags())
  const feedbackList = pilotAnalytics.getFeedback()
  const errorLogs = pilotAnalytics.getErrors()

  const isActivated = pilotAnalytics.isUserActivated(true, patients.length, consultations.length)

  const handleToggleFlag = (flag: keyof FeatureFlags) => {
    const nextVal = !flags[flag]
    featureFlags.setFlag(flag, nextVal)
    setFlags(featureFlags.getFlags())
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Banner */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#E8F5EE', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Centro Interno del Piloto 1.0
            </span>
            <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: isActivated ? '#E8F5EE' : '#FEF3E2', color: isActivated ? 'var(--accent)' : '#D4882A', fontWeight: 700 }}>
              {isActivated ? 'Activation: ✓ Activado' : 'Activation: Pendiente'}
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--foreground)' }}>
            Panel de Validación NuVida Pilot 1.0
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>
            Organización: {organization.name} · Administrador: {currentUser?.name}
          </p>
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-jetbrains)' }}>
          PILOT 1.0 · Build 2026.09
        </div>
      </div>

      {/* Usage Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600, textTransform: 'uppercase' }}>PACIENTES REGISTRADOS</div>
          <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-jetbrains)', color: 'var(--foreground)', marginTop: 4 }}>{patients.length}</div>
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600, textTransform: 'uppercase' }}>CONSULTAS CLINICAS</div>
          <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-jetbrains)', color: 'var(--accent)', marginTop: 4 }}>{consultations.length}</div>
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600, textTransform: 'uppercase' }}>PLANES ALIMENTICIOS</div>
          <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-jetbrains)', color: 'var(--foreground)', marginTop: 4 }}>{plans.length}</div>
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600, textTransform: 'uppercase' }}>CITAS AGENDADAS</div>
          <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-jetbrains)', color: 'var(--foreground)', marginTop: 4 }}>{appointments.length}</div>
        </div>
      </div>

      {/* Feature Flags Controls */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: 'var(--foreground)' }}>
          Feature Flags de Producción (Interruptores de Despliegue Gradual)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {[
            { key: 'AI_COPILOT', name: 'NuVida AI Copilot', desc: 'Asistente de IA para resúmenes de evolución y borradores.' },
            { key: 'WHATSAPP_AUTO', name: 'WhatsApp Business API', desc: 'Alertas automáticas y envío de planes por chat.' },
            { key: 'PATIENT_PORTAL', name: 'Portal del Paciente', desc: 'Acceso móvil para consulta de dietas y progreso.' },
            { key: 'PUSH_NOTIFICATIONS', name: 'Notificaciones Push', desc: 'Recordatorios en tiempo real para consultas y avisos.' },
          ].map(f => {
            const isEnabled = flags[f.key as keyof FeatureFlags]
            return (
              <div
                key={f.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 14,
                  background: 'var(--muted)',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                }}
              >
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--foreground)' }}>{f.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted-foreground)', marginTop: 2 }}>{f.desc}</div>
                </div>

                <button
                  onClick={() => handleToggleFlag(f.key as keyof FeatureFlags)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    border: 'none',
                    background: isEnabled ? 'var(--accent)' : 'var(--border)',
                    color: isEnabled ? '#FFF' : 'var(--muted-foreground)',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {isEnabled ? 'ACTIVO' : 'INACTIVO'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pilot Feedback & Error Logs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: 'var(--foreground)' }}>
            Retroalimentación del Piloto ({feedbackList.length})
          </h3>

          {feedbackList.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--muted-foreground)', padding: '16px 0', textAlign: 'center' }}>
              No hay comentarios registrados todavía en el piloto.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 240, overflowY: 'auto' }}>
              {feedbackList.map(fb => (
                <div key={fb.id} style={{ padding: 12, background: 'var(--muted)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600 }}>
                    <span style={{ textTransform: 'uppercase' }}>{fb.type}</span>
                    <span>{fb.timestamp.split('T')[0]}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--foreground)', marginTop: 4 }}>{fb.details}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: 'var(--foreground)' }}>
            Registro de Errores para Diagnóstico ({errorLogs.length})
          </h3>

          {errorLogs.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, padding: '16px 0', textAlign: 'center' }}>
              ✓ 0 errores críticos detectados en el piloto.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 240, overflowY: 'auto' }}>
              {errorLogs.map(err => (
                <div key={err.id} style={{ padding: 12, background: '#FDECEA', borderRadius: 8, border: '1px solid #F5C6CB' }}>
                  <div style={{ fontSize: 11, color: '#E85C45', fontWeight: 700 }}>{err.module} · {err.timestamp.split('T')[0]}</div>
                  <div style={{ fontSize: 12.5, color: '#131210', marginTop: 2 }}>{err.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
