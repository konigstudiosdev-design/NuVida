import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function RegistroNutriologo({
  onSuccess,
  onGoToLogin,
}: {
  onSuccess: () => void
  onGoToLogin: () => void
}) {
  const { registerNutriologo, loginWithGoogle } = useAuth()

  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [orgName, setOrgName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) {
      setErrorMessage('Completa tu nombre y correo electrónico')
      return
    }
    setErrorMessage(null)
    setStep(2)
  }

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPass) {
      setErrorMessage('Las contraseñas no coinciden')
      return
    }
    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    setErrorMessage(null)
    await registerNutriologo({ name, email, phone, orgName })
    setLoading(false)
    onSuccess()
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    await loginWithGoogle('nutriologo')
    setLoading(false)
    onSuccess()
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: '#14432C',
        color: '#FFFFFF',
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
          maxWidth: 520,
          background: '#FFFFFF',
          color: '#131210',
          borderRadius: 20,
          padding: 32,
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 11.5, padding: '3px 10px', borderRadius: 20, background: '#E8F5EE', color: '#28845A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Registro para Nutriólogos
          </span>
          <h2 style={{ margin: '8px 0 2px', fontSize: 22, fontWeight: 700, color: '#14432C', letterSpacing: '-0.02em' }}>
            Crea tu Consultorio en NuVida
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: '#7C7870' }}>
            Te registrarás como Administrador y Nutriólogo Titular de tu Organización.
          </p>
        </div>

        {errorMessage && (
          <div style={{ padding: '10px 14px', background: '#FDECEA', border: '1px solid #F5C6CB', borderRadius: 8, color: '#E85C45', fontSize: 12.5, marginBottom: 16 }}>
            ⚠️ {errorMessage}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleNextStep} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <button
              type="button"
              onClick={handleGoogleSignup}
              style={{
                width: '100%',
                padding: '11px',
                background: '#FFFFFF',
                border: '1px solid #E0DBD2',
                borderRadius: 10,
                fontSize: 13.5,
                fontWeight: 600,
                color: '#131210',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              <span>🌐</span> Registrarse con Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '2px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#E0DBD2' }} />
              <span style={{ fontSize: 11, color: '#7C7870', fontWeight: 600 }}>O REGÍSTRATE CON CORREO</span>
              <div style={{ flex: 1, height: 1, background: '#E0DBD2' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#131210', marginBottom: 4 }}>Nombre completo con título *</label>
              <input
                type="text"
                required
                placeholder="Ej. Lic. Laura Gómez Rivas"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0DBD2', fontSize: 13.5, outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#131210', marginBottom: 4 }}>Correo electrónico profesional *</label>
              <input
                type="email"
                required
                placeholder="laura.gomez@nuvida.app"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0DBD2', fontSize: 13.5, outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#131210', marginBottom: 4 }}>Nombre de tu Consultorio / Clínica</label>
              <input
                type="text"
                placeholder="Ej. Centro Nutricional Del Valle"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0DBD2', fontSize: 13.5, outline: 'none' }}
              />
            </div>

            <button type="submit" style={{ width: '100%', padding: '11px', background: '#14432C', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', marginTop: 6 }}>
              Continuar al Paso 2 →
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleCompleteRegistration} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#131210', marginBottom: 4 }}>Teléfono (WhatsApp)</label>
              <input
                type="tel"
                placeholder="+52 55 9876 5432"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0DBD2', fontSize: 13.5, outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#131210', marginBottom: 4 }}>Contraseña *</label>
              <input
                type="password"
                required
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0DBD2', fontSize: 13.5, outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#131210', marginBottom: 4 }}>Confirmar Contraseña *</label>
              <input
                type="password"
                required
                placeholder="Repite tu contraseña"
                value={confirmPass}
                onChange={e => setConfirmPass(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0DBD2', fontSize: 13.5, outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button type="button" onClick={() => setStep(1)} style={{ padding: '11px 16px', background: '#F7F6F3', border: '1px solid #E0DBD2', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
                ← Atrás
              </button>
              <button type="submit" disabled={loading} style={{ flex: 1, padding: '11px', background: '#28845A', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
                {loading ? 'Creando organización...' : 'Finalizar y Crear Consultorio'}
              </button>
            </div>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: 20, paddingTop: 16, borderTop: '1px solid #E0DBD2' }}>
          <span style={{ fontSize: 12, color: '#7C7870' }}>¿Ya tienes cuenta? </span>
          <button onClick={onGoToLogin} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#14432C', fontSize: 12.5, fontWeight: 700 }}>
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  )
}
