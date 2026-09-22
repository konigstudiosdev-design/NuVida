import { useState } from 'react'
import { useApp } from '../context/AppContext'

const CATEGORIES = ['Todos', 'Proteínas', 'Verduras', 'Frutas', 'Cereales', 'Lácteos', 'Grasas', 'Leguminosas']

export default function Alimentos() {
  const { foods, recipes, openModal } = useApp()
  const [tab, setTab] = useState<'alimentos' | 'recetas'>('alimentos')
  const [cat, setCat] = useState('Todos')
  const [search, setSearch] = useState('')

  const filteredFoods = foods.filter(f =>
    (cat === 'Todos' || f.cat === cat) &&
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 0, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
          {(['alimentos', 'recetas'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 20px',
                borderRadius: 7,
                border: 'none',
                background: tab === t ? 'var(--primary)' : 'transparent',
                color: tab === t ? '#fff' : 'var(--muted-foreground)',
                fontSize: 13.5,
                fontWeight: tab === t ? 600 : 400,
                fontFamily: 'var(--font-jakarta)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {t === 'alimentos' ? 'Base de alimentos' : 'Recetas'}
            </button>
          ))}
        </div>

        <button
          onClick={() => openModal('nuevo-alimento')}
          style={{
            padding: '9px 16px',
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            fontFamily: 'var(--font-jakarta)',
            cursor: 'pointer',
          }}
        >
          + Agregar alimento
        </button>
      </div>

      {tab === 'alimentos' && (
        <>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', flex: 1, maxWidth: 320 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                placeholder="Buscar alimento..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13.5, fontFamily: 'var(--font-jakarta)', color: 'var(--foreground)', width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 20,
                    border: '1px solid var(--border)',
                    background: cat === c ? 'var(--primary)' : 'var(--card)',
                    color: cat === c ? '#fff' : 'var(--muted-foreground)',
                    fontSize: 12.5,
                    fontWeight: cat === c ? 600 : 400,
                    fontFamily: 'var(--font-jakarta)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
                  {['Alimento', 'Categoría', 'Kcal', 'Prot', 'Carbs', 'Grasa', 'Porción', 'Etiquetas'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredFoods.map((food, i) => (
                  <tr
                    key={food.id}
                    style={{ borderBottom: i < filteredFoods.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.12s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--muted)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px', fontWeight: 500, fontSize: 13.5, color: 'var(--foreground)' }}>{food.name}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11.5, padding: '3px 8px', borderRadius: 20, background: 'var(--muted)', color: 'var(--secondary-foreground)', fontWeight: 500 }}>
                        {food.cat}
                      </span>
                    </td>
                    {[food.kcal, food.p, food.c, food.g].map((val, vi) => (
                      <td key={vi} style={{ padding: '12px 16px', fontFamily: 'var(--font-jetbrains)', fontSize: 13, color: 'var(--foreground)' }}>{val}</td>
                    ))}
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--muted-foreground)' }}>{food.unit}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {food.tags.map(t => (
                          <span key={t} style={{ fontSize: 10.5, padding: '2px 7px', borderRadius: 20, background: '#E8F5EE', color: '#28845A', fontWeight: 500 }}>{t}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'recetas' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {recipes.map(r => (
            <div
              key={r.id}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'box-shadow 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = 'none'}
            >
              <div style={{ height: 10, background: 'var(--primary)' }} />
              <div style={{ padding: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>{r.name}</div>
                <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    ⏱️ {r.timeMin} min
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{r.kcal} kcal</div>
                  <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{r.servings} porción</div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {r.ingredients.map(ing => (
                    <span key={ing.foodName} style={{ fontSize: 11.5, padding: '4px 8px', background: 'var(--muted)', borderRadius: 6, color: 'var(--secondary-foreground)' }}>
                      {ing.foodName} ({ing.amount})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div
            onClick={() => openModal('nuevo-alimento')}
            style={{
              border: '2px dashed var(--border)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 180,
              cursor: 'pointer',
              color: 'var(--muted-foreground)',
              fontSize: 13.5,
              flexDirection: 'column',
              gap: 8,
              transition: 'border-color 0.15s ease',
            }}
          >
            <span style={{ fontSize: 24 }}>+</span>
            Nueva receta
          </div>
        </div>
      )}
    </div>
  )
}
