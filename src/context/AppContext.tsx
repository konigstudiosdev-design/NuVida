import React, { createContext, useContext, useState } from 'react'

// ----------------------------------------------------------------------
// TYPES & DOMAIN MODELS
// ----------------------------------------------------------------------

export type UserRole = 'nutriologo' | 'recepcionista' | 'paciente'
export type WorkspaceMode = 'nutriologo' | 'paciente'
export type PlanTier = 'FREE' | 'PRO' | 'BUSINESS' | 'CLINIC'

export interface Organization {
  id: string
  name: string
  slug: string
  planTier: PlanTier
  patientsLimit: number
  patientsCount: number
  membersCount: number
}

export interface PatientExpediente {
  antecedentesMedicos: string[]
  enfermedades: string[]
  alergias: string[]
  medicamentos: string[]
  suplementos: string[]
  cirugias: string[]
  intolerancias: string[]
  restricciones: string[]
  preferenciasAlimentarias: string[]
  habitos: {
    actividadFisica: string
    suenoHoras: number
    consumoAguaLitros: number
    fuma: boolean
    alcohol: string
  }
}

export interface AnthropometryEntry {
  id: number
  patientId: number
  date: string
  pesoKg: number
  alturaCm: number
  imc: number
  grasaPct: number
  masaGrasaKg: number
  masaMuscularKg: number
  masaLibreGrasaKg: number
  aguaCorporalPct: number
  cinturaCm: number
  caderaCm: number
  brazoCm: number
  musloCm: number
  pechoCm: number
  plieguesMm?: {
    triceps: number
    biceps: number
    subescapular: number
    suprailiaco: number
  }
}

export interface ProgressPhoto {
  id: number
  patientId: number
  date: string
  tag: 'Frente' | 'Perfil' | 'Espalda'
  imageUrl: string
  notes?: string
}

export interface Patient {
  id: number
  name: string
  photoUrl?: string
  dob: string
  age: number
  gender: 'Femenino' | 'Masculino'
  email: string
  phone: string
  whatsapp: string
  occupation: string
  goal: string
  lastConsult: string
  nextConsult: string
  status: 'activo' | 'inactivo' | 'riesgo_desercion'
  progress: number
  imc: number
  weight: number
  height: number
  sessions: number
  planExpiringSoon?: boolean
  pendingPaymentAmount?: number
  expediente: PatientExpediente
}

export interface Consultation {
  id: number
  patientId: number
  patientName: string
  date: string
  time: string
  type: 'Primera consulta' | 'Seguimiento' | 'Evaluación antropométrica'
  motivo: string
  evolucion: string
  adherenciaPct: number
  dificultades: string
  observaciones: string
  recomendaciones: string[]
  objetivosProximaConsulta: string
  proximaConsultaFecha: string
  pesoKg: number
  imc: number
  planName: string
  status: 'completada' | 'en progreso' | 'pendiente'
  deltaPeso: string
}

export interface FoodItem {
  id: number
  name: string
  cat: 'Proteínas' | 'Cereales' | 'Frutas' | 'Verduras' | 'Grasas' | 'Lácteos' | 'Leguminosas' | 'Bebidas' | 'Snacks' | 'Suplementos'
  kcal: number
  p: number
  c: number
  g: number
  fibraG: number
  unit: string
  tags: string[]
  equivalentesSMAE?: string
}

export interface RecipeItem {
  id: number
  name: string
  photoUrl?: string
  timeMin: number
  kcal: number
  p: number
  c: number
  g: number
  servings: number
  ingredients: { foodName: string; amount: string }[]
  preparationSteps: string[]
}

export interface MealItem {
  name: string
  time: string
  foods: { foodName: string; amount: string; kcal: number; p: number; c: number; g: number }[]
  substitutions?: string[]
}

export interface DailyMenu {
  dayName: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo'
  meals: MealItem[]
}

export interface MealPlan {
  id: number
  name: string
  patientId: number
  patientName: string
  kcal: number
  macros: { p: number; c: number; g: number; fibra: number }
  since: string
  until: string
  status: 'activo' | 'borrador' | 'expirado'
  weeklyMenu: DailyMenu[]
}

