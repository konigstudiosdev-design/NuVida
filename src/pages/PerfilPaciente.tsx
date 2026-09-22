import { useState } from 'react'
import { useApp } from '../context/AppContext'
import EmptyState from '../components/EmptyState'

export default function PerfilPaciente() {
  const { patients, consultations, anthropometry, plans, payments, openModal } = useApp()
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(patients[0]?.id || null)
  const [activeTab, setActiveTab] = useState<'resumen' | 'expediente' | 'consultas' | 'antropometria' | 'planes' | 'seguimiento' | 'recetas' | 'pagos' | 'documentos'>('resumen')

  if (patients.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Perfil del Paciente 360°</h2>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>Vista unificada de expediente, consultas, antropometría y dieta.</p>
          </div>
          <button
            onClick={() => openModal('nuevo-paciente')}
            style={{ padding: '9px 18px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}
          >
            + Nuevo Paciente
          </button>
        </div>

        <EmptyState
          icon="👤"
          title="No hay pacientes registrados todavía"
          description="Crea la ficha de tu primer paciente para visualizar su perfil clínico 360°, antropometría y plan nutricional."
          actionLabel="+ Registrar Primer Paciente"
          onAction={() => openModal('nuevo-paciente')}
        />
      </div>
    )
  }

  const patient = patients.find(p => p.id === Number(selectedPatientId)) || patients[0]
  const patientConsultations = consultations.filter(c => c.patientId === patient?.id)
  const patientAnthropometry = anthropometry.filter(a => a.patientId === patient?.id)
  const patientPlans = plans.filter(p => p.patientId === patient?.id)
  const patientPayments = payments.filter(p => p.patientId === patient?.id)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Patient Selector Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--muted-foreground)', fontWeight: 600 }}>Seleccionar Paciente:</span>
          <select
            value={patient.id}
            onChange={e => setSelectedPatientId(Number(e.target.value))}
            style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card)', fontSize: 14, fontFamily: 'var(--font-jakarta)', color: 'var(--foreground)', fontWeight: 600, outline: 'none' }}
          >
            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => openModal('nueva-consulta', { patientId: patient.id })}
            style={{ padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}
          >
            + Nueva Consulta
          </button>
          <button
            onClick={() => openModal('nuevo-plan', { patientId: patient.id })}
            style={{ padding: '8px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}
          >
            + Asignar Plan
          </button>
        </div>
      </div>

      {/* Patient Header Center Card */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--accent)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {patient.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--foreground)', letterSpacing: '-0.02em' }}>{patient.name}</h2>
              <span style={{ fontSize: 11.5, padding: '3px 10px', borderRadius: 20, background: '#E8F5EE', color: 'var(--accent)', fontWeight: 700, textTransform: 'capitalize' }}>
                {patient.status}
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 4 }}>
              {patient.age || 30} años · {patient.gender || 'Paciente'} · {patient.occupation || 'Consultorio NuVida'} · WhatsApp: {patient.phone || 'No registrado'}
            </div>
            <div style={{ marginTop: 6, fontSize: 12.5, fontWeight: 600, color: 'var(--primary)' }}>
              🎯 Objetivo: {patient.goal || 'Seguimiento Nutricional'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, textAlign: 'right' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600 }}>ÚLTIMA CONSULTA</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)', marginTop: 2, fontFamily: 'var(--font-jetbrains)' }}>{patient.lastConsult || 'Pendiente'}</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 20 }}>
            <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600 }}>PRÓXIMA CONSULTA</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', marginTop: 2, fontFamily: 'var(--font-jetbrains)' }}>{patient.nextConsult || 'Por agendar'}</div>
          </div>
        </div>
      </div>

      {/* 9 Tabs Bar */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 6, overflowX: 'auto' }}>
        {[
          { id: 'resumen', label: 'Resumen', icon: '📊' },
          { id: 'expediente', label: 'Expediente', icon: '📜' },
          { id: 'consultas', label: 'Consultas', icon: '📋' },
          { id: 'antropometria', label: 'Antropometría', icon: '📏' },
          { id: 'planes', label: 'Planes', icon: '🥗' },
          { id: 'seguimiento', label: 'Seguimiento', icon: '📈' },
          { id: 'recetas', label: 'Recetas', icon: '🍳' },
          { id: 'pagos', label: 'Pagos', icon: '💳' },
          { id: 'documentos', label: 'Documentos', icon: '📁' },
        ].map(t => {
          const isActive = activeTab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: 8,
                border: 'none',
                background: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? '#fff' : 'var(--foreground)',
                fontSize: 12.5,
                fontWeight: isActive ? 700 : 500,
                fontFamily: 'var(--font-jakarta)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ marginRight: 6 }}>{t.icon}</span>
              {t.label}
            </button>
          )
        })}
      </div>

      {/* TAB CONTENT 1: RESUMEN */}
      {activeTab === 'resumen' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
          {/* Key Metrics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <div style={{ background: 'var(--card)', padding: 16, borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600 }}>PESO ACTUAL</div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-jetbrains)', color: 'var(--foreground)' }}>{patient.weight || '--'} kg</div>
              </div>
              <div style={{ background: 'var(--card)', padding: 16, borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600 }}>ESTATURA</div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-jetbrains)', color: 'var(--foreground)' }}>{patient.height || '--'} cm</div>
              </div>
              <div style={{ background: 'var(--card)', padding: 16, borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600 }}>IMC</div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-jetbrains)', color: 'var(--foreground)' }}>{patient.imc || '--'}</div>
              </div>
              <div style={{ background: 'var(--card)', padding: 16, borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600 }}>PROGRESO</div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-jetbrains)', color: 'var(--accent)' }}>{patient.progress || 0}%</div>
              </div>
            </div>

            {/* Medical Summary */}
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)', marginBottom: 12 }}>Antecedentes & Alergias</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600, marginBottom: 4 }}>ANTECEDENTES MÉDICOS</div>
                  <div style={{ fontSize: 12.5, color: 'var(--foreground)' }}>{patient.expediente?.antecedentesMedicos?.join(', ') || 'Sin antecedentes registrados'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600, marginBottom: 4 }}>ALERGIAS / INTOLERANCIAS</div>
                  <div style={{ fontSize: 12.5, color: '#E85C45', fontWeight: 600 }}>{patient.expediente?.alergias?.join(', ') || 'Sin alergias registradas'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Central Connected Timeline */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)', marginBottom: 16 }}>Línea de Tiempo del Paciente</div>
            {patientConsultations.length === 0 && patientAnthropometry.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--muted-foreground)', fontSize: 13 }}>
                Aún no hay eventos registrados para este paciente.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {patientConsultations.map(c => (
                  <div key={c.id} style={{ padding: '12px 14px', background: 'var(--muted)', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)', fontWeight: 600 }}>{c.date}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground)', marginTop: 2 }}>{c.type} — {c.status}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>{c.motivo}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: EXPEDIENTE */}
      {activeTab === 'expediente' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)', marginBottom: 10 }}>Historial Clínico</div>
            <div style={{ fontSize: 13, color: 'var(--foreground)', lineHeight: 1.6 }}>
              <strong>Antecedentes:</strong> {patient.expediente?.antecedentesMedicos?.join(', ') || 'Ninguno'}<br />
              <strong>Enfermedades:</strong> {patient.expediente?.enfermedades?.join(', ') || 'Ninguna'}<br />
              <strong>Medicamentos:</strong> {patient.expediente?.medicamentos?.join(', ') || 'Ninguno'}<br />
              <strong>Suplementos:</strong> {patient.expediente?.suplementos?.join(', ') || 'Ninguno'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)', marginBottom: 10 }}>Estilo de Vida y Hábitos</div>
            <div style={{ fontSize: 13, color: 'var(--foreground)', lineHeight: 1.6 }}>
              <strong>Actividad Física:</strong> {patient.expediente?.habitos?.actividadFisica || 'Moderada'}<br />
              <strong>Horas de Sueño:</strong> {patient.expediente?.habitos?.suenoHoras || 7} h/día<br />
              <strong>Agua:</strong> {patient.expediente?.habitos?.consumoAguaLitros || 2} L/día<br />
              <strong>Preferencias:</strong> {patient.expediente?.preferenciasAlimentarias?.join(', ') || 'Sin restricción'}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: CONSULTAS */}
      {activeTab === 'consultas' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          {patientConsultations.length === 0 ? (
            <EmptyState
              icon="📋"
              title="No hay consultas para este paciente"
              description="Registra la primera consulta clínica para dar seguimiento a sus hábitos y progresos."
              actionLabel="+ Registrar Consulta"
              onAction={() => openModal('nueva-consulta', { patientId: patient.id })}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {patientConsultations.map(c => (
                <div key={c.id} style={{ padding: 16, background: 'var(--muted)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)' }}>{c.type}</span>
                    <span style={{ fontSize: 12, fontFamily: 'var(--font-jetbrains)', color: 'var(--accent)', fontWeight: 600 }}>{c.date}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--foreground)' }}>{c.evolucion}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 4: ANTROPOMETRÍA */}
      {activeTab === 'antropometria' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          {patientAnthropometry.length === 0 ? (
            <EmptyState
              icon="📏"
              title="No hay mediciones antropométricas registradas"
              description="Captura el peso, IMC, % de grasa y perímetros para generar la gráfica de evolución."
              actionLabel="+ Capturar Medición"
              onAction={() => openModal('capturar-antropometria', { patientId: patient.id })}
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {patientAnthropometry.map(a => (
                <div key={a.id} style={{ padding: 14, background: 'var(--muted)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)', fontWeight: 600 }}>{a.date}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)', marginTop: 4 }}>{a.pesoKg} kg</div>
                  <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 2 }}>Grasa: {a.grasaPct}% · Cintura: {a.cinturaCm} cm</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 5: PLANES */}
      {activeTab === 'planes' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          {patientPlans.length === 0 ? (
            <EmptyState
              icon="🥗"
              title="No hay planes alimenticios asignados"
              description="Diseña y asigna un plan de alimentación personalizado de forma rápida."
              actionLabel="+ Asignar Plan Alimenticio"
              onAction={() => openModal('nuevo-plan', { patientId: patient.id })}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {patientPlans.map(p => (
                <div key={p.id} style={{ padding: 16, background: 'var(--muted)', borderRadius: 10, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)' }}>{p.name}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--muted-foreground)', marginTop: 2 }}>{p.kcal} kcal · P: {p.macros.p}g | C: {p.macros.c}g | G: {p.macros.g}g</div>
                  </div>
                  <button onClick={() => openModal('pdf-preview', { plan: p })} style={{ padding: '6px 14px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    🖨️ Exportar PDF
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 8: PAGOS */}
      {activeTab === 'pagos' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          {patientPayments.length === 0 ? (
            <EmptyState
              icon="💳"
              title="Sin transacciones financieras registradas"
              description="Registra los cobros de consultas y paquetes asignados a este paciente."
              actionLabel="+ Registrar Cobro"
              onAction={() => openModal('registrar-pago', { patientId: patient.id })}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {patientPayments.map(p => (
                <div key={p.id} style={{ padding: 12, background: 'var(--muted)', borderRadius: 8, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground)' }}>{p.concept}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted-foreground)' }}>{p.date} · {p.method}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-jetbrains)', color: 'var(--accent)' }}>${p.amount} MXN</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
