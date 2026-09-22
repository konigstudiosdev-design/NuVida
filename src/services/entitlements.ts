// Centralized SaaS Subscription Entitlements Engine for NuVida

export type PlanTier = 'FREE' | 'PRO' | 'BUSINESS' | 'CLINIC'

export interface Entitlements {
  maxPatients: number
  maxStaff: number
  hasAiCopilot: boolean
  hasPdfExport: boolean
  hasAutomatedWhatsapp: boolean
  hasMultiClinic: boolean
  hasCustomDomain: boolean
}

export const PLAN_LIMITS: Record<PlanTier, Entitlements> = {
  FREE: {
    maxPatients: 10,
    maxStaff: 1,
    hasAiCopilot: false,
    hasPdfExport: true,
    hasAutomatedWhatsapp: false,
    hasMultiClinic: false,
    hasCustomDomain: false,
  },
  PRO: {
    maxPatients: 100,
    maxStaff: 3,
    hasAiCopilot: true,
    hasPdfExport: true,
    hasAutomatedWhatsapp: true,
    hasMultiClinic: false,
    hasCustomDomain: false,
  },
  BUSINESS: {
    maxPatients: 500,
    maxStaff: 10,
    hasAiCopilot: true,
    hasPdfExport: true,
    hasAutomatedWhatsapp: true,
    hasMultiClinic: true,
    hasCustomDomain: false,
  },
  CLINIC: {
    maxPatients: 999999, // Unlimited
    maxStaff: 999,
    hasAiCopilot: true,
    hasPdfExport: true,
    hasAutomatedWhatsapp: true,
    hasMultiClinic: true,
    hasCustomDomain: true,
  },
}

export class EntitlementsService {
  public static canAddPatient(currentCount: number, plan: PlanTier): boolean {
    return currentCount < PLAN_LIMITS[plan].maxPatients
  }

  public static canAddStaff(currentCount: number, plan: PlanTier): boolean {
    return currentCount < PLAN_LIMITS[plan].maxStaff
  }

  public static canUseAI(plan: PlanTier): boolean {
    return PLAN_LIMITS[plan].hasAiCopilot
  }

  public static canExportPDF(plan: PlanTier): boolean {
    return PLAN_LIMITS[plan].hasPdfExport
  }

  public static canUseAutomatedWhatsapp(plan: PlanTier): boolean {
    return PLAN_LIMITS[plan].hasAutomatedWhatsapp
  }
}
