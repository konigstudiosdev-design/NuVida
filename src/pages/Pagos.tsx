import { useState } from 'react'
import { useApp } from '../context/AppContext'
import EmptyState from '../components/EmptyState'

export default function Pagos() {
  const { payments, openModal } = useApp()

  if (payments.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Finanzas, Pagos y Cobros</h2>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>Registro de ingresos, transferencias, efectivo y folios de cobro.</p>
          </div>
          <button
            onClick={() => openModal('registrar-pago')}
            style={{ padding: '9px 18px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}
          >
            + Registrar Cobro
          </button>
        </div>

        <EmptyState
          icon="💳"
          title="No hay transacciones registradas aún"
          description="Registra el primer cobro de consulta o paquete nutricional para llevar la contabilidad del consultorio."
          actionLabel="+ Registrar Primer Cobro"
          onAction={() => openModal('registrar-pago')}
        />
      </div>
    )
  }

  const totalCollected = payments.filter(p => p.status === 'pagado').reduce((acc, p) => acc + p.amount, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Finanzas y Control de Caja</h2>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>Ingresos acumulados: ${totalCollected.toLocaleString()} MXN</p>
        </div>

        <button
          onClick={() => openModal('registrar-pago')}
          style={{ padding: '9px 18px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}
        >
          + Registrar Cobro
        </button>
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
              {['Folio / Fecha', 'Paciente', 'Concepto', 'Método', 'Monto', 'Estado'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 16px', fontSize: 13, fontFamily: 'var(--font-jetbrains)', fontWeight: 600 }}>
                  {p.id} · {p.date}
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>
                  {p.patientName}
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--muted-foreground)' }}>
                  {p.concept}
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--foreground)' }}>
                  {p.method}
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-jetbrains)', color: 'var(--accent)' }}>
                  ${p.amount} MXN
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: 11.5, padding: '3px 10px', borderRadius: 20, background: '#E8F5EE', color: 'var(--accent)', fontWeight: 700, textTransform: 'capitalize' }}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