export interface ShoppingListItem {
  id: string
  category: string
  item: string
  amount: string
  bought: boolean
}

export interface Appointment {
  id: number
  patientId: number
  patientName: string
  date: string
  time: string
  type: string
  status: 'confirmada' | 'pendiente' | 'reprogramada' | 'cancelada' | 'asistio' | 'no_asistio'
  durationMin: number
  channelSync?: { googleCal: boolean; appleCal: boolean; whatsappSent: boolean }
}

export interface NotificationItem {
  id: string
  type: 'cita' | 'confirmacion' | 'plan' | 'pago' | 'seguimiento' | 'ia_alert'
  title: string
  message: string
  time: string
  read: boolean
  patientName?: string
  channel: 'WhatsApp' | 'Email' | 'Push' | 'System'
}

export interface Payment {
  id: string
  patientId: number
  patientName: string
  date: string
  concept: string
  amount: number
  pendingBalance: number
  method: 'Efectivo' | 'Transferencia' | 'Tarjeta'
  status: 'pagado' | 'pendiente' | 'vencido'
}

export interface AiSuggestion {
  type: 'resumen_evolucion' | 'analisis_cambios' | 'sugerencia_menu' | 'alerta_desercion' | 'recomendacion_clinica'
  title: string
  patientName: string
  summary: string
  details: string[]
  approved?: boolean
}

type ModalType =
  | 'nuevo-paciente'
  | 'nueva-consulta'
  | 'capturar-antropometria'
  | 'nuevo-plan'
  | 'editor-semanal'
  | 'nuevo-alimento'
  | 'nueva-receta'
  | 'nueva-cita'
  | 'registrar-pago'
  | 'command-palette'
  | 'expediente'
  | 'pdf-preview'
  | 'asistente-ia'
  | 'comparador-fotos'
  | 'upgrade-plan'
  | null

interface AppContextType {
  organization: Organization
  currentRole: UserRole
  workspaceMode: WorkspaceMode
  setWorkspaceMode: (mode: WorkspaceMode) => void
  setCurrentRole: (role: UserRole) => void

  patients: Patient[]
  consultations: Consultation[]
  anthropometry: AnthropometryEntry[]
  progressPhotos: ProgressPhoto[]
  plans: MealPlan[]
  foods: FoodItem[]
  recipes: RecipeItem[]
  shoppingList: ShoppingListItem[]
  appointments: Appointment[]
  notifications: NotificationItem[]
  payments: Payment[]
  aiSuggestions: AiSuggestion[]

  activeModal: ModalType
  selectedPatientId: number | null
  selectedPlanForPdf: MealPlan | null

  openModal: (modal: ModalType, payload?: { patientId?: number; plan?: MealPlan }) => void
  closeModal: () => void

  clearAllData: () => void

  addPatient: (p: Omit<Patient, 'id' | 'expediente'> & { expediente?: Partial<PatientExpediente> }) => void
  addConsultation: (c: Omit<Consultation, 'id'>) => void
  addAnthropometry: (a: Omit<AnthropometryEntry, 'id'>) => void
  addProgressPhoto: (photo: Omit<ProgressPhoto, 'id'>) => void
  addMealPlan: (p: Omit<MealPlan, 'id'>) => void
  addFood: (f: Omit<FoodItem, 'id'>) => void
  addRecipe: (r: Omit<RecipeItem, 'id'>) => void
  toggleShoppingItem: (id: string) => void
  addAppointment: (a: Omit<Appointment, 'id'>) => void
  updateAppointmentStatus: (id: number, status: Appointment['status']) => void
  addPayment: (p: Omit<Payment, 'id'>) => void
  markNotificationRead: (id: string) => void
  approveAiSuggestion: (index: number) => void

  loggedWaterLiters: number
  addWaterLog: (amount: number) => void
  loggedMealsCount: number
  toggleMealLogged: () => void
}

const INITIAL_ORG: Organization = {
  id: 'org_nuvida',
  name: 'Centro Nutricional NuVida',
  slug: 'nuvida-del-valle',
  planTier: 'PRO',
  patientsLimit: 100,
  patientsCount: 0,
  membersCount: 2,
}

