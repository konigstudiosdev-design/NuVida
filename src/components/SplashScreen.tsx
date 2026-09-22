import { useState, useEffect } from 'react'

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setFading(true), 1300)
    const timer2 = setTimeout(() => onFinish(), 1600)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [onFinish])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#0E2418',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.3s ease',
        fontFamily: 'var(--font-jakarta)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <img
          src="/nuvida-logotipo.png"
          alt="NuVida Logotipo"
          style={{
            maxHeight: 110,
            maxWidth: 280,
            objectFit: 'contain',
            filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.4))',
          }}
        />
        <div style={{ fontSize: 13, color: '#A8C4B4', letterSpacing: '0.02em', textAlign: 'center' }}>
          Todo tu consultorio nutricional, en un solo lugar
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 40, fontSize: 11, color: '#A8C4B4', opacity: 0.7 }}>
        Cargando consultorio...
      </div>
    </div>
  )
}
