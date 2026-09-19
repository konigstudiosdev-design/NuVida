// NuVida Pilot Analytics & Activation Tracking Engine

export type PilotEventName =
  | 'app_open'
  | 'onboarding_completed'
  | 'patient_created'
  | 'consultation_created'
  | 'measurement_created'
  | 'mealplan_created'
  | 'appointment_created'
  | 'payment_created'
  | 'patient_portal_opened'
  | 'pwa_installed'
  | 'offline_operation'
  | 'sync_completed'
  | 'feedback_submitted'
  | 'friction_detected'

export interface PilotErrorLog {
  id: string
  version: string
  platform: string
  module: string
  message: string
  timestamp: string
}

export interface PilotFeedbackEntry {
  id: string
  type: 'bug' | 'suggestion' | 'help' | 'rating'
  intent: string
  details: string
  module: string
  rating?: number
  timestamp: string
}

class PilotAnalyticsService {
  private eventsKey = 'nuvida_pilot_events'
  private errorsKey = 'nuvida_pilot_errors'
  private feedbackKey = 'nuvida_pilot_feedback'

  public trackEvent(eventName: PilotEventName, payload?: Record<string, any>): void {
    try {
      const eventEntry = {
        name: eventName,
        timestamp: new Date().toISOString(),
        payload: payload || {},
      }
      const existing = this.getEvents()
      localStorage.setItem(this.eventsKey, JSON.stringify([eventEntry, ...existing.slice(0, 99)]))
    } catch {
      /* ignore */
    }
  }

  public getEvents(): any[] {
    try {
      const stored = localStorage.getItem(this.eventsKey)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  public logError(module: string, message: string): void {
    const errorEntry: PilotErrorLog = {
      id: `err_${Date.now()}`,
      version: 'NuVida v1.0.0',
      platform: navigator.platform,
      module,
      message,
      timestamp: new Date().toISOString(),
    }
    try {
      const existing = this.getErrors()
      localStorage.setItem(this.errorsKey, JSON.stringify([errorEntry, ...existing.slice(0, 49)]))
    } catch {
      /* ignore */
    }
  }

  public getErrors(): PilotErrorLog[] {
    try {
      const stored = localStorage.getItem(this.errorsKey)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  public submitFeedback(feedback: Omit<PilotFeedbackEntry, 'id' | 'timestamp'>): void {
    const entry: PilotFeedbackEntry = {
      ...feedback,
      id: `fb_${Date.now()}`,
      timestamp: new Date().toISOString(),
    }
    try {
      const existing = this.getFeedback()
      localStorage.setItem(this.feedbackKey, JSON.stringify([entry, ...existing.slice(0, 49)]))
    } catch {
      /* ignore */
    }
  }

  public getFeedback(): PilotFeedbackEntry[] {
    try {
      const stored = localStorage.getItem(this.feedbackKey)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  public isUserActivated(hasOnboarding: boolean, patientCount: number, consultationCount: number): boolean {
    return hasOnboarding && patientCount > 0 && consultationCount > 0
  }
}

export const pilotAnalytics = new PilotAnalyticsService()
