
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VitalSign } from '../types';

interface Props {
  vitals: VitalSign[];
}

const VitalsDisplay: React.FC<Props> = ({ vitals }) => {
  const latest = vitals[vitals.length - 1];

  const StatBox = ({ label, value, unit, colorClass }: any) => (
    <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100/50 flex flex-col items-center justify-center transition-all hover:shadow-xl hover:-translate-y-1">
      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">{label}</span>
      <div className={`text-3xl font-bold font-mono tracking-tighter ${colorClass}`}>{value}</div>
      <span className="text-[9px] text-slate-400 font-bold uppercase mt-1">{unit}</span>
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatBox label="Heart Rate" value={latest.heartRate} unit="BPM" colorClass="text-rose-500" />
        <StatBox label="Blood Pressure" value={`${latest.systolicBP}/${latest.diastolicBP}`} unit="mmHg" colorClass="text-teal-600" />
        <StatBox label="Oxygen Sat." value={latest.oxygenSaturation} unit="%" colorClass="text-sky-500" />
        <StatBox label="Respiration" value={latest.respiratoryRate} unit="B/M" colorClass="text-amber-500" />
      </div>

      <div className="h-80 bg-slate-900 p-8 rounded-[40px] shadow-2xl relative">
        <div className="absolute top-8 left-8">
           <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Continuous Trend Mapping</h4>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={vitals} margin={{ top: 40, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorO2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
            <XAxis dataKey="timestamp" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              labelStyle={{ display: 'none' }}
            />
            <Area type="monotone" dataKey="heartRate" stroke="#f43f5e" fillOpacity={1} fill="url(#colorHr)" strokeWidth={3} name="Heart Rate" />
            <Area type="monotone" dataKey="oxygenSaturation" stroke="#0d9488" fillOpacity={1} fill="url(#colorO2)" strokeWidth={3} name="Oxygen" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VitalsDisplay;
