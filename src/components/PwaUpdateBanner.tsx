import { useState, useEffect } from 'react'
import { pwaService } from '../services/pwa'

export default function PwaUpdateBanner() {
  const [updateAvailable, setUpdateAvailable] = useState(pwaService.updateAvailable)

  useEffect(() => {
    return pwaService.subscribe(() => {
      setUpdateAvailable(pwaService.updateAvailable)
    })
  }, [])

  if (!updateAvailable) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 10001,
        background: '#14432C',
        color: '#FFFFFF',
        padding: '16px 20px',
        borderRadius: 12,
        boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        border: '1px solid #28845A',
        maxWidth: 380,
      }}
    >
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 700 }}>¡Nueva versión disponible!</div>
        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>Actualiza NuVida para obtener las últimas mejoras.</div>
      </div>
      <button
        onClick={() => pwaService.applyUpdate()}
        style={{
          padding: '8px 14px',
          background: 'var(--accent)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: 8,
          fontSize: 12.5,
          fontWeight: 700,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Actualizar
      </button>
    </div>
  )
}
