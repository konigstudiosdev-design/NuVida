import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

export default function PortalPaciente() {
  const { loggedWaterLiters, addWaterLog, loggedMealsCount, toggleMealLogged, shoppingList, toggleShoppingItem } = useApp()
  const { currentUser, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'hoy' | 'menu' | 'recetas' | 'compras' | 'progreso'>('hoy')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F7F6F3', fontFamily: 'var(--font-jakarta)' }}>

      {/* HEADER (Responsive) */}
      <header style={{ background: '#14432C', color: '#FFFFFF', padding: isMobile ? '20px 16px' : '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#28845A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, color: '#FFF' }}>
            {currentUser?.name ? currentUser.name.split(' ').slice(0, 2).map(n => n[0]).join('') : 'AT'}
          </div>
          <div>
            <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, letterSpacing: '-0.02em' }}>¡Hola, {currentUser?.name || 'Ana Torres'}! 👋</div>
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>Lic. Laura Gómez · Nutrióloga Titular</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {!isMobile && (
            <div style={{ display: 'flex', gap: 6, marginRight: 16 }}>
              {[
                { id: 'hoy', label: 'Mi Día', icon: '☀️' },
                { id: 'compras', label: 'Lista de Compras', icon: '🛒' },
                { id: 'progreso', label: 'Mi Progreso', icon: '📈' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  style={{
                    background: activeTab === t.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => logout()}
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, padding: isMobile ? '20px 16px 80px' : '40px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>

        {/* TAB 1: HOY (DASHBOARD) */}
        {activeTab === 'hoy' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr', gap: 24 }}>

            {/* Left Column: Metrics & Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 24, border: '1px solid #E0DBD2', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: 12, color: '#7C7870', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>Registro de Agua</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#14432C', fontFamily: 'var(--font-jetbrains)' }}>{loggedWaterLiters}</div>
                  <div style={{ fontSize: 14, color: '#7C7870', fontWeight: 600 }}>/ 2.2 L</div>
                </div>
                {/* Visual Progress Bar */}
                <div style={{ height: 8, background: '#F7F6F3', borderRadius: 10, marginTop: 12, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min((loggedWaterLiters / 2.2) * 100, 100)}%`, background: '#28845A', borderRadius: 10, transition: 'width 0.3s ease' }} />
                </div>
                <button onClick={() => addWaterLog(0.25)} style={{ marginTop: 16, width: '100%', padding: '12px', background: '#E8F5EE', color: '#28845A', border: 'none', borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}>
                  + 250 ml de Agua
                </button>
              </div>

              <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 24, border: '1px solid #E0DBD2', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: 12, color: '#7C7870', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>Comidas del Día</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#14432C', fontFamily: 'var(--font-jetbrains)' }}>{loggedMealsCount}</div>
                  <div style={{ fontSize: 14, color: '#7C7870', fontWeight: 600 }}>/ 5 tomas</div>
                </div>
                <button onClick={toggleMealLogged} style={{ marginTop: 16, width: '100%', padding: '12px', background: '#14432C', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}>
                  ✓ Registrar Toma Actual
                </button>
              </div>

              {!isMobile && (
                <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 24, border: '1px solid #E0DBD2', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#7C7870', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>Próxima Cita Clínica</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#14432C', marginTop: 8 }}>Jueves 14 de Octubre</div>
                  <div style={{ fontSize: 14, color: '#7C7870', fontWeight: 500, marginTop: 4 }}>16:30 hrs — Presencial</div>
                </div>
              )}
            </div>

            {/* Right Column: Timeline / Menu */}
            <div style={{ background: '#FFFFFF', borderRadius: 16, padding: isMobile ? 20 : 32, border: '1px solid #E0DBD2', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#131210', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                🥗 Tu Plan Alimenticio para Hoy
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { time: '07:30', name: 'Desayuno', food: 'Avena en hojuelas (40g) + 2 huevos cocidos + Té verde' },
                  { time: '10:30', name: 'Colación AM', food: '1 manzana verde fresca + 15g de almendras naturales' },
                  { time: '13:30', name: 'Comida', food: 'Pechuga de pollo a la plancha (150g) + Arroz integral (½ taza) + Ensalada de espinacas y jitomate' },
                  { time: '16:30', name: 'Colación PM', food: 'Yogur griego 0% grasa (150g) + Fresas frescas (½ taza)' },
                  { time: '19:30', name: 'Cena', food: 'Salmón fresco a la plancha (120g) + Brócoli al vapor (1 taza) + Aguacate Hass (⅓ pza)' },
                ].map((m, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, padding: '16px 20px', background: '#F7F6F3', borderRadius: 12, border: '1px solid #E0DBD2', alignItems: 'center' }}>
                    <div style={{ minWidth: 60, textAlign: 'center' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#28845A', fontFamily: 'var(--font-jetbrains)' }}>{m.time} h</div>
                    </div>
                    <div style={{ width: 1, height: 30, background: '#D1CD-C4' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#14432C', marginBottom: 4 }}>{m.name}</div>
                      <div style={{ fontSize: 13, color: '#625F58', lineHeight: 1.5 }}>{m.food}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: COMPRAS */}
        {activeTab === 'compras' && (
          <div style={{ background: '#FFFFFF', borderRadius: 16, padding: isMobile ? 20 : 32, border: '1px solid #E0DBD2', maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 700, color: '#14432C' }}>🛒 Lista de Compras Semanal</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {shoppingList.map(item => (
                <label key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: item.bought ? '#F7F6F3' : '#FFFFFF', borderRadius: 10, border: '1px solid #E0DBD2', cursor: 'pointer', transition: 'background 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <input type="checkbox" checked={item.bought} onChange={() => toggleShoppingItem(item.id)} style={{ width: 18, height: 18, accentColor: '#28845A', cursor: 'pointer' }} />
                    <span style={{ fontSize: 14.5, fontWeight: item.bought ? 500 : 600, textDecoration: item.bought ? 'line-through' : 'none', color: item.bought ? '#9CA3AF' : '#131210' }}>{item.item}</span>
                  </div>
                  <span style={{ fontSize: 13, color: '#7C7870', fontWeight: 600 }}>{item.amount}</span>
                </label>
              ))}
              {shoppingList.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7C7870', fontSize: 14 }}>Tu nutriólogo aún no ha generado la lista de compras de esta semana.</div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PROGRESO */}
        {activeTab === 'progreso' && (
          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
              <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 24, border: '1px solid #E0DBD2', textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#7C7870', fontWeight: 700, letterSpacing: '0.04em' }}>PESO ACTUAL</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: '#14432C', fontFamily: 'var(--font-jetbrains)', margin: '8px 0' }}>68.4 <span style={{fontSize: 16}}>kg</span></div>
                <div style={{ fontSize: 13, color: '#28845A', fontWeight: 600, background: '#E8F5EE', padding: '4px 10px', borderRadius: 20, display: 'inline-block' }}>↓ 6.8 kg desde inicio</div>
              </div>

              <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 24, border: '1px solid #E0DBD2', textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#7C7870', fontWeight: 700, letterSpacing: '0.04em' }}>% GRASA</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: '#14432C', fontFamily: 'var(--font-jetbrains)', margin: '8px 0' }}>26.5 <span style={{fontSize: 16}}>%</span></div>
                <div style={{ fontSize: 13, color: '#28845A', fontWeight: 600, background: '#E8F5EE', padding: '4px 10px', borderRadius: 20, display: 'inline-block' }}>↓ 2.1% este mes</div>
              </div>

              <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 24, border: '1px solid #E0DBD2', textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#7C7870', fontWeight: 700, letterSpacing: '0.04em' }}>ADHERENCIA AL PLAN</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: '#14432C', fontFamily: 'var(--font-jetbrains)', margin: '8px 0' }}>92 <span style={{fontSize: 16}}>%</span></div>
                <div style={{ fontSize: 13, color: '#D4882A', fontWeight: 600, background: '#FEF3E2', padding: '4px 10px', borderRadius: 20, display: 'inline-block' }}>Excelente constancia</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      {isMobile && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', borderTop: '1px solid #E0DBD2', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '8px 12px 24px', zIndex: 100, boxShadow: '0 -4px 20px rgba(0,0,0,0.05)' }}>
          {[
            { id: 'hoy', label: 'Hoy', icon: '☀️' },
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
                  padding: '8px 0',
                  border: 'none',
                  background: 'transparent',
                  color: isActive ? '#14432C' : '#9CA3AF',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 11,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
              >
                <span style={{ fontSize: 20, transform: isActive ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.2s' }}>{t.icon}</span>
                {t.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
