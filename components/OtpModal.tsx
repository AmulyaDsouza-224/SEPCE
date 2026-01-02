
import React, { useState, useEffect } from 'react';
import { otpService } from '../services/storageService';

interface Props {
  isOpen: boolean;
  onVerify: () => void;
  onCancel: () => void;
}

const OtpModal: React.FC<Props> = ({ isOpen, onVerify, onCancel }) => {
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const code = otpService.generate();
      setGeneratedOtp(code);
      setOtp('');
      setError(false);
      // Simulate SMS/Email notification
      setTimeout(() => setShowNotification(true), 500);
      setTimeout(() => setShowNotification(false), 8000);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpService.verify(otp, generatedOtp)) {
      onVerify();
    } else {
      setError(true);
      setOtp('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onCancel}></div>
      
      {/* Mock Notification */}
      {showNotification && (
        <div className="fixed top-6 right-6 z-[110] bg-white rounded-2xl p-4 shadow-2xl border-l-4 border-indigo-500 animate-bounce max-w-sm">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <i className="fa-solid fa-comment-sms"></i>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Nexus Security Service</p>
              <p className="text-sm font-semibold text-slate-900">Your access code is <span className="text-indigo-600 font-black tracking-widest">{generatedOtp}</span></p>
            </div>
          </div>
        </div>
      )}

      <div className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl border border-slate-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <i className="fa-solid fa-shield-halved text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Clinical Verification</h2>
          <p className="text-slate-500 text-sm mt-2">To access secure patient records, please enter the OTP sent to your registered device.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              autoFocus
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className={`w-full text-center text-4xl font-black tracking-[1em] py-4 bg-slate-50 border-2 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all ${error ? 'border-rose-300 text-rose-600' : 'border-slate-100 focus:border-indigo-500 text-slate-900'}`}
            />
            {error && <p className="text-rose-500 text-xs font-bold mt-3 text-center">Invalid code. Please try again.</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button" 
              onClick={onCancel}
              className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={otp.length !== 6}
              className="py-3 px-4 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
            >
              Verify Access
            </button>
          </div>
        </form>

        <p className="text-center mt-8 text-xs text-slate-400 font-medium">
          Session access expires in 30 minutes.
          <br />
          All access is logged for audit compliance.
        </p>
      </div>
    </div>
  );
};

export default OtpModal;
