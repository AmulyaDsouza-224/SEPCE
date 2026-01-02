
import { Patient, ClinicalDocument } from '../types';

const STORAGE_KEY = 'NEXUS_PATIENT_RECORDS';

export const mockStorage = {
  getPatients: (initialPatients: Patient[]): Patient[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialPatients;
    return JSON.parse(saved);
  },

  savePatient: (patient: Patient) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const patients: Patient[] = saved ? JSON.parse(saved) : [];
    const index = patients.findIndex(p => p.id === patient.id);
    
    if (index > -1) {
      patients[index] = patient;
    } else {
      patients.push(patient);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  },

  addDocument: (patientId: string, doc: ClinicalDocument) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const patients: Patient[] = JSON.parse(saved);
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      patient.documents = [...(patient.documents || []), doc];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    }
  }
};

export const otpService = {
  generate: () => Math.floor(100000 + Math.random() * 900000).toString(),
  verify: (input: string, actual: string) => input === actual
};
