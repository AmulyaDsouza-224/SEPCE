
export enum UrgencyLevel {
  CRITICAL = 'CRITICAL',
  URGENT = 'URGENT',
  STABLE = 'STABLE',
  MONITOR = 'MONITOR'
}

export interface VitalSign {
  timestamp: string;
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  oxygenSaturation: number;
  respiratoryRate: number;
  temperature: number;
}

export interface ClinicalAlert {
  id: string;
  type: 'CONTRAINDICATION' | 'ABNORMAL_VITAL' | 'LAB_CRITICAL' | 'RISK_TREND';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  timestamp: string;
}

export type DocumentCategory = 'Radiology' | 'Pathology' | 'Discharge Summary' | 'Lab Result' | 'Other';

export interface ClinicalDocument {
  id: string;
  name: string;
  type: 'PDF' | 'IMAGE' | 'SCAN' | 'LAB';
  category: DocumentCategory;
  uploadDate: string;
  size: string;
  uploader: string;
  content?: string; // Base64 or URL
}

export interface AIInsight {
  summary: string;
  keyRisks: string[];
  suggestedActions: string[];
  urgencyScore: number; // 0-100
  reasoning: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  location: string;
  admissionReason: string;
  urgency: UrgencyLevel;
  vitals: VitalSign[];
  medications: string[];
  allergies: string[];
  history: string;
  alerts: ClinicalAlert[];
  documents: ClinicalDocument[];
  aiInsight?: AIInsight;
}
