import { useApp } from '../context/AppContext'

export default function SuscripcionBilling() {
  const { organization, openModal, patients } = useApp()

  const plansList = [
    { name: 'FREE', price: '$0', limit: '10 pacientes', features: ['1 Nutriólogo', 'Planes básicos', 'WhatsApp manual'] },
    { name: 'PRO', price: '$499 MXN/mes', limit: '100 pacientes', features: ['3 Nutriólogos', 'Asistente IA Copilot', 'Portal Paciente Mobile', 'WhatsApp Automático'], active: organization.planTier === 'PRO' },
    { name: 'BUSINESS', price: '$999 MXN/mes', limit: '500 pacientes', features: ['10 Nutriólogos', 'Multiconsultorio', 'Facturación SAT automática', 'API Integración'], active: organization.planTier === 'BUSINESS' },
    { name: 'CLINIC', price: '$1,899 MXN/mes', limit: 'Ilimitados', features: ['Nutriólogos ilimitados', 'Dominio personalizado', 'Soporte VIP 24/7', 'Capacitación personalizada'], active: organization.planTier === 'CLINIC' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Banner */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
            Suscripción SaaS Activa
          </div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--foreground)' }}>
            Plan NuVida {organization.planTier}
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13.5, color: 'var(--muted-foreground)' }}>
            Uso actual: {patients.length} de {organization.patientsLimit} pacientes registrados ({Math.round((patients.length / organization.patientsLimit) * 100)}% ocupado).
          </p>
        </div>

        <button
          onClick={() => openModal('upgrade-plan')}
          style={{ padding: '10px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}
        >
          ⚡ Cambiar Plan / Upgrade
        </button>
      </div>

      {/* Usage Meter */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, fontWeight: 600 }}>
          <span>Límite de Pacientes Activos ({patients.length} / {organization.patientsLimit})</span>
          <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>{Math.round((patients.length / organization.patientsLimit) * 100)}%</span>
        </div>
        <div style={{ height: 8, background: 'var(--muted)', borderRadius: 99 }}>
          <div style={{ height: '100%', width: `${Math.min(100, (patients.length / organization.patientsLimit) * 100)}%`, background: 'var(--accent)', borderRadius: 99 }} />
        </div>
      </div>

      {/* Pricing Tier Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {plansList.map(plan => (
          <div
            key={plan.name}
            style={{
              background: plan.active ? '#E8F5EE' : 'var(--card)',
              border: `2px solid ${plan.active ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 14,
              padding: 22,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: plan.active ? 'var(--accent)' : 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {plan.name} {plan.active && '• ACTUAL'}
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--foreground)', fontFamily: 'var(--font-instrument)', margin: '8px 0 2px' }}>
                {plan.price}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 16 }}>{plan.limit}</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                {plan.features.map((feat, fi) => (
                  <div key={fi} style={{ fontSize: 12, color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: 'var(--accent)' }}>✓</span> {feat}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => openModal('upgrade-plan')}
              style={{
                marginTop: 20,
                width: '100%',
                padding: '9px',
                borderRadius: 8,
                border: plan.active ? '1px solid var(--accent)' : 'none',
                background: plan.active ? 'var(--card)' : 'var(--primary)',
                color: plan.active ? 'var(--accent)' : '#fff',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-jakarta)',
              }}
            >
              {plan.active ? 'Plan Activo' : 'Seleccionar Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
