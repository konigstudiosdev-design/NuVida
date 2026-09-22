import { useApp } from '../context/AppContext'

export default function ListaCompras() {
  const { shoppingList, toggleShoppingItem, patients } = useApp()

  const categories = Array.from(new Set(shoppingList.map(item => item.category)))
  const totalItems = shoppingList.length
  const boughtItems = shoppingList.filter(item => item.bought).length
  const progressPct = Math.round((boughtItems / (totalItems || 1)) * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Lista de Compras Generada</h2>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>Generada automáticamente a partir del plan nutricional activo de Ana Torres.</p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => alert('Exportando lista de compras enviada por WhatsApp al paciente...')}
            style={{ padding: '8px 16px', background: '#25D366', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            💬 Enviar Lista por WhatsApp
          </button>
          <button
            onClick={() => window.print()}
            style={{ padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}
          >
            🖨️ Imprimir
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, fontWeight: 600 }}>
          <span>Progreso de Compras ({boughtItems} de {totalItems} artículos)</span>
          <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>{progressPct}%</span>
        </div>
        <div style={{ height: 8, background: 'var(--muted)', borderRadius: 99 }}>
          <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--accent)', borderRadius: 99, transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* Categorized Shopping Items */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {categories.map(cat => {
          const catItems = shoppingList.filter(item => item.category === cat)
          return (
            <div key={cat} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                🛒 {cat}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {catItems.map(item => (
                  <label
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: item.bought ? 'var(--muted)' : 'var(--background)',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      cursor: 'pointer',
                      opacity: item.bought ? 0.6 : 1,
                      textDecoration: item.bought ? 'line-through' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <input
                        type="checkbox"
                        checked={item.bought}
                        onChange={() => toggleShoppingItem(item.id)}
                        style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
                      />
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>{item.item}</span>
                    </div>
                    <span style={{ fontSize: 12, fontFamily: 'var(--font-jetbrains)', color: 'var(--muted-foreground)' }}>{item.amount}</span>
                  </label>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
