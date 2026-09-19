// NuVida Production Feature Flags Manager
export interface FeatureFlags {
  AI_COPILOT: boolean
  WHATSAPP_AUTO: boolean
  PATIENT_PORTAL: boolean
  PUSH_NOTIFICATIONS: boolean
  BETA_FEATURES: boolean
}

class FeatureFlagService {
  private key = 'nuvida_feature_flags'

  private defaults: FeatureFlags = {
    AI_COPILOT: true,
    WHATSAPP_AUTO: true,
    PATIENT_PORTAL: true,
    PUSH_NOTIFICATIONS: true,
    BETA_FEATURES: false,
  }

  public getFlags(): FeatureFlags {
    try {
      const stored = localStorage.getItem(this.key)
      return stored ? { ...this.defaults, ...JSON.parse(stored) } : this.defaults
    } catch {
      return this.defaults
    }
  }

  public isEnabled(flag: keyof FeatureFlags): boolean {
    return this.getFlags()[flag] ?? false
  }

  public setFlag(flag: keyof FeatureFlags, enabled: boolean): void {
    const current = this.getFlags()
    const updated = { ...current, [flag]: enabled }
    localStorage.setItem(this.key, JSON.stringify(updated))
  }
}

export const featureFlags = new FeatureFlagService()
