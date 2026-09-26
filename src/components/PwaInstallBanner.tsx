import { useState, useEffect } from 'react'
import { pwaService } from '../services/pwa'

export default function PwaInstallBanner() {
  const [isInstallable, setIsInstallable] = useState(pwaService.isInstallable)
  const [isInstalled, setIsInstalled] = useState(pwaService.isInstalled)

  useEffect(() => {
    return pwaService.subscribe(() => {
      setIsInstallable(pwaService.isInstallable)
      setIsInstalled(pwaService.isInstalled)
    })
  }, [])

  if (!isInstallable || isInstalled) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        background: '#FFFFFF',
        color: '#131210',
        padding: '12px 16px',
        borderRadius: 16,
        fontSize: 13.5,
        fontWeight: 500,
        fontFamily: 'var(--font-jakarta)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        width: 'calc(100% - 32px)',
        maxWidth: 400,
        boxShadow: '0 8px 30px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)',
        animation: 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <style>
        {`
          @keyframes slideDown {
            from { transform: translate(-50%, -120%); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
          }
        `}
      </style>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src="/nuvida-logo.png" alt="NuVida" style={{ width: 36, height: 36, borderRadius: 8 }} />
        <div>
          <div style={{ fontWeight: 700, color: '#14432C', marginBottom: 2 }}>Instalar NuVida</div>
          <div style={{ fontSize: 11.5, color: '#7C7870' }}>Acceso rápido desde tu pantalla</div>
        </div>
      </div>

      <button
        onClick={() => pwaService.installApp()}
        style={{
          background: '#28845A',
          color: '#FFF',
          border: 'none',
          padding: '8px 16px',
          borderRadius: 20,
          fontWeight: 700,
          fontSize: 12,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(40,132,90,0.3)',
        }}
      >
        Instalar
      </button>
    </div>
  )
}
