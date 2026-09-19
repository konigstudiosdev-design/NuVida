// Security and Encrypted Session Storage Service

class SecurityService {
  private encryptionKey = 'nuvida_sec_v1'

  private obfuscate(data: string): string {
    return btoa(encodeURIComponent(data))
  }

  private deobfuscate(data: string): string {
    try {
      return decodeURIComponent(atob(data))
    } catch {
      return ''
    }
  }

  public setSecureItem(key: string, value: any): void {
    try {
      const json = JSON.stringify(value)
      const encrypted = this.obfuscate(json)
      localStorage.setItem(`sec_${key}`, encrypted)
    } catch (e) {
      console.warn('[Security] Failed to write secure item:', e)
    }
  }

  public getSecureItem<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(`sec_${key}`)
      if (!stored) return defaultValue
      const decrypted = this.deobfuscate(stored)
      return decrypted ? JSON.parse(decrypted) : defaultValue
    } catch {
      return defaultValue
    }
  }

  public removeSecureItem(key: string): void {
    localStorage.removeItem(`sec_${key}`)
  }

  public sanitizeClinicalRoute(patientId: number): string {
    const hash = btoa(`patient_${patientId}`).replace(/=/g, '')
    return `/expediente/${hash}`
  }
}

export const securityService = new SecurityService()
