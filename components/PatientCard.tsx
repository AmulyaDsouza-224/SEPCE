
import React from 'react';
import { Patient, UrgencyLevel } from '../types';
import UrgencyBadge from './UrgencyBadge';

interface Props {
  patient: Patient;
  onClick: () => void;
}

const PatientCard: React.FC<Props> = ({ patient, onClick }) => {
  const latestVitals = patient.vitals[patient.vitals.length - 1];

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-400 cursor-pointer transition-all hover:shadow-lg group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{patient.name}</h3>
          <p className="text-xs text-slate-500 font-medium">{patient.id} • {patient.age}y {patient.gender}</p>
        </div>
        <UrgencyBadge level={patient.urgency} />
      </div>

      <div className="grid grid-cols-2 gap-y-3 mb-4">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-bed text-slate-400 w-4"></i>
          <span className="text-sm text-slate-600">{patient.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-heart-pulse text-rose-500 w-4"></i>
          <span className="text-sm font-semibold">{latestVitals.heartRate} BPM</span>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-slate-400 font-medium uppercase mb-1">Chief Complaint</p>
          <p className="text-sm text-slate-700 line-clamp-1">{patient.admissionReason}</p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
        <div className="flex -space-x-2">
          {patient.alerts.length > 0 && (
             <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center border-2 border-white">
               <i className="fa-solid fa-triangle-exclamation text-rose-500 text-xs"></i>
             </div>
          )}
          {patient.allergies.length > 0 && (
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center border-2 border-white">
              <i className="fa-solid fa-shield-virus text-amber-500 text-xs"></i>
            </div>
          )}
        </div>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">View Profile <i className="fa-solid fa-arrow-right ml-1"></i></span>
      </div>
    </div>
  );
};

export default PatientCard;
