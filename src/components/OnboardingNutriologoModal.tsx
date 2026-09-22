import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'

export default function OnboardingNutriologoModal({ onDone }: { onDone: () => void }) {
  const { currentUser } = useAuth()
  const { organization } = useApp()

  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Step 1: Datos Profesionales
  const [nombre, setNombre] = useState(currentUser?.name || 'Lic. Laura Gómez')
  const [cedula, setCedula] = useState('')
  const [especialidad, setEspecialidad] = useState('Nutrición Clínica y Recomposición Corporal')
  const [universidad, setUniversidad] = useState('Universidad Nacional Autónoma de México')

  // Step 2: Consultorio & Marca
  const [consultorioNombre, setConsultorioNombre] = useState(currentUser?.organizationName || 'Centro Nutricional NuVida')
  const [direccion, setDireccion] = useState('Av. Insurgentes Sur 1458, Col. Del Valle, CDMX')
  const [whatsapp, setWhatsapp] = useState(currentUser?.phone || '+52 55 9876 5432')
  const [moneda, setMoneda] = useState('MXN ($)')

  // Step 3: Membrete de Dietas & Fórmula por Defecto
  const [formulaDefecto, setFormulaDefecto] = useState('Mifflin-St Jeor')
  const [leyendaPdf, setLeyendaPdf] = useState('Atención personalizada con previa cita. Consultorio certificado NuVida.')

  const [loading, setLoading] = useState(false)

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    // Save settings to organization & profile
    organization.name = consultorioNombre
    setLoading(false)
    onDone()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(11, 28, 19, 0.85)',
        backdropFilter: 'blur(6px)',
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
          maxWidth: 540,
          background: '#FFFFFF',
          borderRadius: 20,
          padding: 32,
          boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
          color: '#131210',
        }}
      >
        {/* Header Indicator */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: '#28845A',
              color: '#FFF',
              fontSize: 26,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 8px 20px rgba(40,132,90,0.3)',
            }}
          >
            🩺
          </div>
          <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#E8F5EE', color: '#28845A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Configuración de Primer Ingreso — Paso {step} de 3
          </span>
          <h2 style={{ margin: '8px 0 2px', fontSize: 20, fontWeight: 700, color: '#14432C' }}>
            {step === 1 ? 'Tus Datos Profesionales' : step === 2 ? 'Configuración de tu Consultorio' : 'Membrete & Parámetros Clínicos'}
          </h2>
          <p style={{ margin: 0, fontSize: 12.5, color: '#7C7870' }}>
            Esta información se mostrará en los expedientes, recetas y PDF descargables de tus pacientes.
          </p>
        </div>

        {/* STEP 1: PROFESIONAL */}
        {step === 1 && (
          <form onSubmit={e => { e.preventDefault(); setStep(2) }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#131210', marginBottom: 5 }}>Nombre completo con título profesional *</label>
              <input
                type="text"
                required
                placeholder="Ej. Lic. Laura Gómez Rivas"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0DBD2', fontSize: 13.5, outline: 'none', background: '#F7F6F3' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#131210', marginBottom: 5 }}>Cédula Profesional *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 12849301"
                  value={cedula}
                  onChange={e => setCedula(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0DBD2', fontSize: 13.5, fontFamily: 'var(--font-jetbrains)', outline: 'none', background: '#F7F6F3' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#131210', marginBottom: 5 }}>Especialidad *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Nutrición Clínica"
                  value={especialidad}
                  onChange={e => setEspecialidad(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0DBD2', fontSize: 13.5, outline: 'none', background: '#F7F6F3' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#131210', marginBottom: 5 }}>Universidad de egreso</label>
              <input
                type="text"
                placeholder="Ej. Universidad Nacional Autónoma de México"
                value={universidad}
                onChange={e => setUniversidad(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0DBD2', fontSize: 13.5, outline: 'none', background: '#F7F6F3' }}
              />
            </div>

            <button type="submit" style={{ width: '100%', padding: '12px', background: '#14432C', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: 'pointer', marginTop: 6 }}>
              Siguiente: Datos del Consultorio →
            </button>
          </form>
        )}

        {/* STEP 2: CONSULTORIO & MARCA */}
        {step === 2 && (
          <form onSubmit={e => { e.preventDefault(); setStep(3) }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#131210', marginBottom: 5 }}>Nombre comercial del Consultorio / Clínica *</label>
              <input
                type="text"
                required
                placeholder="Ej. Centro Nutricional NuVida"
                value={consultorioNombre}
                onChange={e => setConsultorioNombre(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0DBD2', fontSize: 13.5, outline: 'none', background: '#F7F6F3' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#131210', marginBottom: 5 }}>Dirección física del consultorio</label>
              <input
                type="text"
                placeholder="Av. Insurgentes Sur 1458, Piso 4, Col. Del Valle, CDMX"
                value={direccion}
                onChange={e => setDireccion(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0DBD2', fontSize: 13.5, outline: 'none', background: '#F7F6F3' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#131210', marginBottom: 5 }}>WhatsApp de atención *</label>
                <input
                  type="tel"
                  required
                  placeholder="+52 55 9876 5432"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0DBD2', fontSize: 13.5, outline: 'none', background: '#F7F6F3' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#131210', marginBottom: 5 }}>Moneda de cobro</label>
                <select
                  value={moneda}
                  onChange={e => setMoneda(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0DBD2', fontSize: 13.5, outline: 'none', background: '#F7F6F3' }}
                >
                  <option>MXN ($)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>COP ($)</option>
                  <option>CLP ($)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <button type="button" onClick={() => setStep(1)} style={{ padding: '11px 16px', background: '#F7F6F3', border: '1px solid #E0DBD2', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
                ← Atrás
              </button>
              <button type="submit" style={{ flex: 1, padding: '12px', background: '#14432C', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}>
                Siguiente: Parámetros Clínicos →
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: PARÁMETROS CLÍNICOS & FINALIZAR */}
        {step === 3 && (
          <form onSubmit={handleFinish} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#131210', marginBottom: 5 }}>Fórmula de Gasto Calórico por defecto</label>
              <select
                value={formulaDefecto}
                onChange={e => setFormulaDefecto(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0DBD2', fontSize: 13.5, outline: 'none', background: '#F7F6F3' }}
              >
                <option>Mifflin-St Jeor (Recomendada)</option>
                <option>Harris-Benedict Revisada</option>
                <option>Katch-McArdle (Basada en % Grasa)</option>
                <option>OMS / FAO</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#131210', marginBottom: 5 }}>Pie de página / Leyenda en PDF de Planes Alimenticios</label>
              <textarea
                rows={3}
                value={leyendaPdf}
                onChange={e => setLeyendaPdf(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0DBD2', fontSize: 13, outline: 'none', background: '#F7F6F3', fontFamily: 'var(--font-jakarta)' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <button type="button" onClick={() => setStep(2)} style={{ padding: '11px 16px', background: '#F7F6F3', border: '1px solid #E0DBD2', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
                ← Atrás
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{ flex: 1, padding: '12px', background: '#28845A', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}
              >
                {loading ? 'Guardando configuración...' : '✓ Guardar e Iniciar Consultorio'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
