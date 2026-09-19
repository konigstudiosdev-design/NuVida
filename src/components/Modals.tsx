import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import type { PageId } from '../App'

interface ModalsProps {
  onNavigate: (page: PageId) => void
}

export default function Modals({ onNavigate }: ModalsProps) {
  const {
    activeModal,
    closeModal,
    patients,
    plans,
    foods,
    addPatient,
    addConsultation,
    addAnthropometry,
    addMealPlan,
    addFood,
    addAppointment,
    addPayment,
    selectedPatientId,
    selectedPlanForPdf,
    openModal,
  } = useApp()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        openModal('command-palette')
      }
      if (e.key === 'Escape') {
        closeModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!activeModal) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(14, 28, 20, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={closeModal}
    >
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: activeModal === 'expediente' ? 880 : activeModal === 'pdf-preview' ? 780 : 560 }}>
        {activeModal === 'nuevo-paciente' && <NuevoPacienteModal onSave={addPatient} onClose={closeModal} />}
        {activeModal === 'nueva-consulta' && <NuevaConsultaModal patients={patients} plans={plans} onSave={addConsultation} onClose={closeModal} />}
        {activeModal === 'capturar-antropometria' && <CapturarAntropometriaModal patients={patients} onSave={addAnthropometry} onClose={closeModal} />}
        {activeModal === 'nuevo-plan' && <NuevoPlanModal patients={patients} foods={foods} onSave={addMealPlan} onClose={closeModal} />}
        {activeModal === 'nuevo-alimento' && <NuevoAlimentoModal onSave={addFood} onClose={closeModal} />}
        {activeModal === 'nueva-cita' && <NuevaCitaModal patients={patients} onSave={addAppointment} onClose={closeModal} />}
        {activeModal === 'registrar-pago' && <RegistrarPagoModal patients={patients} onSave={addPayment} onClose={closeModal} />}
        {activeModal === 'command-palette' && <CommandPaletteModal patients={patients} onNavigate={onNavigate} onClose={closeModal} openModal={openModal} />}
        {activeModal === 'expediente' && selectedPatientId && <ExpedienteDrawer patient={patients.find(p => p.id === selectedPatientId)} onClose={closeModal} />}
        {activeModal === 'pdf-preview' && selectedPlanForPdf && <PdfPreviewModal plan={selectedPlanForPdf} onClose={closeModal} />}
        {activeModal === 'asistente-ia' && <AsistenteIaQuickModal patients={patients} onClose={closeModal} />}
        {activeModal === 'upgrade-plan' && <UpgradePlanModal onClose={closeModal} />}
      </div>
    </div>
  )
}

