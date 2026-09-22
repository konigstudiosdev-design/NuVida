// Secure IndexedDB Storage Engine for NuVida SaaS

export interface AuditLogEntry {
  id: string
  organizationId: string
  userEmail: string
  userRole: string
  timestamp: string
  action: string
  resource: string
  resourceId: string
  result: 'exito' | 'error' | 'denegado'
  details?: string
}

export interface SyncOutboxEntry {
  id: string
  type: 'consulta' | 'pago' | 'cita' | 'paciente' | 'medicion' | 'plan'
  payload: any
  createdAt: string
  status: 'sincronizado' | 'sincronizando' | 'pendiente' | 'error_conflicto'
  conflictData?: any
  retryCount: number
}

class NuVidaDB {
  private dbName = 'nuvida_clinical_db'
  private version = 1
  private db: IDBDatabase | null = null

  public async init(): Promise<boolean> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) return false

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains('audit_logs')) {
          db.createObjectStore('audit_logs', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('outbox_sync')) {
          db.createObjectStore('outbox_sync', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('clinical_cache')) {
          db.createObjectStore('clinical_cache', { keyPath: 'key' })
        }
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences', { keyPath: 'key' })
        }
      }

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result
        resolve(true)
      }

      request.onerror = () => {
        console.warn('[NuVida DB] IndexedDB failed to open')
        resolve(false)
      }
    })
  }

  // Audit Logs
  public async addAuditLog(entry: Omit<AuditLogEntry, 'id'>): Promise<AuditLogEntry> {
    await this.ensureDb()
    const log: AuditLogEntry = {
      ...entry,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    }

    if (!this.db) return log

    return new Promise((resolve) => {
      const tx = this.db!.transaction('audit_logs', 'readwrite')
      const store = tx.objectStore('audit_logs')
      store.add(log)
      tx.oncomplete = () => resolve(log)
      tx.onerror = () => resolve(log)
    })
  }

  public async getAuditLogs(): Promise<AuditLogEntry[]> {
    await this.ensureDb()
    if (!this.db) return []

    return new Promise((resolve) => {
      const tx = this.db!.transaction('audit_logs', 'readonly')
      const store = tx.objectStore('audit_logs')
      const request = store.getAll()
      request.onsuccess = () => resolve((request.result || []).sort((a, b) => b.timestamp.localeCompare(a.timestamp)))
      request.onerror = () => resolve([])
    })
  }

  // Outbox Sync & Conflict Resolution
  public async addSyncItem(item: Omit<SyncOutboxEntry, 'id' | 'status' | 'retryCount'>): Promise<SyncOutboxEntry> {
    await this.ensureDb()
    const entry: SyncOutboxEntry = {
      ...item,
      id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: 'pendiente',
      retryCount: 0,
    }

    if (!this.db) return entry

    return new Promise((resolve) => {
      const tx = this.db!.transaction('outbox_sync', 'readwrite')
      const store = tx.objectStore('outbox_sync')
      store.add(entry)
      tx.oncomplete = () => resolve(entry)
      tx.onerror = () => resolve(entry)
    })
  }

  public async getSyncOutbox(): Promise<SyncOutboxEntry[]> {
    await this.ensureDb()
    if (!this.db) return []

    return new Promise((resolve) => {
      const tx = this.db!.transaction('outbox_sync', 'readonly')
      const store = tx.objectStore('outbox_sync')
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => resolve([])
    })
  }

  public async clearSyncItem(id: string): Promise<void> {
    await this.ensureDb()
    if (!this.db) return

    return new Promise((resolve) => {
      const tx = this.db!.transaction('outbox_sync', 'readwrite')
      const store = tx.objectStore('outbox_sync')
      store.delete(id)
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
    })
  }

  // Secure Clinical Data Cache
  public async setClinicalData(key: string, data: any): Promise<void> {
    await this.ensureDb()
    if (!this.db) return

    return new Promise((resolve) => {
      const tx = this.db!.transaction('clinical_cache', 'readwrite')
      const store = tx.objectStore('clinical_cache')
      store.put({ key, value: data, updatedAt: new Date().toISOString() })
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
    })
  }

  public async getClinicalData<T>(key: string): Promise<T | null> {
    await this.ensureDb()
    if (!this.db) return null

    return new Promise((resolve) => {
      const tx = this.db!.transaction('clinical_cache', 'readonly')
      const store = tx.objectStore('clinical_cache')
      const request = store.get(key)
      request.onsuccess = () => resolve(request.result ? request.result.value : null)
      request.onerror = () => resolve(null)
    })
  }

  public async clearAllClinicalData(): Promise<void> {
    await this.ensureDb()
    if (!this.db) return

    const stores = ['clinical_cache', 'outbox_sync']
    const tx = this.db.transaction(stores, 'readwrite')
    stores.forEach((s) => tx.objectStore(s).clear())
  }

  private async ensureDb() {
    if (!this.db) {
      await this.init()
    }
  }
}

export const nuvidaDb = new NuVidaDB()
