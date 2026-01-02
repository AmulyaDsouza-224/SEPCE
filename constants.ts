
import { Patient, UrgencyLevel } from './types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'P-9901',
    name: 'Robert Chen',
    age: 62,
    gender: 'Male',
    bloodType: 'O+',
    location: 'ER Bay 4',
    admissionReason: 'Acute Chest Pain, Shortness of Breath',
    urgency: UrgencyLevel.CRITICAL,
    vitals: Array.from({ length: 10 }).map((_, i) => ({
      timestamp: new Date(Date.now() - (9 - i) * 60000).toISOString(),
      heartRate: 110 + Math.floor(Math.random() * 20),
      systolicBP: 155 + Math.floor(Math.random() * 10),
      diastolicBP: 95 + Math.floor(Math.random() * 5),
      oxygenSaturation: 88 + Math.floor(Math.random() * 5),
      respiratoryRate: 24 + Math.floor(Math.random() * 4),
      temperature: 98.6
    })),
    medications: ['Lisinopril', 'Metformin', 'Warfarin'],
    allergies: ['Penicillin', 'Latex'],
    history: 'Type 2 Diabetes, Hypertension, Previous MI in 2018.',
    alerts: [
      {
        id: 'A1',
        type: 'ABNORMAL_VITAL',
        severity: 'HIGH',
        message: 'SpO2 dropped below 90% persistent',
        timestamp: new Date().toISOString()
      },
      {
        id: 'A2',
        type: 'CONTRAINDICATION',
        severity: 'HIGH',
        message: 'Potential interaction: Patient is on Warfarin. Careful with NSAIDs.',
        timestamp: new Date().toISOString()
      }
    ],
    // Fix: Added missing required documents property
    documents: []
  },
  {
    id: 'P-9902',
    name: 'Sarah Miller',
    age: 28,
    gender: 'Female',
    bloodType: 'A-',
    location: 'ER Bay 7',
    admissionReason: 'Suspected Appendicitis',
    urgency: UrgencyLevel.URGENT,
    vitals: Array.from({ length: 10 }).map((_, i) => ({
      timestamp: new Date(Date.now() - (9 - i) * 60000).toISOString(),
      heartRate: 85 + Math.floor(Math.random() * 15),
      systolicBP: 118 + Math.floor(Math.random() * 10),
      diastolicBP: 76 + Math.floor(Math.random() * 5),
      oxygenSaturation: 98 + Math.floor(Math.random() * 2),
      respiratoryRate: 16 + Math.floor(Math.random() * 4),
      temperature: 101.2
    })),
    medications: [],
    allergies: ['Sulfa drugs'],
    history: 'Asthma (managed with inhaler).',
    alerts: [
      {
        id: 'A3',
        type: 'LAB_CRITICAL',
        severity: 'MEDIUM',
        message: 'WBC count elevated at 14.5k',
        timestamp: new Date().toISOString()
      }
    ],
    // Fix: Added missing required documents property
    documents: []
  },
  {
    id: 'P-9903',
    name: 'James Wilson',
    age: 45,
    gender: 'Male',
    bloodType: 'B+',
    location: 'Triage Room 2',
    admissionReason: 'Dislocated Shoulder',
    urgency: UrgencyLevel.MONITOR,
    vitals: Array.from({ length: 10 }).map((_, i) => ({
      timestamp: new Date(Date.now() - (9 - i) * 60000).toISOString(),
      heartRate: 72 + Math.floor(Math.random() * 10),
      systolicBP: 122 + Math.floor(Math.random() * 10),
      diastolicBP: 80 + Math.floor(Math.random() * 5),
      oxygenSaturation: 99,
      respiratoryRate: 14 + Math.floor(Math.random() * 2),
      temperature: 98.4
    })),
    medications: [],
    allergies: [],
    history: 'None significant.',
    alerts: [],
    // Fix: Added missing required documents property
    documents: []
  }
];
