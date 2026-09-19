import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import { useApp } from '../context/AppContext'

const WEIGHT_DATA = [
  { date: '1 may', peso: 75.2, grasa: 34.2, musculo: 43.1 },
  { date: '15 jun', peso: 72.1, grasa: 31.4, musculo: 44.3 },
  { date: '1 jul', peso: 70.6, grasa: 30.1, musculo: 44.8 },
  { date: '15 ago', peso: 69.3, grasa: 28.8, musculo: 45.2 },
  { date: '18 sep', peso: 68.4, grasa: 28.2, musculo: 45.5 },
]

export default function Seguimiento() {
  const { patients, progressPhotos, openModal } = useApp()
  const [patientId, setPatientId] = useState(patients[0]?.id || 1)
  const [photoTag, setPhotoTag] = useState<'Frente' | 'Perfil' | 'Espalda'>('Frente')

  const selectedPatient = patients.find(p => p.id === Number(patientId)) || patients[0]
  const photos = progressPhotos.filter(p => p.patientId === selectedPatient?.id)

  const initialPhoto = photos[0] || {
    date: '15 mayo 2026',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&auto=format&fit=crop&q=80',
    notes: 'Inicio del programa (75.2 kg)',
  }

  const currentPhoto = photos[1] || {
    date: '18 sep 2026',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&auto=format&fit=crop&q=80',
    notes: 'Actual semana 16 (68.4 kg)',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--muted-foreground)', fontWeight: 500 }}>Paciente:</span>
          <select
            value={patientId}
            onChange={e => setPatientId(Number(e.target.value))}
            style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card)', fontSize: 14, fontFamily: 'var(--font-jakarta)', color: 'var(--foreground)', fontWeight: 500, outline: 'none' }}
          >
            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <span style={{ fontSize: 12, color: 'var(--muted-foreground)', background: 'var(--muted)', padding: '4px 10px', borderRadius: 20 }}>
            {selectedPatient?.goal} · Adherencia: {selectedPatient?.progress}%
          </span>
        </div>

        <button
          onClick={() => openModal('expediente', { patientId: selectedPatient?.id })}
          style={{ padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}
        >
          Ver Expediente Completo
        </button>
      </div>

      {/* BEFORE / AFTER Photo Comparator */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--foreground)' }}>Comparador de Progreso Fotográfico (ANTES vs ACTUAL)</h3>
            <p style={{ margin: '2px 0 0', fontSize: 12.5, color: 'var(--muted-foreground)' }}>Visualiza la evolución postural y de recomposición corporal del paciente.</p>
          </div>

          <div style={{ display: 'flex', gap: 6, background: 'var(--muted)', padding: 4, borderRadius: 8 }}>
            {(['Frente', 'Perfil', 'Espalda'] as const).map(tag => (
              <button
                key={tag}
                onClick={() => setPhotoTag(tag)}
                style={{
                  padding: '6px 14px',
                  border: 'none',
                  borderRadius: 6,
                  background: photoTag === tag ? 'var(--card)' : 'transparent',
                  color: photoTag === tag ? 'var(--foreground)' : 'var(--muted-foreground)',
                  fontSize: 12,
                  fontWeight: photoTag === tag ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Before Image Card */}
          <div style={{ background: 'var(--muted)', borderRadius: 12, padding: 16, border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', marginBottom: 8 }}>INICIO — {initialPhoto.date}</div>
            <img src={initialPhoto.imageUrl} alt="Foto Antes" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
            <div style={{ fontSize: 12, color: 'var(--foreground)' }}>{initialPhoto.notes}</div>
          </div>

          {/* After Image Card */}
          <div style={{ background: 'var(--muted)', borderRadius: 12, padding: 16, border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 8 }}>ACTUAL — {currentPhoto.date}</div>
            <img src={currentPhoto.imageUrl} alt="Foto Actual" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
            <div style={{ fontSize: 12, color: 'var(--foreground)' }}>{currentPhoto.notes}</div>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--foreground)', marginBottom: 4 }}>Línea de Tiempo de Evolución</div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={WEIGHT_DATA} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10.5, fill: '#7C7870', fontFamily: 'var(--font-jakarta)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10.5, fill: '#7C7870', fontFamily: 'var(--font-jetbrains)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, fontFamily: 'var(--font-jakarta)' }} />
            <Line type="monotone" dataKey="peso" stroke="#14432C" strokeWidth={2.5} name="Peso (kg)" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="grasa" stroke="#D4882A" strokeWidth={1.5} name="Grasa (%)" dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
