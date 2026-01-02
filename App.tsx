
import React, { useState, useEffect } from 'react';
import { MOCK_PATIENTS } from './constants';
import { Patient, UrgencyLevel, ClinicalDocument } from './types';
import PatientCard from './components/PatientCard';
import UrgencyBadge from './components/UrgencyBadge';
import VitalsDisplay from './components/VitalsDisplay';
import OtpModal from './components/OtpModal';
import DocumentRepository from './components/DocumentRepository';
import OnboardingForm from './components/OnboardingForm';
import { generateClinicalInsight } from './services/geminiService';
import { mockStorage } from './services/storageService';

type ViewState = 'DASHBOARD' | 'ONBOARDING' | 'DOCUMENTS' | 'SETTINGS';

const App: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [analyzing, setAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'ALL' | UrgencyLevel>('ALL');
  
  // Security State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  useEffect(() => {
    const storedPatients = mockStorage.getPatients(MOCK_PATIENTS);
    setPatients(storedPatients);
  }, []);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const handlePatientSelect = (id: string) => {
    setSelectedPatientId(id);
    setIsUnlocked(false);
    setCurrentView('DASHBOARD');
  };

  const handleUpload = (doc: ClinicalDocument) => {
    if (!selectedPatientId) return;
    mockStorage.addDocument(selectedPatientId, doc);
    setPatients(prev => prev.map(p => 
      p.id === selectedPatientId ? { ...p, documents: [...(p.documents || []), doc] } : p
    ));
  };

  const handleAddPatient = (newPatient: Patient) => {
    mockStorage.savePatient(newPatient);
    setPatients(prev => [newPatient, ...prev]);
    setSelectedPatientId(newPatient.id);
    setCurrentView('DASHBOARD');
  };

  const runAiAnalysis = async () => {
    if (!selectedPatient) return;
    setAnalyzing(true);
    try {
      const insight = await generateClinicalInsight(selectedPatient);
      const updatedPatient = { ...selectedPatient, aiInsight: insight };
      setPatients(prev => prev.map(p => p.id === selectedPatient.id ? updatedPatient : p));
      mockStorage.savePatient(updatedPatient);
    } finally {
      setAnalyzing(false);
    }
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'ALL' || p.urgency === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row h-screen overflow-hidden bg-slate-50">
      <OtpModal 
        isOpen={showOtpModal} 
        onVerify={() => { setIsUnlocked(true); setShowOtpModal(false); }}
        onCancel={() => setShowOtpModal(false)}
      />

      {/* Modern Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-slate-900 text-white flex flex-col overflow-hidden">
        <div className="p-8 border-b border-slate-800/50">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-teal-500/20 rotate-3">
              <i className="fa-solid fa-vanguard-item text-2xl text-white"></i>
              <span className="font-black text-white text-xl">V</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tighter text-white">VANGUARD</h1>
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-[0.2em]">PULSE SYSTEM</span>
            </div>
          </div>

          <div className="space-y-1">
            {[
              { id: 'DASHBOARD', icon: 'fa-chart-pie', label: 'Clinical Hub' },
              { id: 'ONBOARDING', icon: 'fa-user-plus', label: 'Patient Intake' },
              { id: 'DOCUMENTS', icon: 'fa-folder-tree', label: 'Telemetry Vault' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as ViewState)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${currentView === item.id ? 'active-nav-item' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <i className={`fa-solid ${item.icon} w-5`}></i>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Census</span>
            <span className="bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded-full text-[10px] font-bold">{filteredPatients.length}</span>
          </div>
          
          <div className="space-y-2">
            {filteredPatients.map(p => (
              <button 
                key={p.id}
                onClick={() => handlePatientSelect(p.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all border ${selectedPatientId === p.id ? 'bg-slate-800 border-teal-500/50 shadow-lg' : 'bg-transparent border-transparent hover:bg-slate-800/40'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-bold text-sm ${selectedPatientId === p.id ? 'text-white' : 'text-slate-300'}`}>{p.name}</span>
                  <div className={`w-2 h-2 rounded-full ${p.urgency === UrgencyLevel.CRITICAL ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse' : p.urgency === UrgencyLevel.URGENT ? 'bg-amber-500' : 'bg-teal-500'}`}></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                  <span>{p.id}</span>
                  <span>{p.location}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-slate-950/40 border-t border-slate-800/50">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Dr" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate text-white">Dr. Sarah Vance</p>
                <p className="text-[10px] text-teal-500 font-bold uppercase tracking-wider">Chief Medical Officer</p>
              </div>
              <button className="text-slate-500 hover:text-white transition-colors">
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative scrollbar-hide">
        {currentView === 'ONBOARDING' ? (
          <div className="page-transition p-8 md:p-16 max-w-4xl mx-auto">
             <div className="mb-12">
               <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Patient Intake</h2>
               <p className="text-slate-500 font-medium">Initialize a new patient context and telemetry stream.</p>
             </div>
             <OnboardingForm onSubmit={handleAddPatient} onCancel={() => setCurrentView('DASHBOARD')} />
          </div>
        ) : currentView === 'DOCUMENTS' && selectedPatient ? (
           <div className="page-transition p-8 md:p-16 max-w-5xl mx-auto space-y-12">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Telemetry Vault</h2>
                  <p className="text-slate-500 font-medium">Clinical documents and external records for <span className="text-teal-600 font-bold">{selectedPatient.name}</span></p>
                </div>
              </div>
              <section className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-200/60 relative overflow-hidden">
                {!isUnlocked && (
                  <div className="absolute inset-0 z-30 bg-slate-50/40 backdrop-blur-md flex flex-col items-center justify-center text-center p-12">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 text-slate-400 shadow-2xl">
                      <i className="fa-solid fa-fingerprint text-4xl"></i>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Security Clearance Required</h3>
                    <p className="text-slate-500 max-w-xs mb-8 text-sm font-medium">Historical telemetry and medical records are encrypted. Verify identity via OTP.</p>
                    <button 
                      onClick={() => setShowOtpModal(true)}
                      className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-3"
                    >
                      <i className="fa-solid fa-shield-halved"></i>
                      Unlock Clinical Vault
                    </button>
                  </div>
                )}
                <DocumentRepository patient={selectedPatient} onUpload={handleUpload} />
              </section>
           </div>
        ) : selectedPatient ? (
          <div className="page-transition p-8 md:p-12 max-w-7xl mx-auto space-y-10">
            {/* Context Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div>
                <div className="flex items-center gap-5 mb-3">
                  <h2 className="text-4xl font-extrabold text-slate-900 tracking-tighter">{selectedPatient.name}</h2>
                  <UrgencyBadge level={selectedPatient.urgency} />
                </div>
                <div className="flex flex-wrap gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200"><i className="fa-solid fa-fingerprint text-teal-500"></i> {selectedPatient.id}</span>
                  <span className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200"><i className="fa-solid fa-person-half-dress text-teal-500"></i> {selectedPatient.age}y {selectedPatient.gender}</span>
                  <span className="flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-600 rounded-full border border-teal-100"><i className="fa-solid fa-map-pin"></i> {selectedPatient.location}</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={runAiAnalysis}
                  disabled={analyzing}
                  className={`px-8 py-4 rounded-2xl font-bold text-sm shadow-2xl flex items-center gap-3 transition-all ${analyzing ? 'bg-teal-400 cursor-wait' : 'bg-teal-600 hover:bg-teal-700 active:scale-95'} text-white shadow-teal-500/20`}
                >
                  {analyzing ? <i className="fa-solid fa-hurricane animate-spin text-lg"></i> : <i className="fa-solid fa-wand-magic-sparkles text-lg"></i>}
                  {analyzing ? 'Processing Context...' : 'AI Pulse Analysis'}
                </button>
              </div>
            </div>

            {/* AI Engine Output */}
            {selectedPatient.aiInsight && (
              <div className="bg-slate-900 text-white rounded-[40px] p-10 border-b-8 border-teal-500 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-[-20px] right-[-20px] p-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity rotate-12">
                  <i className="fa-solid fa-brain text-[15rem]"></i>
                </div>
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center justify-between">
                    <span className="px-4 py-1.5 bg-teal-500/20 text-teal-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-teal-500/30">Vanguard AI Core</span>
                    <span className="text-slate-500 text-[10px] font-black uppercase">Urgency Score: {selectedPatient.aiInsight.urgencyScore}%</span>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
                           <i className="fa-solid fa-comment-medical text-teal-400 text-sm"></i>
                        </div>
                        Clinical Executive Summary
                      </h3>
                      <p className="text-slate-400 leading-relaxed text-sm font-medium">{selectedPatient.aiInsight.summary}</p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-bold flex items-center gap-3 text-rose-400">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                           <i className="fa-solid fa-triangle-exclamation text-rose-400 text-sm"></i>
                        </div>
                        Actionable Risk Factors
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {selectedPatient.aiInsight.keyRisks.map((risk, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 text-sm font-medium text-slate-300">
                            <i className="fa-solid fa-circle text-rose-500 text-[6px]"></i>
                            {risk}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Vitals Column */}
              <div className="lg:col-span-8 space-y-8">
                <section className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-200/60">
                   <div className="flex justify-between items-center mb-10">
                      <div>
                        <h4 className="text-lg font-extrabold text-slate-900 tracking-tight">Physiological Telemetry</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Last Updated: Just Now</p>
                      </div>
                      <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-2xl">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Stream</span>
                      </div>
                   </div>
                   <VitalsDisplay vitals={selectedPatient.vitals} />
                </section>
              </div>

              {/* Sidebar Info */}
              <div className="lg:col-span-4 space-y-8">
                <section className="bg-rose-50/50 p-8 rounded-[40px] border border-rose-100 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-rose-600">Acute Alerts</h4>
                    <span className="bg-rose-600 text-white w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-bold">{selectedPatient.alerts.length}</span>
                  </div>
                  <div className="space-y-4">
                    {selectedPatient.alerts.length > 0 ? selectedPatient.alerts.map(alert => (
                      <div key={alert.id} className="bg-white p-5 rounded-3xl border border-rose-200/50 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                        <p className="text-[10px] font-black text-rose-500 uppercase mb-2 tracking-widest">{alert.type.replace('_', ' ')}</p>
                        <p className="text-sm font-bold text-slate-900 leading-snug">{alert.message}</p>
                      </div>
                    )) : (
                      <div className="text-center py-6 opacity-40">
                         <i className="fa-solid fa-circle-check text-2xl mb-2 text-slate-400"></i>
                         <p className="text-xs font-bold uppercase tracking-widest">No Acute Alerts</p>
                      </div>
                    )}
                  </div>
                </section>

                <section className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl space-y-8">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Medication Protocol</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.medications.map(med => (
                        <span key={med} className="px-4 py-2 bg-slate-800 text-teal-400 rounded-2xl text-xs font-bold border border-slate-700/50">{med}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 text-rose-400">Biological Allergies</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.allergies.map(alg => (
                        <span key={alg} className="px-4 py-2 bg-rose-500/10 text-rose-400 rounded-2xl text-xs font-bold border border-rose-500/20">{alg}</span>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white">
             <div className="w-32 h-32 bg-slate-50 rounded-[48px] flex items-center justify-center mb-10 shadow-inner group cursor-pointer hover:bg-teal-500 transition-colors">
               <i className="fa-solid fa-house-medical text-5xl text-slate-200 group-hover:text-white transition-colors"></i>
             </div>
             <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tighter">Clinical Command Dashboard</h2>
             <p className="text-slate-500 max-w-md mb-12 text-lg font-medium">Synchronize with an active patient stream to begin context-aware monitoring.</p>
             <button 
               onClick={() => setCurrentView('ONBOARDING')}
               className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-bold shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-3"
             >
               <i className="fa-solid fa-user-plus"></i>
               New Patient Intake
             </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
