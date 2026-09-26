import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginView({
  onSuccess,
  onGoToRegister,
}: {
  onSuccess: () => void
  onGoToRegister: () => void
}) {
  const { loginWithGoogle, loginWithCredentials, sendPhoneOtp, verifyPhoneOtp } = useAuth()

  const [subMethod, setSubMethod] = useState<'google' | 'email' | 'phone'>('google')

  // Form Fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  // Status & Feedback
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    setLoading(true)
    setErrorMessage(null)
    const res = await loginWithGoogle('nutriologo')
    setLoading(false)
    if (res.success) {
      onSuccess()
    } else {
      setErrorMessage(res.message || 'Error al autenticar con Google')
    }
  }

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    if (!email || !password) {
      setLoading(false)
      setErrorMessage('Ingresa tu usuario/correo y contraseña')
      return
    }

    const res = await loginWithCredentials(email, password)
    setLoading(false)
    if (res.success) {
      onSuccess()
    } else {
      setErrorMessage(res.message || 'Credenciales incorrectas. Verifica tus datos.')
    }
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone) return

    setLoading(true)
    setErrorMessage(null)
    const res = await sendPhoneOtp(phone, 'recaptcha-container')
    setLoading(false)

    if (res.success) {
      setOtpSent(true)
    } else {
      setErrorMessage(res.message || 'No se pudo enviar el SMS. Verifica tu número.')
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    const res = await verifyPhoneOtp(otpCode)
    setLoading(false)
    if (res.success) {
      onSuccess()
    } else {
      setErrorMessage(res.message || 'Código OTP inválido.')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'radial-gradient(circle at 50% 30%, #174229 0%, #0B1C13 100%)',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: 'var(--font-jakarta)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#FFFFFF',
          color: '#131210',
          borderRadius: 24,
          padding: '40px 32px 32px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
        }}
      >
        {/* Brand Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <img
            src="/nuvida-logo.png"
            alt="NuVida Logo"
            style={{
              width: 58,
              height: 58,
              borderRadius: 16,
              objectFit: 'contain',
              margin: '0 auto 12px',
              filter: 'drop-shadow(0 6px 14px rgba(40,132,90,0.25))',
            }}
          />
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#14432C', letterSpacing: '-0.03em' }}>
            Bienvenido a NuVida
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#7C7870' }}>
            Todo tu consultorio nutricional, en un solo lugar.
          </p>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div style={{ padding: '10px 14px', background: '#FDECEA', border: '1px solid #F5C6CB', borderRadius: 8, color: '#E85C45', fontSize: 12.5, marginBottom: 16, lineHeight: 1.4 }}>
            ⚠️ {errorMessage}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Minimalist Sub-method Selector Pills */}
          <div style={{ display: 'flex', background: '#F7F6F3', borderRadius: 8, padding: 3, border: '1px solid #E0DBD2' }}>
            {[
              { id: 'google', label: 'Google' },
              { id: 'email', label: 'Correo / Usuario' },
              { id: 'phone', label: 'Teléfono' },
            ].map(m => {
              const isSubActive = subMethod === m.id
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSubMethod(m.id as any)}
                  style={{
                    flex: 1,
                    padding: '6px 0',
                    borderRadius: 6,
                    border: 'none',
                    background: isSubActive ? '#FFFFFF' : 'transparent',
                    color: isSubActive ? '#14432C' : '#7C7870',
                    fontSize: 12,
                    fontWeight: isSubActive ? 700 : 500,
                    cursor: 'pointer',
                    boxShadow: isSubActive ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {m.label}
                </button>
              )
            })}
          </div>

          {/* Google Login */}
          {subMethod === 'google' && (
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
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
                gap: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.15s ease',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Continuar con Google
            </button>
          )}

          {/* Email / Username Login Form */}
          {subMethod === 'email' && (
            <form onSubmit={handleCredentialsLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#131210', marginBottom: 5 }}>Correo o Usuario</label>
                <input
                  type="text"
                  required
                  className="input-focus"
                  placeholder="ej. laura.gomez@nuvida.app"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0DBD2', fontSize: 13.5, outline: 'none', background: '#F7F6F3' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#131210', marginBottom: 5 }}>Contraseña</label>
                <input
                  type="password"
                  required
                  className="input-focus"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0DBD2', fontSize: 13.5, outline: 'none', background: '#F7F6F3' }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '12px', background: '#14432C', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: 'pointer', marginTop: 4 }}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>
          )}

          {/* Phone OTP Login */}
          {subMethod === 'phone' && (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#131210', marginBottom: 5 }}>Teléfono móvil (SMS)</label>
                    <input
                      type="tel"
                      required
                      className="input-focus"
                      placeholder="+52 55 9876 5432"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0DBD2', fontSize: 13.5, outline: 'none', background: '#F7F6F3' }}
                    />
                    <p style={{ fontSize: 11, color: '#9CA3AF', margin: '4px 0 0' }}>Incluye el código de tu país (ej. +52)</p>
                  </div>

                  {/* Invisible Recaptcha Container for Firebase */}
                  <div id="recaptcha-container"></div>

                  <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#14432C', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}>
                    {loading ? 'Enviando SMS...' : 'Recibir código por SMS'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#131210', marginBottom: 5 }}>Código SMS enviado a {phone}</label>
                    <input
                      type="text"
                      required
                      className="input-focus"
                      placeholder="Ingresa 123456"
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0DBD2', fontSize: 15, fontFamily: 'var(--font-jetbrains)', outline: 'none', textAlign: 'center', letterSpacing: '0.2em' }}
                    />
                  </div>
                  <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#28845A', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}>
                    {loading ? 'Verificando...' : 'Verificar e Ingresar'}
                  </button>
                </form>
              )}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 12, paddingTop: 14, borderTop: '1px solid #E0DBD2' }}>
            <span style={{ fontSize: 12.5, color: '#7C7870' }}>¿Aún no tienes consultorio registrado? </span>
            <button onClick={onGoToRegister} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#28845A', fontSize: 12.5, fontWeight: 700 }}>
              Crear cuenta como Nutriólogo
            </button>
          </div>
        </div>

        {/* Footer Support Links */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 16, borderTop: '1px solid #E0DBD2', fontSize: 12 }}>
          <button onClick={() => alert('Para restablecer tu contraseña:\n\n• Ingresa tu correo para recibir un enlace de recuperación.\n• Si eres Equipo o Paciente: Contacta al Nutriólogo administrador para restablecer tus credenciales.')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7C7870' }}>
            ¿Olvidaste tu contraseña?
          </button>
          <button onClick={() => alert('Ayuda para ingresar:\n\nSoporte NuVida 24/7 disponible vía WhatsApp: +52 55 9876 5432 o al correo soporte@nuvida.app')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#28845A', fontWeight: 600 }}>
            ¿Necesitas ayuda?
          </button>
        </div>
      </div>
    </div>
  )
}

