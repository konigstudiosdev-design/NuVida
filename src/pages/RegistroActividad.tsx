import { useState, useEffect } from 'react'
import { getAuditLogs } from '../services/auditLog'
import { AuditLogEntry } from '../services/db'

export default function RegistroActividad() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([])

  useEffect(() => {
    getAuditLogs().then(entries => {
      if (entries.length === 0) {
        // Sample audit logs for demo
        setLogs([
          { id: 'l1', organizationId: 'org_nuvida', userEmail: 'laura.gomez@nuvida.app', userRole: 'nutriologo', timestamp: new Date().toISOString(), action: 'crear_consulta', resource: 'consultations', resourceId: '1', result: 'exito', details: 'Consulta registrada para Ana Torres' },
          { id: 'l2', organizationId: 'org_nuvida', userEmail: 'laura.gomez@nuvida.app', userRole: 'nutriologo', timestamp: new Date(Date.now() - 3600000).toISOString(), action: 'descargar_pdf', resource: 'meal_plans', resourceId: '1', result: 'exito', details: 'PDF descargado para Plan Recomposición' },
          { id: 'l3', organizationId: 'org_nuvida', userEmail: 'recepcion@nuvida.app', userRole: 'asistente', timestamp: new Date(Date.now() - 86400000).toISOString(), action: 'crear_cita', resource: 'appointments', resourceId: '3', result: 'exito', details: 'Cita agendada para Valentina Cruz' },
        ])
      } else {
        setLogs(entries)
      }
    })
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Registro de Actividad & Audit Log</h2>
        <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>Pista de auditoría inmutable de todas las acciones clínicas y administrativas del sistema.</p>
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
              {['Fecha/Hora', 'Usuario / Rol', 'Acción', 'Recurso ID', 'Resultado', 'Detalles'].map(h => (
                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px', fontSize: 12, fontFamily: 'var(--font-jetbrains)', color: 'var(--muted-foreground)' }}>
                  {new Date(log.timestamp).toLocaleString('es-MX')}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>
                  {log.userEmail} <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>({log.userRole})</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: 11.5, padding: '3px 8px', borderRadius: 6, background: 'var(--muted)', fontWeight: 600, fontFamily: 'var(--font-jetbrains)', color: 'var(--primary)' }}>
                    {log.action}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, fontFamily: 'var(--font-jetbrains)' }}>{log.resourceId}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: log.result === 'exito' ? '#E8F5EE' : '#FDECEA', color: log.result === 'exito' ? 'var(--accent)' : '#E85C45', fontWeight: 600 }}>
                    {log.result}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12.5, color: 'var(--muted-foreground)' }}>{log.details || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
