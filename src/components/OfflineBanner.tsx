import { useState, useEffect } from 'react'
import { pwaService } from '../services/pwa'

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(pwaService.isOnline)
  const [pendingCount, setPendingCount] = useState(pwaService.pendingOutbox.length)

  useEffect(() => {
    return pwaService.subscribe(() => {
      setIsOnline(pwaService.isOnline)
      setPendingCount(pwaService.pendingOutbox.length)
    })
  }, [])

  if (isOnline && pendingCount === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
        background: isOnline ? '#14432C' : '#D4882A',
        color: '#FFFFFF',
        padding: '8px 16px',
        fontSize: 12.5,
        fontWeight: 600,
        fontFamily: 'var(--font-jakarta)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
        transition: 'all 0.3s ease',
      }}
    >
      <span style={{ fontSize: 14 }}>{isOnline ? '🔄' : '⚡'}</span>
      <span>
        {!isOnline
          ? 'Modo Sin Conexión — Trabajas de forma local. Los cambios se sincronizarán automáticamente al volver a Internet.'
          : `Sincronizando ${pendingCount} cambio(s) pendiente(s) con la nube...`}
      </span>
      {pendingCount > 0 && (
        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontFamily: 'var(--font-jetbrains)' }}>
          {pendingCount} en cola
        </span>
      )}
    </div>
  )
}
