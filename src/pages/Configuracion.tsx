import { useState, useEffect } from 'react'
import { pwaService } from '../services/pwa'
import { pushService } from '../services/pushNotifications'
import { nativeBridge } from '../services/nativeBridge'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

export default function Configuracion() {
  const { clearAllData, organization } = useApp()
  const { currentUser, updateCurrentUser } = useAuth()
  const [activeTab, setActiveTab] = useState<'perfil' | 'consultorio' | 'pwa' | 'clinicos' | 'agenda' | 'servicios' | 'integraciones'>('perfil')

  // Profile Form State dynamically bound to currentUser
  const [perfil, setPerfil] = useState({
    nombre: currentUser?.name || 'Lic. Nutrióloga',
    cedula: currentUser?.cedula || '',
    especialidad: currentUser?.especialidad || 'Nutrición Clínica y Recomposición Corporal',
    email: currentUser?.email || '',
    telefono: currentUser?.phone || '',
    universidad: currentUser?.universidad || 'Universidad Nacional Autónoma de México',
    bio: 'Especialista en recomposición corporal, control metabólico y nutrición clínica avanzada.',
  })

  // Synchronize if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setPerfil(prev => ({
        ...prev,
        nombre: currentUser.name || prev.nombre,
        email: currentUser.email || prev.email,
        telefono: currentUser.phone || prev.telefono,
        cedula: currentUser.cedula || prev.cedula,
        especialidad: currentUser.especialidad || prev.especialidad,
      }))
    }
  }, [currentUser])

  // Clinic Form State
  const [consultorio, setConsultorio] = useState({
    nombre: organization?.name || currentUser?.organizationName || 'Centro Nutricional NuVida',
    direccion: 'Av. Insurgentes Sur 1458, Piso 4, Col. Del Valle, CDE, CDMX',
    telefono: currentUser?.phone || '+52 55 5555 1234',
    moneda: 'MXN ($)',
    sitioWeb: 'https://nuvida.app/consultorio',
  })

  // PWA & Electron State
  const [isOnline, setIsOnline] = useState(pwaService.isOnline)
  const [isInstalled, setIsInstalled] = useState(pwaService.isInstalled || nativeBridge.capabilities.isElectron)
  const [pendingOutboxCount, setPendingOutboxCount] = useState(pwaService.pendingOutbox.length)
  const [pushPermission, setPushPermission] = useState(pushService.permission)

  useEffect(() => {
    return pwaService.subscribe(() => {
      setIsOnline(pwaService.isOnline)
      setIsInstalled(pwaService.isInstalled || nativeBridge.capabilities.isElectron)
      setPendingOutboxCount(pwaService.pendingOutbox.length)
    })
  }, [])

  const handleInstallClick = async () => {
    if (nativeBridge.capabilities.isElectron) {
      alert('NuVida ya está ejecutándose como aplicación de escritorio nativa (Electron).')
      return
    }
    const success = await pwaService.installApp()
    if (!success) {
      alert('Para instalar NuVida en tu dispositivo:\n\n• En Chrome/Edge: Haz clic en el icono de descarga en la barra de direcciones.\n• En iPhone/iPad (Safari): Toca el botón Compartir y selecciona "Agregar a inicio".')
    }
  }

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateCurrentUser({
      name: perfil.nombre,
      email: perfil.email,
      phone: perfil.telefono,
      cedula: perfil.cedula,
      especialidad: perfil.especialidad,
      universidad: perfil.universidad,
      organizationName: consultorio.nombre,
    })
    if (organization) {
      organization.name = consultorio.nombre
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
            Ajustes del Sistema & Firebase
          </div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--foreground)' }}>
            Configuración del Consultorio — NuVida
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13.5, color: 'var(--muted-foreground)' }}>
            Personaliza tus datos profesionales, membrete de reportes, aplicación PWA/Electron e integraciones Firebase.
          </p>
        </div>
        <button
          onClick={handleSave}
          style={{
            padding: '10px 22px',
            background: saved ? 'var(--accent)' : 'var(--primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 13.5,
            fontWeight: 600,
            fontFamily: 'var(--font-jakarta)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(20,67,44,0.15)',
          }}
        >
          {saved ? 'Guardado con éxito ✓' : 'Guardar cambios'}
        </button>
      </div>

      {/* Tabs Layout */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ width: 230, flexShrink: 0, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 8 }}>
          {[
            { id: 'perfil', label: 'Perfil Profesional', icon: '👤' },
            { id: 'consultorio', label: 'Datos del Consultorio', icon: '🏥' },
            { id: 'pwa', label: 'Aplicación Escritorio / PWA', icon: '💻' },
            { id: 'integraciones', label: 'Firebase & Conexiones', icon: '🔥' },
            { id: 'clinicos', label: 'Parámetros Clínicos', icon: '🧪' },
            { id: 'agenda', label: 'Horarios y Agenda', icon: '📅' },
            { id: 'servicios', label: 'Tarifas y Servicios', icon: '💳' },
          ].map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: 'none',
                  background: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--foreground)',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  fontFamily: 'var(--font-jakarta)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  marginBottom: 2,
                }}
              >
                <span style={{ fontSize: 14 }}>{tab.icon}</span>
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content Panel */}
        <div style={{ flex: 1, minWidth: 0, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 28 }}>
          {activeTab === 'perfil' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--foreground)' }}>Información Profesional</h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>Estadística visible en el membrete de recetas y expedientes.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--foreground)', marginBottom: 6 }}>Nombre completo con título</label>
                  <input
                    value={perfil.nombre}
                    onChange={e => setPerfil({ ...perfil, nombre: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--foreground)', marginBottom: 6 }}>Cédula Profesional</label>
                  <input
                    value={perfil.cedula}
                    placeholder="Ingresa tu número de cédula"
                    onChange={e => setPerfil({ ...perfil, cedula: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jetbrains)', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--foreground)', marginBottom: 6 }}>Especialidad clínica</label>
                  <input
                    value={perfil.especialidad}
                    onChange={e => setPerfil({ ...perfil, especialidad: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--foreground)', marginBottom: 6 }}>Correo electrónico</label>
                  <input
                    value={perfil.email}
                    onChange={e => setPerfil({ ...perfil, email: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', fontFamily: 'var(--font-jakarta)', outline: 'none' }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'consultorio' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--foreground)' }}>Datos del Consultorio</h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>Nombre de marca e información de contacto.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--foreground)', marginBottom: 6 }}>Nombre del consultorio</label>
                  <input
                    value={consultorio.nombre}
                    onChange={e => setConsultorio({ ...consultorio, nombre: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--foreground)', marginBottom: 6 }}>Teléfono / WhatsApp de atención</label>
                  <input
                    value={consultorio.telefono}
                    onChange={e => setConsultorio({ ...consultorio, telefono: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 13.5, color: 'var(--foreground)', outline: 'none' }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integraciones' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--foreground)' }}>Integración Firebase Cloud</h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>Proyecto Cloud `nuvida-8f975` conectado e inicializado.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ padding: 18, background: 'var(--muted)', borderRadius: 10, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 24 }}>🔥</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)' }}>Firebase Cloud Services</div>
                      <div style={{ fontSize: 11.5, color: 'var(--accent)', fontWeight: 600 }}>● Conectado (nuvida-8f975)</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
                    Autenticación segura, base de datos de expedientes Firestore y Firebase Storage activados.
                  </div>
                </div>

                <div style={{ padding: 18, background: 'var(--muted)', borderRadius: 10, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 24 }}>💬</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)' }}>WhatsApp Business API</div>
                      <div style={{ fontSize: 11.5, color: 'var(--accent)', fontWeight: 600 }}>● Activo</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
                    Envío automático de dietas en PDF y alertas directas al chat del paciente.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pwa' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--foreground)' }}>Estado de la Aplicación NuVida (Electron / PWA)</h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>Monitorea el estado de instalación, sincronización offline y notificaciones push.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                <div style={{ background: 'var(--muted)', padding: 18, borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Plataforma de Ejecución</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)', marginTop: 6 }}>
                    {nativeBridge.capabilities.isElectron ? '💻 App Escritorio Nativa (Electron)' : isInstalled ? '📱 App PWA Instalada' : '🌐 Navegador Web'}
                  </div>
                </div>

                <div style={{ background: 'var(--muted)', padding: 18, borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Conexión a Internet</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: isOnline ? 'var(--accent)' : '#D4882A', marginTop: 6 }}>
                    {isOnline ? '🟢 En Línea (Sincronizado)' : '🟠 Modo Sin Conexión (Offline)'}
                  </div>
                </div>

                <div style={{ background: 'var(--muted)', padding: 18, borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Cola de Sincronización</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)', marginTop: 6, fontFamily: 'var(--font-jetbrains)' }}>
                    {pendingOutboxCount} elementos pendientes
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: 'var(--background)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>Instalar NuVida como Software Nativo</div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>Abre la aplicación sin barras de navegación en macOS, Windows, Android e iOS.</div>
                  </div>
                  <button
                    onClick={handleInstallClick}
                    disabled={isInstalled || nativeBridge.capabilities.isElectron}
                    style={{
                      padding: '8px 18px',
                      background: isInstalled || nativeBridge.capabilities.isElectron ? 'var(--muted)' : 'var(--primary)',
                      color: isInstalled || nativeBridge.capabilities.isElectron ? 'var(--muted-foreground)' : '#fff',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: isInstalled || nativeBridge.capabilities.isElectron ? 'default' : 'pointer',
                      fontFamily: 'var(--font-jakarta)',
                    }}
                  >
                    {nativeBridge.capabilities.isElectron ? 'App Nativa Activa (Electron)' : isInstalled ? 'Aplicación Instalada' : '📲 Instalar Aplicación NuVida'}
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: 'var(--background)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>Gestión de Datos (Producción vs Demostración)</div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>Limpia la base de datos para iniciar con un consultorio 100% en blanco.</div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('¿Deseas limpiar todos los pacientes y registros para empezar en blanco?')) {
                        clearAllData()
                        alert('Base de datos reiniciada. El consultorio se encuentra 100% en blanco para producción.')
                      }
                    }}
                    style={{
                      padding: '8px 18px',
                      background: '#FDECEA',
                      color: '#E85C45',
                      border: '1px solid #F5C6CB',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-jakarta)',
                    }}
                  >
                    🗑️ Reiniciar Datos (Empezar de Cero)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
