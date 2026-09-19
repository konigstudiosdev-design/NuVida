import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

export default function PortalPaciente() {
  const { loggedWaterLiters, addWaterLog, loggedMealsCount, toggleMealLogged, shoppingList, toggleShoppingItem } = useApp()
  const { currentUser, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'hoy' | 'menu' | 'recetas' | 'compras' | 'progreso'>('hoy')

  return (
    <div style={{ maxWidth: 460, margin: '0 auto', background: '#FFFFFF', minHeight: '85vh', borderRadius: 20, border: '1px solid #E0DBD2', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Mobile Top Header */}
      <div style={{ background: '#14432C', color: '#FFFFFF', padding: '20px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#28845A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
            {currentUser?.name ? currentUser.name.split(' ').slice(0, 2).map(n => n[0]).join('') : 'AT'}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>¡Hola, {currentUser?.name || 'Ana Torres'}! 👋</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Lic. Laura Gómez · Nutrióloga</div>
          </div>
        </div>

        <button
          onClick={() => logout()}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '5px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
        >
          🚪 Salir
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: 20, overflowY: 'auto', background: '#F7F6F3' }}>
        {/* TAB 1: HOY */}
        {activeTab === 'hoy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: '#FFFFFF', borderRadius: 12, padding: 16, border: '1px solid #E0DBD2' }}>
                <div style={{ fontSize: 11, color: '#777', fontWeight: 600 }}>REGISTRO DE AGUA</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#14432C', marginTop: 4, fontFamily: 'var(--font-jetbrains)' }}>{loggedWaterLiters} / 2.2 L</div>
                <button onClick={() => addWaterLog(0.25)} style={{ marginTop: 8, width: '100%', padding: '6px', background: '#E8F5EE', color: '#28845A', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  + 250 ml de Agua
                </button>
              </div>

              <div style={{ background: '#FFFFFF', borderRadius: 12, padding: 16, border: '1px solid #E0DBD2' }}>
                <div style={{ fontSize: 11, color: '#777', fontWeight: 600 }}>COMIDAS DEL DÍA</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#14432C', marginTop: 4, fontFamily: 'var(--font-jetbrains)' }}>{loggedMealsCount} / 5 registradas</div>
                <button onClick={toggleMealLogged} style={{ marginTop: 8, width: '100%', padding: '6px', background: '#14432C', color: '#FFF', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  ✓ Registrar Toma
                </button>
              </div>
            </div>

            {/* Today's Meals Timeline */}
            <div style={{ background: '#FFFFFF', borderRadius: 14, padding: 18, border: '1px solid #E0DBD2' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#131210', marginBottom: 12 }}>Tu Plan para Hoy</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { time: '07:30', name: 'Desayuno', food: 'Avena en hojuelas (40g) + 2 huevos cocidos + Té' },
                  { time: '10:30', name: 'Colación AM', food: '1 manzana verde + 15g almendras' },
                  { time: '13:30', name: 'Comida', food: 'Pechuga de pollo (150g) + Arroz integral + Ensalada' },
                  { time: '16:30', name: 'Colación PM', food: 'Yogur griego (150g) + Fresas' },
                  { time: '19:30', name: 'Cena', food: 'Salmón a la plancha (120g) + Brócoli + Aguacate' },
                ].map((m, i) => (
                  <div key={i} style={{ padding: '10px 12px', background: '#F7F6F3', borderRadius: 8, border: '1px solid #E0DBD2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#14432C' }}>{m.name}</span>
                      <span style={{ fontSize: 11, color: '#777', fontFamily: 'var(--font-jetbrains)' }}>{m.time} h</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: '#333' }}>{m.food}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPRAS */}
        {activeTab === 'compras' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#131210' }}>Tu Lista de Compras de la Semana</div>
            {shoppingList.map(item => (
              <label key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: '#FFFFFF', borderRadius: 8, border: '1px solid #E0DBD2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="checkbox" checked={item.bought} onChange={() => toggleShoppingItem(item.id)} style={{ accentColor: '#28845A' }} />
                  <span style={{ fontSize: 13, textDecoration: item.bought ? 'line-through' : 'none', color: item.bought ? '#888' : '#131210' }}>{item.item}</span>
                </div>
                <span style={{ fontSize: 12, color: '#777' }}>{item.amount}</span>
              </label>
            ))}
          </div>
        )}

        {/* TAB 3: PROGRESO */}
        {activeTab === 'progreso' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#FFFFFF', borderRadius: 14, padding: 18, border: '1px solid #E0DBD2', textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#777' }}>PESO ACTUAL REGISTRADO</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#14432C', fontFamily: 'var(--font-jetbrains)', margin: '4px 0' }}>68.4 kg</div>
              <div style={{ fontSize: 12, color: '#28845A', fontWeight: 600 }}>↓ 6.8 kg logrados desde inicio</div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div style={{ display: 'flex', borderTop: '1px solid #E0DBD2', background: '#FFFFFF', padding: '6px 0' }}>
        {[
          { id: 'hoy', label: 'Hoy', icon: '📅' },
          { id: 'compras', label: 'Compras', icon: '🛒' },
          { id: 'progreso', label: 'Progreso', icon: '📈' },
        ].map(t => {
          const isActive = activeTab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              style={{
                flex: 1,
                padding: '6px 0',
                border: 'none',
                background: 'transparent',
                color: isActive ? '#14432C' : '#888888',
                fontWeight: isActive ? 700 : 500,
                fontSize: 11,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              {t.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