const INITIAL_FOODS: FoodItem[] = [
  { id: 1, name: 'Pechuga de pollo sin piel', cat: 'Proteínas', kcal: 165, p: 31, c: 0, g: 3.6, fibraG: 0, unit: '100 g', tags: ['sin gluten', 'magro', 'SMAE'] },
  { id: 2, name: 'Salmón fresco a la plancha', cat: 'Proteínas', kcal: 208, p: 20, c: 0, g: 13, fibraG: 0, unit: '100 g', tags: ['omega-3', 'keto', 'SMAE'] },
  { id: 3, name: 'Avena integral en hojuelas', cat: 'Cereales', kcal: 389, p: 17, c: 66, g: 7, fibraG: 10.6, unit: '½ taza (40g)', tags: ['fibra', 'beta-glucanos', 'bajo IG'] },
  { id: 4, name: 'Espinaca fresca baby', cat: 'Verduras', kcal: 23, p: 2.9, c: 3.6, g: 0.4, fibraG: 2.2, unit: '2 tazas (100g)', tags: ['hierro', 'calcio', 'libre'] },
  { id: 5, name: 'Aguacate Hass', cat: 'Grasas', kcal: 160, p: 2, c: 9, g: 15, fibraG: 6.7, unit: '⅓ pieza (50g)', tags: ['monoinsaturada', 'potasio'] },
]

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organization] = useState<Organization>(INITIAL_ORG)
  const [currentRole, setCurrentRole] = useState<UserRole>('nutriologo')
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>('nutriologo')

  const [patients, setPatients] = useState<Patient[]>([])
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [anthropometry, setAnthropometry] = useState<AnthropometryEntry[]>([])
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([])
  const [plans, setPlans] = useState<MealPlan[]>([])
  const [foods, setFoods] = useState<FoodItem[]>(INITIAL_FOODS)
  const [recipes, setRecipes] = useState<RecipeItem[]>([])
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[]>([])

  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null)
  const [selectedPlanForPdf, setSelectedPlanForPdf] = useState<MealPlan | null>(null)

  const [loggedWaterLiters, setLoggedWaterLiters] = useState(0)
  const [loggedMealsCount, setLoggedMealsCount] = useState(0)

  const openModal = (modal: ModalType, payload?: { patientId?: number; plan?: MealPlan }) => {
    setActiveModal(modal)
    if (payload?.patientId !== undefined) setSelectedPatientId(payload.patientId)
    if (payload?.plan !== undefined) setSelectedPlanForPdf(payload.plan)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  const clearAllData = () => {
    setPatients([])
    setConsultations([])
    setAnthropometry([])
    setProgressPhotos([])
    setPlans([])
    setShoppingList([])
    setAppointments([])
    setNotifications([])
    setPayments([])
    setAiSuggestions([])
  }

  const addPatient = (p: Omit<Patient, 'id' | 'expediente'> & { expediente?: Partial<PatientExpediente> }) => {
    const id = Date.now()
    const newPatient: Patient = {
      ...p,
      id,
      expediente: {
        antecedentesMedicos: p.expediente?.antecedentesMedicos || [],
        enfermedades: p.expediente?.enfermedades || [],
        alergias: p.expediente?.alergias || [],
        medicamentos: p.expediente?.medicamentos || [],
        suplementos: p.expediente?.suplementos || [],
        cirugias: p.expediente?.cirugias || [],
        intolerancias: p.expediente?.intolerancias || [],
        restricciones: p.expediente?.restricciones || [],
        preferenciasAlimentarias: p.expediente?.preferenciasAlimentarias || [],
        habitos: p.expediente?.habitos || { actividadFisica: 'Moderada', suenoHoras: 7, consumoAguaLitros: 2, fuma: false, alcohol: 'Ocasional' },
      },
    }
    setPatients(prev => [newPatient, ...prev])
    setSelectedPatientId(id)
    organization.patientsCount = (organization.patientsCount || 0) + 1
    closeModal()
  }

  const addConsultation = (c: Omit<Consultation, 'id'>) => {
    const newConsultation: Consultation = { ...c, id: Date.now() }
    setConsultations(prev => [newConsultation, ...prev])

    // Synchronize Patient Record
    setPatients(prev => prev.map(p => {
      if (p.id === c.patientId) {
        return {
          ...p,
          weight: c.pesoKg || p.weight,
          imc: c.imc || p.imc,
          lastConsult: c.date,
          nextConsult: c.proximaConsultaFecha || p.nextConsult,
          sessions: (p.sessions || 0) + 1,
        }
      }
      return p
    }))

    closeModal()
  }

  const addAnthropometry = (a: Omit<AnthropometryEntry, 'id'>) => {
    const newEntry: AnthropometryEntry = { ...a, id: Date.now() }
    setAnthropometry(prev => [newEntry, ...prev])

    // Synchronize Patient Record
    setPatients(prev => prev.map(p => {
      if (p.id === a.patientId) {
        return {
          ...p,
          weight: a.pesoKg || p.weight,
          imc: a.imc || p.imc,
        }
      }
      return p
    }))

    closeModal()
  }

  const addProgressPhoto = (photo: Omit<ProgressPhoto, 'id'>) => {
    const newPhoto: ProgressPhoto = { ...photo, id: Date.now() }
    setProgressPhotos(prev => [newPhoto, ...prev])
    closeModal()
  }

  const addMealPlan = (p: Omit<MealPlan, 'id'>) => {
    const newPlan: MealPlan = { ...p, id: Date.now() }
    setPlans(prev => [newPlan, ...prev])
    closeModal()
  }

  const addFood = (f: Omit<FoodItem, 'id'>) => {
    const newFood: FoodItem = { ...f, id: Date.now() }
    setFoods(prev => [newFood, ...prev])
    closeModal()
  }

  const addRecipe = (r: Omit<RecipeItem, 'id'>) => {
    const newRecipe: RecipeItem = { ...r, id: Date.now() }
    setRecipes(prev => [newRecipe, ...prev])
    closeModal()
  }

  const toggleShoppingItem = (id: string) => {
    setShoppingList(prev => prev.map(item => item.id === id ? { ...item, bought: !item.bought } : item))
  }

  const addAppointment = (a: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = { ...a, id: Date.now() }
    setAppointments(prev => [newAppointment, ...prev])
    closeModal()
  }

  const updateAppointmentStatus = (id: number, status: Appointment['status']) => {
    setAppointments(prev => prev.map(app => app.id === id ? { ...app, status } : app))
  }

  const addPayment = (p: Omit<Payment, 'id'>) => {
    const newPayment: Payment = { ...p }
    setPayments(prev => [newPayment, ...prev])
    closeModal()
  }

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const approveAiSuggestion = (index: number) => {
    setAiSuggestions(prev => prev.map((s, i) => i === index ? { ...s, approved: true } : s))
  }

  const addWaterLog = (amount: number) => {
    setLoggedWaterLiters(prev => parseFloat((prev + amount).toFixed(1)))
  }

  const toggleMealLogged = () => {
    setLoggedMealsCount(prev => prev + 1)
  }

  return (
    <AppContext.Provider
      value={{
        organization,
        currentRole,
        workspaceMode,
        setWorkspaceMode,
        setCurrentRole,
        patients,
        consultations,
        anthropometry,
        progressPhotos,
        plans,
        foods,
        recipes,
        shoppingList,
        appointments,
        notifications,
        payments,
        aiSuggestions,
        activeModal,
        selectedPatientId,
        selectedPlanForPdf,
        openModal,
        closeModal,
        clearAllData,
        addPatient,
        addConsultation,
        addAnthropometry,
        addProgressPhoto,
        addMealPlan,
        addFood,
        addRecipe,
        toggleShoppingItem,
        addAppointment,
        updateAppointmentStatus,
        addPayment,
        markNotificationRead,
        approveAiSuggestion,
        loggedWaterLiters,
        addWaterLog,
        loggedMealsCount,
        toggleMealLogged,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within an AppProvider')
  return context
}
