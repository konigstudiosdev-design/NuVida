// Push Notification Service

class PushNotificationService {
  public permission: NotificationPermission = typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'

  public async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      this.permission = permission
      return permission === 'granted'
    } catch {
      return false
    }
  }

  public async sendLocalNotification(title: string, options?: NotificationOptions) {
    if (this.permission !== 'granted') return

    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready
      reg.showNotification(title, {
        icon: '/icons/icon-192.svg',
        badge: '/icons/icon-192.svg',
        vibrate: [100, 50, 100],
        ...options,
      } as any)
    } else {
      new Notification(title, options)
    }
  }
}

export const pushService = new PushNotificationService()
