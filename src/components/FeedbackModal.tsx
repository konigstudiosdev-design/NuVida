import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function FeedbackModal({ onClose }: { onClose: () => void }) {
  const { currentUser } = useAuth()
  const [type, setType] = useState<'bug' | 'suggestion' | 'help' | 'rating'>('bug')
  const [comments, setComments] = useState('')
  const [rating, setRating] = useState(5)
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comments.trim()) return

    const feedbackPayload = {
      type,
      comments,
      rating,
      user: currentUser?.email || 'Anónimo',
      org: currentUser?.organizationName || 'Sin Org',
      appVersion: 'NuVida v1.0.0',
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      timestamp: new Date().toISOString(),
    }

    console.log('[NuVida Pilot Feedback Sent]:', feedbackPayload)
    setSent(true)
    setTimeout(() => {
      onClose()
    }, 1800)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(14, 28, 20, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        fontFamily: 'var(--font-jakarta)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          background: '#FFFFFF',
          borderRadius: 20,
          padding: 28,
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
          color: '#131210',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#14432C' }}>
            💬 Enviar Comentarios del Piloto
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888' }}>✕</button>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#28845A' }}>¡Gracias por tus comentarios!</div>
            <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Tu retroalimentación nos ayuda a perfeccionar NuVida 1.0.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 6, background: '#F7F6F3', padding: 4, borderRadius: 10, border: '1px solid #E0DBD2' }}>
              {[
                { id: 'bug', label: '🐛 Reportar Error' },
                { id: 'suggestion', label: '💡 Sugerencia' },
                { id: 'help', label: '❓ Ayuda' },
                { id: 'rating', label: '⭐ Valoración' },
              ].map(t => {
                const isActive = type === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id as any)}
                    style={{
                      flex: 1,
                      padding: '7px 0',
                      borderRadius: 7,
                      border: 'none',
                      background: isActive ? '#14432C' : 'transparent',
                      color: isActive ? '#FFF' : '#666',
                      fontSize: 11.5,
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>

            {type === 'rating' && (
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#131210', marginBottom: 6 }}>Calificación general de la experiencia (1 a 5 estrellas)</label>
                <div style={{ display: 'flex', gap: 10, fontSize: 24, cursor: 'pointer', justifyContent: 'center' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} onClick={() => setRating(star)} style={{ color: star <= rating ? '#E89D2A' : '#CCC' }}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#131210', marginBottom: 6 }}>Detalles del comentario *</label>
              <textarea
                required
                rows={4}
                placeholder="Describe tu experiencia, problema o sugerencia..."
                value={comments}
                onChange={e => setComments(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0DBD2', fontSize: 13, outline: 'none', background: '#F7F6F3', fontFamily: 'var(--font-jakarta)' }}
              />
            </div>

            <div style={{ fontSize: 11, color: '#888', background: '#F7F6F3', padding: 8, borderRadius: 6, border: '1px solid #E0DBD2' }}>
              ℹ️ Se adjuntará automáticamente tu versión de app (NuVida v1.0.0) y navegador para diagnóstico, sin compartir datos clínicos confidenciales.
            </div>

            <button type="submit" style={{ padding: '11px', background: '#14432C', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}>
              Enviar Retroalimentación
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
