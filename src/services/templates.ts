// Template Management System for NuVida

export type TemplateType = 'plan' | 'consulta' | 'recomendaciones' | 'receta' | 'mensaje'

export interface ReusableTemplate {
  id: string
  type: TemplateType
  title: string
  description?: string
  content: any
  category?: string
  createdAt: string
}

export const DEFAULT_TEMPLATES: ReusableTemplate[] = [
  {
    id: 'tpl_plan_1',
    type: 'plan',
    title: 'Plantilla Recomposición Corporal (1500 kcal)',
    description: 'Dieta hiperproteica moderada en carbohidratos de bajo índice glucémico.',
    category: 'Pérdida de peso',
    createdAt: '2026-09-01',
    content: {
      kcal: 1500,
      macros: { p: 120, c: 150, g: 45, fibra: 28 },
      mealsCount: 5,
    },
  },
  {
    id: 'tpl_recom_1',
    type: 'recomendaciones',
    title: 'Recomendaciones Generales de Hidratación y Sueño',
    description: 'Indicaciones estándar para pacientes en primera consulta.',
    category: 'Hábitos',
    createdAt: '2026-09-01',
    content: [
      'Mantener consumo de agua natural mínimo de 2.2 a 2.5 litros diarios.',
      'Evitar pantallas de luz azul 45 minutos antes de dormir.',
      'Realizar caminata ligera de 10 a 15 minutos posterior a la comida principal.',
    ],
  },
  {
    id: 'tpl_msg_1',
    type: 'mensaje',
    title: 'Recordatorio WhatsApp Cita de Consulta',
    description: 'Mensaje automático enviado 24 horas antes de la consulta.',
    category: 'WhatsApp',
    createdAt: '2026-09-01',
    content: '¡Hola {{nombre}}! Te recordamos tu cita de consulta nutricional mañana a las {{hora}} h en Centro NuVida. Responde SI para confirmar tu asistencia.',
  },
]

class TemplateService {
  private key = 'nuvida_reusable_templates'

  public getTemplates(type?: TemplateType): ReusableTemplate[] {
    try {
      const stored = localStorage.getItem(this.key)
      const list: ReusableTemplate[] = stored ? JSON.parse(stored) : DEFAULT_TEMPLATES
      return type ? list.filter(t => t.type === type) : list
    } catch {
      return DEFAULT_TEMPLATES
    }
  }

  public saveTemplate(template: Omit<ReusableTemplate, 'id' | 'createdAt'>): ReusableTemplate {
    const newTpl: ReusableTemplate = {
      ...template,
      id: `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString().split('T')[0],
    }

    const current = this.getTemplates()
    const updated = [newTpl, ...current]
    localStorage.setItem(this.key, JSON.stringify(updated))
    return newTpl
  }
}

export const templateService = new TemplateService()