// 1. NUEVO PACIENTE MODAL
function NuevoPacienteModal({ onSave, onClose }: { onSave: (p: any) => void; onClose: () => void }) {
  const [name, setName] = useState('')
  const [dob, setDob] = useState('1994-06-15')
  const [gender, setGender] = useState<'Femenino' | 'Masculino'>('Femenino')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [occupation, setOccupation] = useState('Profesionista')
  const [goal, setGoal] = useState('Pérdida de peso')
  const [weight, setWeight] = useState('70')
  const [height, setHeight] = useState('165')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const w = parseFloat(weight) || 70
    const h = (parseFloat(height) || 165) / 100
    const imc = parseFloat((w / (h * h)).toFixed(1))

    onSave({
      name,
      dob,
      age: 32,
      gender,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      phone: phone || '+52 55 0000 0000',
      whatsapp: whatsapp || phone || '+52 55 0000 0000',
      occupation,
      goal,
      lastConsult: 'Hoy',
      nextConsult: 'En 14 días',
      status: 'activo',
      progress: 0,
      imc,
      weight: w,
      height: parseFloat(height) || 165,
      sessions: 1,
    })
  }

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Nuevo Paciente — NuVida</h3>
          <p style={{ margin: '2px 0 0', fontSize: 12.5, color: 'var(--muted-foreground)' }}>Crea la ficha del paciente para iniciar seguimiento clínico.</p>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--muted-foreground)' }}>✕</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Nombre completo *</label>
            <input required placeholder="Ej. Ana Patricia Flores" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Ocupación</label>
            <input value={occupation} onChange={e => setOccupation(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Fecha de nacimiento</label>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jetbrains)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Género</label>
            <select value={gender} onChange={e => setGender(e.target.value as any)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)' }}>
              <option>Femenino</option>
              <option>Masculino</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Objetivo Principal</label>
            <select value={goal} onChange={e => setGoal(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)' }}>
              <option>Pérdida de peso</option>
              <option>Hipertrofia muscular</option>
              <option>Control diabetes</option>
              <option>Control hipertensión</option>
              <option>Rendimiento deportivo</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Correo Electrónico</label>
            <input type="email" placeholder="paciente@correo.com" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>WhatsApp / Celular</label>
            <input placeholder="+52 55..." value={phone} onChange={e => { setPhone(e.target.value); setWhatsapp(e.target.value); }} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Peso Inicial (kg)</label>
            <input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jetbrains)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Estatura (cm)</label>
            <input type="number" value={height} onChange={e => setHeight(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jetbrains)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
          <button type="button" onClick={onClose} style={{ padding: '9px 18px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>Cancelar</button>
          <button type="submit" style={{ padding: '9px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>Guardar Ficha del Paciente</button>
        </div>
      </form>
    </div>
  )
}

// 2. NUEVA CONSULTA MODAL
function NuevaConsultaModal({ patients, plans, onSave, onClose }: { patients: any[]; plans: any[]; onSave: (c: any) => void; onClose: () => void }) {
  const [patientId, setPatientId] = useState(patients[0]?.id || 1)
  const [type, setType] = useState<'Seguimiento' | 'Primera consulta' | 'Evaluación antropométrica'>('Seguimiento')
  const [motivo, setMotivo] = useState('Revisión mensual de progreso')
  const [evolucion, setEvolucion] = useState('Paciente muestra excelente respuesta a la estrategia calórica asignada.')
  const [peso, setPeso] = useState('70.5')
  const [obs, setObs] = useState('')
  const [planName, setPlanName] = useState(plans[0]?.name || 'Plan Recomposición Corporal')

  const patient = patients.find(p => p.id === Number(patientId)) || patients[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const w = parseFloat(peso) || 70.0
    const h = (patient?.height || 165) / 100
    const imc = parseFloat((w / (h * h)).toFixed(1))

    onSave({
      patientId: patient.id,
      patientName: patient.name,
      date: 'Hoy',
      time: '12:00',
      type,
      motivo,
      evolucion,
      adherenciaPct: 88,
      dificultades: 'Ninguna reportada',
      observaciones: obs || 'Consulta completada satisfactoriamente.',
      recomendaciones: ['Mantener hidratación', 'Ajuste calórico sostenido'],
      objetivosProximaConsulta: 'Reducir 1.0 kg de masa grasa',
      proximaConsultaFecha: '2026-10-02',
      pesoKg: w,
      imc,
      planName,
      status: 'completada',
      deltaPeso: '-0.8 kg',
    })
  }

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Registrar Consulta Clínica</h3>
          <p style={{ margin: '2px 0 0', fontSize: 12.5, color: 'var(--muted-foreground)' }}>Captura motivo, evolución, observaciones y plan asignado.</p>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--muted-foreground)' }}>✕</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Paciente</label>
            <select value={patientId} onChange={e => setPatientId(Number(e.target.value))} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)' }}>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Tipo de Consulta</label>
            <select value={type} onChange={e => setType(e.target.value as any)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)' }}>
              <option>Seguimiento</option>
              <option>Primera consulta</option>
              <option>Evaluación antropométrica</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Motivo de Consulta</label>
            <input value={motivo} onChange={e => setMotivo(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Peso Registrado (kg)</label>
            <input type="number" step="0.1" value={peso} onChange={e => setPeso(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, fontFamily: 'var(--font-jetbrains)' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Evolución Paciente & Adherencia</label>
          <input value={evolucion} onChange={e => setEvolucion(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Observaciones y Recomendaciones Clínicas</label>
          <textarea rows={3} placeholder="Instrucciones para el paciente..." value={obs} onChange={e => setObs(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)', resize: 'vertical' }} />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
          <button type="button" onClick={onClose} style={{ padding: '9px 18px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>Cancelar</button>
          <button type="submit" style={{ padding: '9px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>Guardar Consulta en Expediente</button>
        </div>
      </form>
    </div>
  )
}

// 3. CAPTURAR ANTROPOMETRÍA MODAL
function CapturarAntropometriaModal({ patients, onSave, onClose }: { patients: any[]; onSave: (a: any) => void; onClose: () => void }) {
  const [patientId, setPatientId] = useState(patients[0]?.id || 1)
  const [peso, setPeso] = useState('68.4')
  const [grasa, setGrasa] = useState('28.2')
  const [musculo, setMusculo] = useState('45.5')
  const [cintura, setCintura] = useState('78')
  const [cadera, setCadera] = useState('98')
  const [brazo, setBrazo] = useState('28.5')
  const [muslo, setMuslo] = useState('56')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const p = patients.find(pat => pat.id === Number(patientId)) || patients[0]
    const w = parseFloat(peso) || 70
    const h = (p?.height || 165) / 100
    const imc = parseFloat((w / (h * h)).toFixed(1))

    onSave({
      patientId: p.id,
      date: 'Hoy',
      pesoKg: w,
      alturaCm: p?.height || 165,
      imc,
      grasaPct: parseFloat(grasa) || 28,
      masaGrasaKg: parseFloat(((w * parseFloat(grasa)) / 100).toFixed(1)),
      masaMuscularKg: parseFloat(musculo) || 45,
      masaLibreGrasaKg: parseFloat((w - (w * parseFloat(grasa)) / 100).toFixed(1)),
      aguaCorporalPct: 53.4,
      cinturaCm: parseFloat(cintura) || 78,
      caderaCm: parseFloat(cadera) || 98,
      brazoCm: parseFloat(brazo) || 28,
      musloCm: parseFloat(muslo) || 56,
      pechoCm: 90,
    })
  }

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Capturar Medición Antropométrica</h3>
          <p style={{ margin: '2px 0 0', fontSize: 12.5, color: 'var(--muted-foreground)' }}>Registra pliegues, perímetros y composición corporal.</p>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--muted-foreground)' }}>✕</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Paciente</label>
          <select value={patientId} onChange={e => setPatientId(Number(e.target.value))} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)' }}>
            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 2 }}>Peso (kg)</label>
            <input type="number" step="0.1" value={peso} onChange={e => setPeso(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13, fontFamily: 'var(--font-jetbrains)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 2 }}>% Grasa</label>
            <input type="number" step="0.1" value={grasa} onChange={e => setGrasa(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13, fontFamily: 'var(--font-jetbrains)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 2 }}>Masa Muscular (kg)</label>
            <input type="number" step="0.1" value={musculo} onChange={e => setMusculo(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13, fontFamily: 'var(--font-jetbrains)' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 2 }}>Cintura (cm)</label>
            <input type="number" value={cintura} onChange={e => setCintura(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13, fontFamily: 'var(--font-jetbrains)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 2 }}>Cadera (cm)</label>
            <input type="number" value={cadera} onChange={e => setCadera(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13, fontFamily: 'var(--font-jetbrains)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 2 }}>Brazo (cm)</label>
            <input type="number" value={brazo} onChange={e => setBrazo(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13, fontFamily: 'var(--font-jetbrains)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 2 }}>Muslo (cm)</label>
            <input type="number" value={muslo} onChange={e => setMuslo(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13, fontFamily: 'var(--font-jetbrains)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
          <button type="button" onClick={onClose} style={{ padding: '9px 18px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>Cancelar</button>
          <button type="submit" style={{ padding: '9px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>Guardar Medición</button>
        </div>
      </form>
    </div>
  )
}

// 4. NUEVO PLAN MODAL
function NuevoPlanModal({ patients, foods, onSave, onClose }: { patients: any[]; foods: any[]; onSave: (p: any) => void; onClose: () => void }) {
  const [name, setName] = useState('Plan Recomposición Corporal')
  const [patientId, setPatientId] = useState(patients[0]?.id || 1)
  const [kcal, setKcal] = useState(1600)
  const [p, setP] = useState(120)
  const [c, setC] = useState(160)
  const [g, setG] = useState(50)

  const patient = patients.find(pat => pat.id === Number(patientId)) || patients[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      patientId: patient.id,
      patientName: patient.name,
      kcal,
      macros: { p, c, g, fibra: 25 },
      since: 'Hoy',
      until: '30 días',
      status: 'activo',
      weeklyMenu: [
        {
          dayName: 'Lunes',
          meals: [
            { name: 'Desayuno', time: '07:30', foods: [{ foodName: 'Avena integral', amount: '40g', kcal: 155, p: 6, c: 26, g: 3 }] },
            { name: 'Comida', time: '13:30', foods: [{ foodName: 'Pechuga de pollo', amount: '150g', kcal: 247, p: 46, c: 0, g: 5 }] },
          ],
        },
      ],
    })
  }

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Diseñador de Plan Nutricional</h3>
          <p style={{ margin: '2px 0 0', fontSize: 12.5, color: 'var(--muted-foreground)' }}>Define requerimiento energético y distribución de macronutrientes.</p>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--muted-foreground)' }}>✕</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Nombre del Plan</label>
            <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Paciente Asignado</label>
            <select value={patientId} onChange={e => setPatientId(Number(e.target.value))} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)' }}>
              {patients.map(pat => <option key={pat.id} value={pat.id}>{pat.name}</option>)}
            </select>
          </div>
        </div>

        <div style={{ background: 'var(--muted)', borderRadius: 10, padding: 18, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>Meta Calórica & Macronutrientes</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-jetbrains)' }}>{p * 4 + c * 4 + g * 9} kcal calculadas</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 2 }}>Kcal Meta</label>
              <input type="number" value={kcal} onChange={e => setKcal(Number(e.target.value))} style={{ width: '100%', padding: '7px 9px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--card)', fontSize: 13.5, fontFamily: 'var(--font-jetbrains)', fontWeight: 700 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 2 }}>Prot (g)</label>
              <input type="number" value={p} onChange={e => setP(Number(e.target.value))} style={{ width: '100%', padding: '7px 9px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--card)', fontSize: 13.5, fontFamily: 'var(--font-jetbrains)', fontWeight: 700, color: '#28845A' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 2 }}>Carbs (g)</label>
              <input type="number" value={c} onChange={e => setC(Number(e.target.value))} style={{ width: '100%', padding: '7px 9px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--card)', fontSize: 13.5, fontFamily: 'var(--font-jetbrains)', fontWeight: 700, color: '#D4882A' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 2 }}>Grasa (g)</label>
              <input type="number" value={g} onChange={e => setG(Number(e.target.value))} style={{ width: '100%', padding: '7px 9px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--card)', fontSize: 13.5, fontFamily: 'var(--font-jetbrains)', fontWeight: 700, color: '#6366F1' }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
          <button type="button" onClick={onClose} style={{ padding: '9px 18px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>Cancelar</button>
          <button type="submit" style={{ padding: '9px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>Guardar y Asignar Plan</button>
        </div>
      </form>
    </div>
  )
}

// 5. NUEVO ALIMENTO MODAL
function NuevoAlimentoModal({ onSave, onClose }: { onSave: (f: any) => void; onClose: () => void }) {
  const [name, setName] = useState('')
  const [cat, setCat] = useState<'Proteínas' | 'Cereales' | 'Frutas' | 'Verduras' | 'Grasas' | 'Lácteos' | 'Leguminosas'>('Proteínas')
  const [kcal, setKcal] = useState('150')
  const [p, setP] = useState('20')
  const [c, setC] = useState('0')
  const [g, setG] = useState('5')
  const [unit, setUnit] = useState('100 g')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({
      name,
      cat,
      kcal: parseFloat(kcal) || 100,
      p: parseFloat(p) || 0,
      c: parseFloat(c) || 0,
      g: parseFloat(g) || 0,
      fibraG: 2,
      unit,
      tags: ['SMAE', 'personalizado'],
    })
  }

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Agregar Alimento a la Base</h3>
          <p style={{ margin: '2px 0 0', fontSize: 12.5, color: 'var(--muted-foreground)' }}>Añade nuevos alimentos con su información nutrimental por porción.</p>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--muted-foreground)' }}>✕</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Nombre del Alimento</label>
            <input required placeholder="Ej. Pechuga de Pavo Ahumada" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Categoría</label>
            <select value={cat} onChange={e => setCat(e.target.value as any)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)' }}>
              <option>Proteínas</option>
              <option>Cereales</option>
              <option>Verduras</option>
              <option>Frutas</option>
              <option>Lácteos</option>
              <option>Grasas</option>
              <option>Leguminosas</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 2 }}>Porción</label>
            <input value={unit} onChange={e => setUnit(e.target.value)} style={{ width: '100%', padding: '7px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 12.5 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 2 }}>Kcal</label>
            <input type="number" value={kcal} onChange={e => setKcal(e.target.value)} style={{ width: '100%', padding: '7px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 12.5, fontFamily: 'var(--font-jetbrains)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 2 }}>Prot (g)</label>
            <input type="number" value={p} onChange={e => setP(e.target.value)} style={{ width: '100%', padding: '7px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 12.5, fontFamily: 'var(--font-jetbrains)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 2 }}>Carbs (g)</label>
            <input type="number" value={c} onChange={e => setC(e.target.value)} style={{ width: '100%', padding: '7px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 12.5, fontFamily: 'var(--font-jetbrains)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 2 }}>Grasa (g)</label>
            <input type="number" value={g} onChange={e => setG(e.target.value)} style={{ width: '100%', padding: '7px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 12.5, fontFamily: 'var(--font-jetbrains)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
          <button type="button" onClick={onClose} style={{ padding: '9px 18px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>Cancelar</button>
          <button type="submit" style={{ padding: '9px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>Guardar Alimento</button>
        </div>
      </form>
    </div>
  )
}

// 6. NUEVA CITA MODAL
function NuevaCitaModal({ patients, onSave, onClose }: { patients: any[]; onSave: (a: any) => void; onClose: () => void }) {
  const [patientId, setPatientId] = useState(patients[0]?.id || 1)
  const [time, setTime] = useState('11:00')
  const [type, setType] = useState('Seguimiento')

  const patient = patients.find(p => p.id === Number(patientId)) || patients[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      patientId: patient.id,
      patientName: patient.name,
      date: '2026-09-18',
      time,
      type,
      status: 'confirmada',
      durationMin: 45,
      channelSync: { googleCal: true, appleCal: true, whatsappSent: true },
    })
  }

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Agendar Nueva Cita</h3>
          <p style={{ margin: '2px 0 0', fontSize: 12.5, color: 'var(--muted-foreground)' }}>Reserva un espacio en la agenda de tu consultorio.</p>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--muted-foreground)' }}>✕</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Paciente</label>
          <select value={patientId} onChange={e => setPatientId(Number(e.target.value))} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)' }}>
            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Hora de la Cita</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, fontFamily: 'var(--font-jetbrains)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Tipo de Consulta</label>
            <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)' }}>
              <option>Seguimiento</option>
              <option>Primera consulta</option>
              <option>Evaluación antropométrica</option>
              <option>Plan personalizado</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
          <button type="button" onClick={onClose} style={{ padding: '9px 18px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>Cancelar</button>
          <button type="submit" style={{ padding: '9px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>Confirmar Cita</button>
        </div>
      </form>
    </div>
  )
}

// 7. REGISTRAR PAGO MODAL
function RegistrarPagoModal({ patients, onSave, onClose }: { patients: any[]; onSave: (p: any) => void; onClose: () => void }) {
  const [patientId, setPatientId] = useState(patients[0]?.id || 1)
  const [concept, setConcept] = useState('Consulta de seguimiento')
  const [amount, setAmount] = useState('650')
  const [method, setMethod] = useState<'Transferencia' | 'Tarjeta' | 'Efectivo'>('Transferencia')

  const patient = patients.find(p => p.id === Number(patientId)) || patients[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: `P-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: patient.id,
      patientName: patient.name,
      date: 'Hoy',
      concept,
      amount: parseFloat(amount) || 650,
      pendingBalance: 0,
      method,
      status: 'pagado',
    })
  }

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Registrar Cobro de Consulta</h3>
          <p style={{ margin: '2px 0 0', fontSize: 12.5, color: 'var(--muted-foreground)' }}>Ingresa el pago o paquete adquirido por el paciente.</p>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--muted-foreground)' }}>✕</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Paciente</label>
          <select value={patientId} onChange={e => setPatientId(Number(e.target.value))} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)' }}>
            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Concepto</label>
            <input value={concept} onChange={e => setConcept(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Monto ($ MXN)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, fontFamily: 'var(--font-jetbrains)', fontWeight: 700 }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Método de pago</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {(['Transferencia', 'Tarjeta', 'Efectivo'] as const).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                style={{
                  padding: '10px',
                  borderRadius: 8,
                  border: `1px solid ${method === m ? 'var(--accent)' : 'var(--border)'}`,
                  background: method === m ? '#E8F5EE' : 'var(--background)',
                  color: method === m ? 'var(--accent)' : 'var(--foreground)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
          <button type="button" onClick={onClose} style={{ padding: '9px 18px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>Cancelar</button>
          <button type="submit" style={{ padding: '9px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>Registrar Cobro</button>
        </div>
      </form>
    </div>
  )
}

// 8. COMMAND PALETTE
function CommandPaletteModal({
  patients,
  onNavigate,
  onClose,
  openModal,
}: {
  patients: any[]
  onNavigate: (page: PageId) => void
  onClose: () => void
  openModal: any
}) {
  const [query, setQuery] = useState('')

  const pages: { id: PageId; title: string }[] = [
    { id: 'dashboard', title: 'Dashboard & Mi Día' },
    { id: 'pacientes', title: 'Pacientes & Expedientes' },
    { id: 'consultas', title: 'Consultas Clínicas' },
    { id: 'antropometria', title: 'Evaluación Antropométrica' },
    { id: 'planes', title: 'Planes Alimenticios' },
    { id: 'editor-semanal', title: 'Editor Semanal de Menú' },
    { id: 'lista-compras', title: 'Lista de Compras Generada' },
    { id: 'alimentos', title: 'Base de Alimentos y Recetas' },
    { id: 'seguimiento', title: 'Seguimiento y Fotografías' },
    { id: 'asistente-ia', title: 'Asistente Copiloto IA' },
    { id: 'agenda', title: 'Agenda de Citas' },
    { id: 'notificaciones', title: 'Centro de Notificaciones' },
    { id: 'pagos', title: 'Pagos y Facturación Financiera' },
    { id: 'reportes', title: 'Reportes y Analítica SaaS' },
    { id: 'portal-paciente', title: 'Portal del Paciente (Mobile)' },
    { id: 'usuarios-permisos', title: 'Usuarios, Roles y Permisos' },
    { id: 'suscripcion-billing', title: 'Suscripción SaaS y Plan' },
    { id: 'configuracion', title: 'Configuración del Consultorio' },
  ]

  const actions = [
    { label: '+ Nuevo Paciente', action: () => openModal('nuevo-paciente') },
    { label: '+ Nueva Consulta', action: () => openModal('nueva-consulta') },
    { label: '+ Capturar Antropometría', action: () => openModal('capturar-antropometria') },
    { label: '+ Crear Plan Alimenticio', action: () => openModal('nuevo-plan') },
    { label: '🤖 Asistente Copiloto IA', action: () => openModal('asistente-ia') },
    { label: '+ Agendar Cita', action: () => openModal('nueva-cita') },
    { label: '+ Registrar Cobro', action: () => openModal('registrar-pago') },
  ]

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
  const filteredPages = pages.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
  const filteredActions = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()))

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontSize: 18, color: 'var(--muted-foreground)' }}>🔍</span>
        <input
          autoFocus
          placeholder="Busca paciente, función o ejecuta un comando..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 15, fontFamily: 'var(--font-jakarta)', color: 'var(--foreground)', width: '100%' }}
        />
        <kbd style={{ fontSize: 11, background: 'var(--muted)', padding: '3px 6px', borderRadius: 4, fontFamily: 'var(--font-jetbrains)', color: 'var(--muted-foreground)' }}>ESC</kbd>
      </div>

      <div style={{ maxHeight: 380, overflowY: 'auto', padding: 12 }}>
        {filteredActions.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 8px' }}>Acciones Rápidas</div>
            {filteredActions.map(a => (
              <div
                key={a.label}
                onClick={() => { a.action() }}
                style={{ padding: '10px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: 'var(--accent)', transition: 'background 0.12s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--muted)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                ⚡ {a.label}
              </div>
            ))}
          </div>
        )}

        {filteredPatients.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 8px' }}>Pacientes</div>
            {filteredPatients.slice(0, 4).map(p => (
              <div
                key={p.id}
                onClick={() => { openModal('expediente', { patientId: p.id }) }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', transition: 'background 0.12s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--muted)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--foreground)' }}>👤 {p.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted-foreground)' }}>{p.goal} · IMC {p.imc}</div>
                </div>
                <span style={{ fontSize: 11, background: '#E8F5EE', color: 'var(--accent)', padding: '2px 8px', borderRadius: 12, fontWeight: 600 }}>Ver Expediente</span>
              </div>
            ))}
          </div>
        )}

        {filteredPages.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 8px' }}>Navegación</div>
            {filteredPages.map(p => (
              <div
                key={p.id}
                onClick={() => { onNavigate(p.id); onClose() }}
                style={{ padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13.5, color: 'var(--foreground)', transition: 'background 0.12s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--muted)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                📌 {p.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// 9. EXPEDIENTE COMPLETO DRAWER
function ExpedienteDrawer({ patient, onClose }: { patient: any; onClose: () => void }) {
  const [tab, setTab] = useState<'resumen' | 'antecedentes' | 'antropometria' | 'historial'>('resumen')

  if (!patient) return null

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <img src={patient.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt={patient.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--foreground)' }}>Expediente: {patient.name}</h2>
            <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 2 }}>
              {patient.age} años · {patient.gender} · {patient.occupation} · WhatsApp: {patient.phone}
            </div>
            <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
              <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#E8F5EE', color: 'var(--accent)', fontWeight: 600 }}>
                Objetivo: {patient.goal}
              </span>
              <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'var(--muted)', color: 'var(--foreground)', fontWeight: 600 }}>
                IMC: {patient.imc}
              </span>
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--muted-foreground)' }}>✕</button>
      </div>

      <div style={{ display: 'flex', gap: 8, margin: '20px 0', borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
        {(['resumen', 'antecedentes', 'antropometria', 'historial'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: tab === t ? 'var(--primary)' : 'transparent',
              color: tab === t ? '#fff' : 'var(--muted-foreground)',
              fontSize: 13,
              fontWeight: tab === t ? 600 : 400,
              fontFamily: 'var(--font-jakarta)',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {t === 'resumen' ? 'Resumen General' : t === 'antecedentes' ? 'Antecedentes & Hábitos' : t === 'antropometria' ? 'Antropometría' : 'Historial de Consultas'}
          </button>
        ))}
      </div>

      {tab === 'resumen' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <div style={{ background: 'var(--muted)', padding: 16, borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600 }}>PESO ACTUAL</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-jetbrains)', color: 'var(--foreground)' }}>{patient.weight} kg</div>
            </div>
            <div style={{ background: 'var(--muted)', padding: 16, borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600 }}>ESTATURA</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-jetbrains)', color: 'var(--foreground)' }}>{patient.height} cm</div>
            </div>
            <div style={{ background: 'var(--muted)', padding: 16, borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600 }}>SESIONES REALIZADAS</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-jetbrains)', color: 'var(--foreground)' }}>{patient.sessions}</div>
            </div>
            <div style={{ background: 'var(--muted)', padding: 16, borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600 }}>PROGRESO TOTAL</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-jetbrains)', color: 'var(--accent)' }}>{patient.progress}%</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'antecedentes' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: 'var(--muted)', padding: 18, borderRadius: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground)', marginBottom: 8 }}>Antecedentes Médicos & Enfermedades</div>
            <div style={{ fontSize: 12.5, color: 'var(--foreground)' }}>{patient.expediente?.antecedentesMedicos?.join(', ') || 'Sin registro'}</div>
          </div>
          <div style={{ background: 'var(--muted)', padding: 18, borderRadius: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground)', marginBottom: 8 }}>Alergias & Intolerancias</div>
            <div style={{ fontSize: 12.5, color: '#E85C45', fontWeight: 600 }}>{patient.expediente?.alergias?.join(', ') || 'Ninguna'}</div>
          </div>
        </div>
      )}
    </div>
  )
}

// 10. PREVISUALIZADOR PDF
function PdfPreviewModal({ plan, onClose }: { plan: any; onClose: () => void }) {
  return (
    <div style={{ background: '#FFFFFF', color: '#131210', borderRadius: 16, padding: 32, boxShadow: '0 25px 50px rgba(0,0,0,0.4)', fontFamily: 'var(--font-jakarta)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #14432C', paddingBottom: 16, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#14432C', letterSpacing: '-0.02em' }}>NuVida</div>
          <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>Lic. Laura Gómez · Cédula Prof. 12849301</div>
          <div style={{ fontSize: 11, color: '#777' }}>Av. Insurgentes Sur 1458, CDMX · Tel: +52 55 9876 5432</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#28845A' }}>PLAN ALIMENTICIO</div>
          <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>Vigencia: {plan.since || 'Septiembre 2026'}</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid #E0DBD2' }}>
        <button onClick={onClose} style={{ padding: '8px 16px', background: '#EFECE6', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>Cerrar previsualización</button>
        <button onClick={() => window.print()} style={{ padding: '8px 18px', background: '#14432C', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          🖨️ Imprimir / Descargar PDF
        </button>
      </div>
    </div>
  )
}

// 11. ASISTENTE IA QUICK MODAL
function AsistenteIaQuickModal({ patients, onClose }: { patients: any[]; onClose: () => void }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>🤖 Asistente Copiloto IA — NuVida</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--muted-foreground)' }}>✕</button>
      </div>
      <p style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Asistente activo para analizar evoluciones clínicas y redactar recomendaciones.</p>
      <button onClick={onClose} style={{ marginTop: 16, width: '100%', padding: '10px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Abrir Módulo de IA Completo</button>
    </div>
  )
}

// 12. UPGRADE PLAN MODAL
function UpgradePlanModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>⚡ Suscripción SaaS NuVida</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--muted-foreground)' }}>✕</button>
      </div>
      <p style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Aumenta el límite de pacientes de tu clínica y desbloquea el Asistente IA Copiloto.</p>
      <button onClick={onClose} style={{ marginTop: 16, width: '100%', padding: '10px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Actualizar a Plan CLINIC</button>
    </div>
  )
}
