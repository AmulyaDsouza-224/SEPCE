
import React, { useRef, useState } from 'react';
import { ClinicalDocument, Patient, DocumentCategory } from '../types';

interface Props {
  patient: Patient;
  onUpload: (doc: ClinicalDocument) => void;
}

const CATEGORIES: DocumentCategory[] = ['Radiology', 'Pathology', 'Discharge Summary', 'Lab Result', 'Other'];

const DocumentRepository: React.FC<Props> = ({ patient, onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<'ALL' | DocumentCategory>('ALL');
  const [pendingFile, setPendingFile] = useState<{ file: File; base64: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>('Other');
  const [previewDoc, setPreviewDoc] = useState<ClinicalDocument | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPendingFile({
        file,
        base64: event.target?.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const confirmUpload = () => {
    if (!pendingFile) return;
    
    const newDoc: ClinicalDocument = {
      id: 'DOC-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      name: pendingFile.file.name,
      type: pendingFile.file.type.includes('pdf') ? 'PDF' : pendingFile.file.type.includes('image') ? 'IMAGE' : 'LAB',
      category: selectedCategory,
      uploadDate: new Date().toISOString(),
      size: (pendingFile.file.size / 1024 / 1024).toFixed(2) + ' MB',
      uploader: 'Dr. Vance',
      content: pendingFile.base64
    };
    
    onUpload(newDoc);
    setPendingFile(null);
    setSelectedCategory('Other');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'PDF': return 'fa-file-pdf text-rose-500';
      case 'IMAGE': return 'fa-file-image text-sky-500';
      case 'LAB': return 'fa-flask-vial text-amber-500';
      default: return 'fa-file-medical text-slate-400';
    }
  };

  const filteredDocuments = (patient.documents || []).filter(doc => 
    filter === 'ALL' || doc.category === filter
  );

  return (
    <div className="space-y-6">
      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setPreviewDoc(null)}></div>
          <div className="relative bg-white rounded-[32px] w-full max-w-5xl h-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl">
                  <i className={`fa-solid ${getIcon(previewDoc.type)}`}></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{previewDoc.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-black uppercase tracking-wider">
                      {previewDoc.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{previewDoc.size} • {new Date(previewDoc.uploadDate).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            
            <div className="flex-1 overflow-auto bg-slate-100 p-4 md:p-8 flex items-center justify-center">
              {previewDoc.type === 'IMAGE' ? (
                <img src={previewDoc.content} alt={previewDoc.name} className="max-w-full h-auto rounded-lg shadow-lg border border-slate-200" />
              ) : previewDoc.type === 'PDF' ? (
                <iframe src={previewDoc.content} title={previewDoc.name} className="w-full h-full rounded-lg shadow-lg bg-white" />
              ) : (
                <div className="bg-white p-12 rounded-3xl shadow-lg text-center max-w-md">
                   <i className="fa-solid fa-file-circle-exclamation text-4xl text-amber-500 mb-4"></i>
                   <h4 className="text-lg font-bold text-slate-900 mb-2">Unsupported Preview</h4>
                   <p className="text-sm text-slate-500 mb-6">This document type cannot be previewed directly. Please download the file to view its contents.</p>
                   <a href={previewDoc.content} download={previewDoc.name} className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm">Download File</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header & Main Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Clinical Documents</h4>
          <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">Total Records: {patient.documents?.length || 0}</p>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="text-xs font-bold bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
        >
          <i className="fa-solid fa-cloud-arrow-up"></i>
          Import Record
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </div>

      {/* Upload Confirmation Overlay/UI */}
      {pendingFile && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 animate-in slide-in-from-top duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                <i className="fa-solid fa-file-circle-plus text-xl"></i>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{pendingFile.file.name}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">New Upload Detected</p>
              </div>
            </div>
            <button onClick={() => setPendingFile(null)} className="text-slate-400 hover:text-rose-500">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-indigo-400 mb-2 block">Assign Category Tag</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedCategory === cat ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                onClick={confirmUpload}
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200"
              >
                Confirm & Tag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
        <button
          onClick={() => setFilter('ALL')}
          className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'ALL' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
        >
          All Records
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === cat ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Document Grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocuments.map(doc => (
            <div 
              key={doc.id} 
              onClick={() => setPreviewDoc(doc)}
              className="bg-white border border-slate-100 rounded-3xl p-5 flex gap-4 hover:border-indigo-300 transition-all cursor-pointer shadow-sm hover:shadow-md group relative overflow-hidden"
            >
              <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl`}>
                <i className={`fa-solid ${getIcon(doc.type)}`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[9px] font-black uppercase tracking-wider mb-1 inline-block">
                    {doc.category}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors mb-1">{doc.name}</p>
                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                  <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                  <span>{doc.size}</span>
                </div>
              </div>
              <div className="flex items-center justify-center w-8">
                <i className="fa-solid fa-eye text-slate-200 group-hover:text-indigo-400 transition-colors"></i>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] p-16 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <i className="fa-solid fa-magnifying-glass text-3xl text-slate-200"></i>
          </div>
          <h5 className="text-slate-900 font-bold mb-1">No matching records</h5>
          <p className="text-sm text-slate-400 font-medium">Try adjusting your filters or upload a new {filter !== 'ALL' ? filter : 'document'}.</p>
        </div>
      )}
    </div>
  );
};

export default DocumentRepository;
