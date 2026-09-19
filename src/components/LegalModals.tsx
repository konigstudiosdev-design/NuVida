export function PrivacyPolicyModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#FFF', borderRadius: 16, padding: 28, maxWidth: 520, width: '100%', maxHeight: '80vh', overflowY: 'auto', color: '#131210', fontFamily: 'var(--font-jakarta)' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700, color: '#14432C' }}>Aviso de Privacidad & Protección de Datos Clínicos</h3>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: '#444' }}>
          NuVida cumple con las regulaciones de protección de datos personales en posesión de particulares (ARCO) y normativas internacionales de resguardo clínico.
          La información recopilada (expedientes, antropometría, planes alimenticios y fotografías) se almacena cifrada en servidores seguros de Firebase Firestore y Storage bajo aislamiento estricto por Organización.
        </p>
        <button onClick={onClose} style={{ marginTop: 16, padding: '9px 18px', background: '#14432C', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Entendido
        </button>
      </div>
    </div>
  )
}
