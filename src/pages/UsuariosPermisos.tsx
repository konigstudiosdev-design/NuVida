import { useState } from 'react'
import { useApp, UserRole } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

export default function UsuariosPermisos() {
  const { currentRole, setCurrentRole, organization } = useApp()
  const { currentUser } = useAuth()

  const [members, setMembers] = useState([
    {
      name: currentUser?.name || 'Nutrióloga Titular',
      email: currentUser?.email || 'nutriologo@consultorio.app',
      role: 'nutriologo' as UserRole,
      status: 'Activo',
      lastLogin: 'Ahora (Sesión Actual)',
    },
  ])

  const [showAddMember, setShowAddMember] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [newMemberRole, setNewMemberRole] = useState<UserRole>('recepcionista')

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemberName || !newMemberEmail) return
    setMembers(prev => [
      ...prev,
      {
        name: newMemberName,
        email: newMemberEmail,
        role: newMemberRole,
        status: 'Invitado (Credenciales Enviadas)',
        lastLogin: 'Pendiente',
      },
    ])
    setNewMemberName('')
    setNewMemberEmail('')
    setShowAddMember(false)
    alert(`Invitación y credenciales temporales (temp1234) creadas para ${newMemberName}.`)
  }

  const matrix = [
    { module: 'Expediente Clínico y Consultas', nutriologo: true, recepcionista: false, paciente: false },
    { module: 'Prescripción de Planes y Dietas', nutriologo: true, recepcionista: false, paciente: false },
    { module: 'Evaluaciones Antropométricas', nutriologo: true, recepcionista: false, paciente: false },
    { module: 'Gestión de Agenda y Citas', nutriologo: true, recepcionista: true, paciente: true },
    { module: 'Registro de Cobros y Caja', nutriologo: true, recepcionista: true, paciente: false },
    { module: 'Consulta de Plan Diario y Lista de Compras', nutriologo: true, recepcionista: false, paciente: true },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Banner */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
            Control de Roles del Consultorio
          </div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--foreground)' }}>
            Usuarios y Permisos — {organization.name}
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13.5, color: 'var(--muted-foreground)' }}>
            Configura los accesos para el equipo del consultorio (Nutrióloga y Recepcionista) e Interfaz de Paciente.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setShowAddMember(true)}
            style={{ padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}
          >
            + Agregar Miembro de Equipo
          </button>
          <select
            value={currentRole}
            onChange={e => setCurrentRole(e.target.value as UserRole)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card)', fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}
          >
            <option value="nutriologo">Nutrióloga / Nutriólogo</option>
            <option value="recepcionista">Recepcionista</option>
            <option value="paciente">Interfaz Paciente</option>
          </select>
        </div>
      </div>

      {/* Modal Agregar Miembro */}
      {showAddMember && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: 'var(--foreground)' }}>Crear Credenciales de Miembro de Equipo</h3>
          <form onSubmit={handleAddMember} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>Nombre completo</label>
              <input
                required
                placeholder="Ej. Mariana Ríos"
                value={newMemberName}
                onChange={e => setNewMemberName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>Correo / Usuario</label>
              <input
                required
                placeholder="recepcion.mariana"
                value={newMemberEmail}
                onChange={e => setNewMemberEmail(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>Rol asignado</label>
              <select
                value={newMemberRole}
                onChange={e => setNewMemberRole(e.target.value as UserRole)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13 }}
              >
                <option value="recepcionista">Recepcionista</option>
                <option value="nutriologo">Nutrióloga Adicional</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => setShowAddMember(false)} style={{ padding: '8px 14px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12.5, cursor: 'pointer' }}>
                Cancelar
              </button>
              <button type="submit" style={{ padding: '8px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
                Generar Credenciales
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Staff Table */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontSize: 15, fontWeight: 700, color: 'var(--foreground)' }}>
          Equipo del Consultorio ({members.length})
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
              {['Nombre', 'Correo / Usuario', 'Rol Asignado', 'Último Acceso', 'Estado'].map(h => (
                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 13.5, color: 'var(--foreground)' }}>{m.name}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--muted-foreground)' }}>{m.email}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: 11.5, padding: '3px 10px', borderRadius: 20, background: 'var(--muted)', fontWeight: 600, textTransform: 'capitalize', color: 'var(--foreground)' }}>
                    {m.role === 'nutriologo' ? 'Nutrióloga' : m.role === 'recepcionista' ? 'Recepcionista' : 'Paciente'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, fontFamily: 'var(--font-jetbrains)', color: 'var(--muted-foreground)' }}>{m.lastLogin}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: '#E8F5EE', color: 'var(--accent)', fontWeight: 600 }}>{m.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Permission Matrix */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: 'var(--foreground)' }}>Matriz de Permisos por Rol</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Módulo / Función</th>
              <th style={{ padding: '10px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)' }}>Nutrióloga</th>
              <th style={{ padding: '10px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)' }}>Recepcionista</th>
              <th style={{ padding: '10px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)' }}>Paciente</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>{row.module}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: 16 }}>{row.nutriologo ? '✓' : '✕'}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: 16 }}>{row.recepcionista ? '✓' : '✕'}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: 16 }}>{row.paciente ? '✓' : '✕'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
