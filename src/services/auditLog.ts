import { nuvidaDb, AuditLogEntry } from './db'

export async function logAuditEvent(
  action: string,
  resource: string,
  resourceId: string,
  details?: string,
  result: 'exito' | 'error' | 'denegado' = 'exito'
) {
  const entry: Omit<AuditLogEntry, 'id'> = {
    organizationId: 'org_nuvida',
    userEmail: 'laura.gomez@nuvida.app',
    userRole: 'nutriologo',
    timestamp: new Date().toISOString(),
    action,
    resource,
    resourceId,
    result,
    details,
  }

  await nuvidaDb.addAuditLog(entry)
}

export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  return await nuvidaDb.getAuditLogs()
}
