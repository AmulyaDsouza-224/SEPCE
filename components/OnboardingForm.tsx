
import React, { useState } from 'react';
import { Patient, UrgencyLevel } from '../types';

interface Props {
  onSubmit: (patient: Patient) => void;
  onCancel: () => void;
}

const OnboardingForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    location: '',
    admissionReason: '',
    urgency: UrgencyLevel.STABLE,
    history: '',
    medications: '',
    allergies: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient: Patient = {
      id: 'P-' + Math.floor(1000 + Math.random() * 9000),
      name: formData.name,
      age: parseInt(formData.age) || 0,
      gender: formData.gender,
      bloodType: 'O+', // Default
      location: formData.location || 'ER Waiting',
      admissionReason: formData.admissionReason,
      urgency: formData.urgency,
      history: formData.history,
      medications: formData.medications.split(',').map(m => m.trim()).filter(m => m),
      allergies: formData.allergies.split(',').map(a => a.trim()).filter(a => a),
      vitals: [
        {
          timestamp: new Date().toISOString(),
          heartRate: 72,
          systolicBP: 120,
          diastolicBP: 80,
          oxygenSaturation: 98,
          respiratoryRate: 16,
          temperature: 98.6
        }
      ],
      alerts: [],
      documents: []
    };
    onSubmit(newPatient);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Full Name</label>
          <input 
            required
            type="text" 
            placeholder="e.g. John Doe"
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-semibold"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Age</label>
          <input 
            required
            type="number" 
            placeholder="e.g. 45"
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-semibold"
            value={formData.age}
            onChange={e => setFormData({...formData, age: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Location / Bay</label>
          <input 
            type="text" 
            placeholder="e.g. ER Bay 12"
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-semibold"
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Initial Urgency</label>
          <select 
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-semibold"
            value={formData.urgency}
            onChange={e => setFormData({...formData, urgency: e.target.value as UrgencyLevel})}
          >
            <option value={UrgencyLevel.CRITICAL}>Critical</option>
            <option value={UrgencyLevel.URGENT}>Urgent</option>
            <option value={UrgencyLevel.STABLE}>Stable</option>
            <option value={UrgencyLevel.MONITOR}>Monitor</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Chief Complaint / Reason for Admission</label>
        <textarea 
          required
          rows={3}
          placeholder="Detailed description of symptoms..."
          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-semibold resize-none"
          value={formData.admissionReason}
          onChange={e => setFormData({...formData, admissionReason: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Medications (comma separated)</label>
          <input 
            type="text" 
            placeholder="Aspirin, Metformin..."
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-semibold"
            value={formData.medications}
            onChange={e => setFormData({...formData, medications: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Allergies (comma separated)</label>
          <input 
            type="text" 
            placeholder="Nuts, Penicillin..."
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-semibold"
            value={formData.allergies}
            onChange={e => setFormData({...formData, allergies: e.target.value})}
          />
        </div>
      </div>

      <div className="pt-6 flex flex-col md:flex-row gap-4">
        <button 
          type="submit"
          className="flex-1 py-5 bg-teal-600 text-white rounded-3xl font-bold text-lg shadow-2xl shadow-teal-500/30 hover:bg-teal-700 transition-all active:scale-[0.98]"
        >
          Begin Clinical Contextualization
        </button>
        <button 
          type="button"
          onClick={onCancel}
          className="px-10 py-5 bg-slate-100 text-slate-600 rounded-3xl font-bold text-lg hover:bg-slate-200 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default OnboardingForm;
