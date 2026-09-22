import { useState } from 'react'
import { useApp } from '../context/AppContext'
import EmptyState from '../components/EmptyState'

const FILTERS = ['Todos', 'Activos', 'Inactivos']
const GOALS = ['Todos los objetivos', 'Pérdida de peso', 'Masa muscular', 'Control diabetes', 'Control hipertensión', 'Rendimiento deportivo']

const imcLabel = (imc: number) => {
  if (imc < 18.5) return { label: 'Bajo peso', color: '#4A9A7A' }
  if (imc < 25) return { label: 'Normal', color: '#28845A' }
  if (imc < 30) return { label: 'Sobrepeso', color: '#D4882A' }
  return { label: 'Obesidad', color: '#E85C45' }
}

export default function Pacientes() {
  const { patients, openModal } = useApp()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Todos')
  const [goalFilter, setGoalFilter] = useState('Todos los objetivos')
  const [selected, setSelected] = useState<number | null>(patients[0]?.id || null)

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'Todos' || (filter === 'Activos' && p.status === 'activo') || (filter === 'Inactivos' && p.status === 'inactivo')
    const matchGoal = goalFilter === 'Todos los objetivos' || p.goal === goalFilter
    return matchSearch && matchFilter && matchGoal
  })

  const selectedPatient = patients.find(p => p.id === selected) || filtered[0]

  if (patients.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Lista de Pacientes & Expedientes</h2>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>Administra fichas clínicas, antecedentes y seguimiento.</p>
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
          title="Aún no tienes pacientes registrados"
          description="Comienza creando la ficha clínica de tu primer paciente para asignar planes alimenticios y registrar consultas."
          actionLabel="+ Registrar Primer Paciente"
          onAction={() => openModal('nuevo-paciente')}
        />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 20, height: 'calc(100vh - 120px)', minHeight: 0 }}>
      {/* Left panel */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '9px 14px',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13.5, fontFamily: 'var(--font-jakarta)', color: 'var(--foreground)', width: '100%' }}
            />
          </div>

          <select
            value={goalFilter}
            onChange={e => setGoalFilter(e.target.value)}
            style={{
              padding: '9px 14px',
              border: '1px solid var(--border)',
              borderRadius: 8,
              background: 'var(--card)',
              fontSize: 13.5,
              fontFamily: 'var(--font-jakarta)',
              color: 'var(--foreground)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {GOALS.map(g => <option key={g}>{g}</option>)}
          </select>

          <div style={{ display: 'flex', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 14px',
                  border: 'none',
                  background: filter === f ? 'var(--primary)' : 'transparent',
                  color: filter === f ? '#fff' : 'var(--muted-foreground)',
                  fontSize: 13,
                  fontWeight: filter === f ? 600 : 400,
                  fontFamily: 'var(--font-jakarta)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={() => openModal('nuevo-paciente')}
            style={{
              padding: '9px 16px',
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'var(--font-jakarta)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            + Nuevo paciente
          </button>
        </div>

        {/* Table */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', flex: 1 }}>
          <div style={{ overflowY: 'auto', height: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Paciente', 'Objetivo', 'IMC', 'Progreso', 'Próx. consulta', 'Sesiones', ''].map(h => (
                    <th
                      key={h}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: 'var(--muted-foreground)',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        background: 'var(--muted)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const imc = imcLabel(p.imc)
                  const isSelected = selected === p.id
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelected(isSelected ? null : p.id)}
                      style={{
                        borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                        background: isSelected ? '#E8F5EE' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background 0.12s ease',
                      }}
                      onMouseEnter={e => !isSelected && ((e.currentTarget as HTMLElement).style.background = 'var(--muted)')}
                      onMouseLeave={e => !isSelected && ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                    >
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: '50%',
                              background: isSelected ? 'var(--accent)' : 'var(--secondary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 11,
                              fontWeight: 700,
                              color: isSelected ? '#fff' : 'var(--primary)',
                              flexShrink: 0,
                            }}
                          >
                            {p.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--foreground)' }}>{p.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{p.age} años · {p.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ fontSize: 12.5, color: 'var(--foreground)' }}>{p.goal}</span>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-jetbrains)', color: 'var(--foreground)' }}>{p.imc}</span>
                          <div style={{ fontSize: 11, color: imc.color, fontWeight: 500 }}>{imc.label}</div>
                        </div>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 5, background: 'var(--muted)', borderRadius: 99, width: 70 }}>
                            <div style={{ height: '100%', width: `${p.progress}%`, background: p.progress > 70 ? 'var(--accent)' : p.progress > 50 ? '#D4882A' : '#9BA4A0', borderRadius: 99 }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)', width: 30 }}>{p.progress}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 12.5, color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>{p.nextConsult}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ fontSize: 12.5, fontFamily: 'var(--font-jetbrains)', color: 'var(--foreground)' }}>{p.sessions}</span>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={e => { e.stopPropagation(); openModal('expediente', { patientId: p.id }) }}
                            style={{ padding: '5px 10px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, cursor: 'pointer', color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)' }}
                          >
                            Ver
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); openModal('nueva-consulta') }}
                            style={{ padding: '5px 10px', background: 'var(--primary)', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer', color: '#fff', fontFamily: 'var(--font-jakarta)', fontWeight: 600 }}
                          >
                            Consulta
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ fontSize: 12.5, color: 'var(--muted-foreground)' }}>
          Mostrando {filtered.length} de {patients.length} pacientes
        </div>
      </div>

      {/* Detail panel */}
      {selectedPatient && (
        <div
          style={{
            width: 320,
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            flexShrink: 0,
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#fff',
                  marginBottom: 12,
                }}
              >
                {selectedPatient.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--foreground)', letterSpacing: '-0.02em' }}>{selectedPatient.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted-foreground)', marginTop: 2 }}>{selectedPatient.age} años · {selectedPatient.goal}</div>
            </div>
            <button
              onClick={() => setSelected(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', padding: 4 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Email', value: selectedPatient.email },
              { label: 'Teléfono', value: selectedPatient.phone },
              { label: 'Última consulta', value: selectedPatient.lastConsult },
              { label: 'Próxima consulta', value: selectedPatient.nextConsult },
            ].map(f => (
              <div key={f.label}>
                <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 2 }}>{f.label}</div>
                <div style={{ fontSize: 13.5, color: 'var(--foreground)' }}>{f.value}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>Métricas del expediente</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'IMC', value: selectedPatient.imc.toString() },
                { label: 'Peso', value: `${selectedPatient.weight || 70} kg` },
                { label: 'Sesiones', value: selectedPatient.sessions.toString() },
                { label: 'Progreso', value: `${selectedPatient.progress}%` },
              ].map(m => (
                <div key={m.label} style={{ background: 'var(--muted)', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: 10.5, color: 'var(--muted-foreground)', marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)', fontFamily: 'var(--font-jetbrains)' }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={() => openModal('nueva-consulta')}
              style={{ padding: '10px 16px', background: 'var(--primary)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13.5, fontWeight: 600, fontFamily: 'var(--font-jakarta)', cursor: 'pointer' }}
            >
              Nueva consulta
            </button>
            <button
              onClick={() => openModal('expediente', { patientId: selectedPatient.id })}
              style={{ padding: '10px 16px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground)', fontSize: 13.5, fontFamily: 'var(--font-jakarta)', cursor: 'pointer' }}
            >
              Ver expediente completo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
