import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function CambiarContrasenaModal({ onDone }: { onDone: () => void }) {
  const { currentUser, changeTempPassword } = useAuth()

  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPass !== confirmPass) {
      setErrorMessage('Las contraseñas no coinciden')
      return
    }
    if (newPass.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    await changeTempPassword(newPass)
    setLoading(false)
    onDone()
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
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#FFFFFF',
          borderRadius: 16,
          padding: 28,
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
          fontFamily: 'var(--font-jakarta)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#14432C' }}>
            Cambio de Contraseña Requerido
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#7C7870' }}>
            Es tu primer inicio de sesión con credenciales temporales. Por seguridad, crea tu contraseña personal.
          </p>
        </div>

        {errorMessage && (
          <div style={{ padding: '8px 12px', background: '#FDECEA', border: '1px solid #F5C6CB', borderRadius: 8, color: '#E85C45', fontSize: 12, marginBottom: 14 }}>
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#131210', marginBottom: 4 }}>Nueva Contraseña *</label>
            <input
              type="password"
              required
              placeholder="Mínimo 6 caracteres"
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0DBD2', fontSize: 13.5, outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#131210', marginBottom: 4 }}>Confirmar Nueva Contraseña *</label>
            <input
              type="password"
              required
              placeholder="Repite la contraseña"
              value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0DBD2', fontSize: 13.5, outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '11px',
              background: '#14432C',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 8,
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: 6,
            }}
          >
            {loading ? 'Actualizando...' : 'Guardar Nueva Contraseña & Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
