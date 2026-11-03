import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, BookOpen, KeyRound, UserCheck } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalMode, closeAuthModal, login } = useApp();
  
  const [isRegister, setIsRegister] = useState(authModalMode === 'register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const finalName = name.trim() || email.split('@')[0];
    login(finalName, email);
  };

  const handleDemoLogin = (demoName: string, demoEmail: string) => {
    login(demoName, demoEmail);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#30271F]/60 backdrop-blur-xs font-serif animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#F5EFE3] border-2 border-[#30271F]/40 shadow-2xl p-8 relative rounded-xs text-[#30271F]"
        style={{
          boxShadow: '0 20px 40px -10px rgba(48,39,31,0.3), inset 0 0 30px rgba(130,103,71,0.06)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-[#826747] hover:text-[#30271F] p-1 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Bookplate Header */}
        <div className="text-center mb-6 border-b border-[#30271F]/15 pb-4">
          <div className="text-xl text-[#75453F] mb-1 select-none">❦</div>
          <span className="text-xs uppercase tracking-widest text-[#826747]">Ex Libris</span>
          <h2 className="text-2xl font-serif font-bold text-[#30271F] mt-1">
            {isRegister ? 'Create Reader Account' : 'Open Reader Ledger'}
          </h2>
          <p className="text-xs text-[#826747] mt-1">
            Preserve your transcribed passages, speed records, and private manuscripts.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#826747] mb-1 font-sans">
                Reader Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Jane Sterling"
                className="w-full px-3 py-2 bg-[#E9DFC9]/40 border border-[#30271F]/30 focus:border-[#75453F] focus:outline-hidden font-serif text-sm text-[#30271F]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#826747] mb-1 font-sans">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="reader@classicfolio.org"
              className="w-full px-3 py-2 bg-[#E9DFC9]/40 border border-[#30271F]/30 focus:border-[#75453F] focus:outline-hidden font-serif text-sm text-[#30271F]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#30271F] hover:bg-[#75453F] text-[#F5EFE3] text-sm font-medium transition-colors border border-[#30271F]"
            >
              {isRegister ? 'Register & Begin Folio' : 'Sign In to Ledger'}
            </button>
          </div>
        </form>

        {/* Quick Demo Accounts */}
        <div className="mt-6 pt-4 border-t border-[#30271F]/15">
          <p className="text-xs text-center text-[#826747] mb-3 uppercase tracking-wider">
            Quick 1-Click Demo Profiles
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('Jane Sterling', 'j.sterling@classicfolio.org')}
              className="px-2.5 py-1.5 text-xs text-left bg-[#E9DFC9]/60 hover:bg-[#D9C9A9] border border-[#30271F]/20 text-[#30271F] transition-colors truncate"
            >
              <span className="block font-semibold">Jane Sterling</span>
              <span className="text-[10px] text-[#826747]">72 WPM · 3 Books</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('Edmond D.', 'edmond@marseilles.fr')}
              className="px-2.5 py-1.5 text-xs text-left bg-[#E9DFC9]/60 hover:bg-[#D9C9A9] border border-[#30271F]/20 text-[#30271F] transition-colors truncate"
            >
              <span className="block font-semibold">Edmond D.</span>
              <span className="text-[10px] text-[#826747]">84 WPM · 6 Books</span>
            </button>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="mt-5 text-center text-xs text-[#826747]">
          {isRegister ? (
            <span>
              Already possess a library ledger?{' '}
              <button 
                onClick={() => setIsRegister(false)} 
                className="underline hover:text-[#75453F] font-semibold text-[#30271F]"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              New to the printing desk?{' '}
              <button 
                onClick={() => setIsRegister(true)} 
                className="underline hover:text-[#75453F] font-semibold text-[#30271F]"
              >
                Create an Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
