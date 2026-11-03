import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveView, settings, activeView } = useApp();

  if (settings.focusMode && activeView === 'typing') {
    return null;
  }

  return (
    <footer className="border-t border-[#30271F]/15 bg-[#E9DFC9] py-12 mt-16 text-[#826747] font-serif transition-colors">
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        {/* Antique fleuron ornamental divider */}
        <div className="flex items-center justify-center gap-3 text-lg text-[#75453F]/70 mb-6 select-none" aria-hidden="true">
          <span>❧</span>
          <span className="w-12 h-px bg-[#30271F]/20"></span>
          <span>❦</span>
          <span className="w-12 h-px bg-[#30271F]/20"></span>
          <span>☙</span>
        </div>

        {/* Colophon & Literary Quote */}
        <p className="italic text-base text-[#30271F]/90 max-w-xl mx-auto leading-relaxed">
          &ldquo;I declare after all there is no enjoyment like reading! How much sooner one tires of any thing than of a book!&rdquo;
        </p>
        <p className="text-xs tracking-wider uppercase text-[#826747] mt-2 mb-8">
          — Jane Austen, Pride and Prejudice (1813)
        </p>

        {/* Quiet Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#30271F]/80 mb-6">
          <button 
            onClick={() => setActiveView('library')}
            className="hover:text-[#75453F] transition-colors"
          >
            Public Library
          </button>
          <span className="text-[#30271F]/30" aria-hidden="true">·</span>
          <button 
            onClick={() => setActiveView('documents')}
            className="hover:text-[#75453F] transition-colors"
          >
            Private Folios
          </button>
          <span className="text-[#30271F]/30" aria-hidden="true">·</span>
          <button 
            onClick={() => setActiveView('upload')}
            className="hover:text-[#75453F] transition-colors"
          >
            Upload Manuscript
          </button>
          <span className="text-[#30271F]/30" aria-hidden="true">·</span>
          <button 
            onClick={() => setActiveView('dashboard')}
            className="hover:text-[#75453F] transition-colors"
          >
            Reader Ledger
          </button>
          <span className="text-[#30271F]/30" aria-hidden="true">·</span>
          <button 
            onClick={() => setActiveView('settings')}
            className="hover:text-[#75453F] transition-colors"
          >
            Settings
          </button>
        </div>

        {/* Quiet Colophon Note */}
        <p className="text-xs text-[#826747]/80">
          Bibliotype · An antique literary transcription sanctuary · Built for focused typists & classical book lovers
        </p>
      </div>
    </footer>
  );
};
