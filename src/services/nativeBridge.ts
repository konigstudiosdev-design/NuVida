// Native Bridge Layer for Web, PWA, Electron, Tauri and Capacitor

export interface NativeDeviceCapabilities {
  platform: 'web' | 'ios' | 'android' | 'electron' | 'tauri'
  isElectron: boolean
  hasHaptics: boolean
  hasCamera: boolean
  hasBiometrics: boolean
}

class NativeBridge {
  public capabilities: NativeDeviceCapabilities = {
    platform: typeof window !== 'undefined' && (window as any).electronAPI?.isElectron ? 'electron' : 'web',
    isElectron: typeof window !== 'undefined' && Boolean((window as any).electronAPI?.isElectron),
    hasHaptics: typeof window !== 'undefined' && 'vibrate' in navigator,
    hasCamera: typeof window !== 'undefined' && 'mediaDevices' in navigator,
    hasBiometrics: typeof window !== 'undefined' && 'PublicKeyCredential' in window,
  }

  public triggerHaptic(type: 'light' | 'medium' | 'heavy' = 'light') {
    if (this.capabilities.hasHaptics && navigator.vibrate) {
      const duration = type === 'light' ? 15 : type === 'medium' ? 30 : 50
      navigator.vibrate(duration)
    }
  }

  public async requestCameraPermission(): Promise<boolean> {
    if (!this.capabilities.hasCamera) return false
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(track => track.stop())
      return true
    } catch {
      return false
    }
  }
}

export const nativeBridge = new NativeBridge()
