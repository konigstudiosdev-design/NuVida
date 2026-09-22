// PWA Lifecycle and Offline Synchronization Service

export interface PendingSyncItem {
  id: string
  type: 'consulta' | 'pago' | 'cita' | 'paciente'
  payload: any
  createdAt: string
}

type PwaListener = () => void

class PwaService {
  private deferredPrompt: any = null
  private listeners: Set<PwaListener> = new Set()

  public isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true
  public isInstalled: boolean = false
  public updateAvailable: boolean = false
  public pendingOutbox: PendingSyncItem[] = []

  constructor() {
    if (typeof window !== 'undefined') {
      this.checkInstalledStatus()
      this.initListeners()
      this.loadOutbox()
    }
  }

  private checkInstalledStatus() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')

    this.isInstalled = isStandalone
  }

  private initListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.notifyListeners()
      this.replayOutbox()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      this.notifyListeners()
    })

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      this.deferredPrompt = e
      this.notifyListeners()
    })

    window.addEventListener('appinstalled', () => {
      this.isInstalled = true
      this.deferredPrompt = null
      this.notifyListeners()
    })

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'SW_REPLAY_OUTBOX') {
          this.replayOutbox()
        }
      })
    }
  }

  public registerServiceWorker() {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((registration) => {
          console.log('[PWA] Service Worker registered:', registration.scope)

          registration.onupdatefound = () => {
            const installingWorker = registration.installing
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  this.updateAvailable = true
                  this.notifyListeners()
                }
              }
            }
          }
        }).catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err)
        })
      })
    }
  }

  public async installApp(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false
    }

    this.deferredPrompt.prompt()
    const { outcome } = await this.deferredPrompt.userChoice
    this.deferredPrompt = null
    this.notifyListeners()
    return outcome === 'accepted'
  }

  public applyUpdate() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg?.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' })
          window.location.reload()
        }
      })
    }
  }

  private loadOutbox() {
    try {
      const stored = localStorage.getItem('nuvida_offline_outbox')
      if (stored) this.pendingOutbox = JSON.parse(stored)
    } catch (e) {
      this.pendingOutbox = []
    }
  }

  private saveOutbox() {
    try {
      localStorage.setItem('nuvida_offline_outbox', JSON.stringify(this.pendingOutbox))
    } catch (e) { /* ignore */ }
  }

  public addToOutbox(type: PendingSyncItem['type'], payload: any) {
    const item: PendingSyncItem = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type,
      payload,
      createdAt: new Date().toISOString(),
    }
    this.pendingOutbox.push(item)
    this.saveOutbox()
    this.notifyListeners()

    if (this.isOnline) {
      this.replayOutbox()
    }
  }

  public async replayOutbox(): Promise<number> {
    if (this.pendingOutbox.length === 0 || !this.isOnline) return 0

    const count = this.pendingOutbox.length
    console.log(`[PWA Sync] Replaying ${count} offline items...`)

    this.pendingOutbox = []
    this.saveOutbox()
    this.notifyListeners()
    return count
  }

  public subscribe(listener: PwaListener): () => void {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => fn())
  }
}

export const pwaService = new PwaService()
