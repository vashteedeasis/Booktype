import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ActiveView } from '../types';
import { BookOpen, FileText, User as UserIcon, Settings, Feather, LogOut, Check } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    user, 
    openAuthModal, 
    logout,
    settings 
  } = useApp();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // If focus mode is active and we are in typing view, keep chrome minimal
  if (settings.focusMode && activeView === 'typing') {
    return null;
  }

  const navLinks: { view: ActiveView; label: string; icon: React.ReactNode }[] = [
    { view: 'library', label: 'Book Library', icon: <BookOpen className="w-4 h-4" /> },
    { view: 'documents', label: 'My Documents', icon: <FileText className="w-4 h-4" /> },
    { view: 'typing', label: 'Transcribe', icon: <Feather className="w-4 h-4" /> },
    { view: 'dashboard', label: 'Dashboard', icon: <UserIcon className="w-4 h-4" /> },
    { view: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <header className="relative z-30 border-b border-[#30271F]/15 bg-[#E9DFC9]/95 backdrop-blur-xs transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark in display serif */}
        <button 
          onClick={() => setActiveView('landing')} 
          className="text-2xl font-serif font-bold tracking-tight text-[#30271F] whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity flex items-center gap-2 text-left"
        >
          <span className="text-[#75453F] select-none text-xl" aria-hidden="true">❦</span>
          <span>Bibliotype</span>
        </button>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-8 text-base font-serif text-[#826747]">
          {navLinks.map(link => {
            const isActive = activeView === link.view;
            return (
              <button
                key={link.view}
                onClick={() => setActiveView(link.view)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 relative ${
                  isActive 
                    ? 'text-[#30271F] font-semibold' 
                    : 'hover:text-[#30271F]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#75453F]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-4 shrink-0 relative">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-sm border border-[#30271F]/20 bg-[#F5EFE3] hover:border-[#826747] transition-all text-sm font-serif text-[#30271F]"
              >
                <span className="w-6 h-6 rounded-full bg-[#D9C9A9] text-[#30271F] font-bold text-xs flex items-center justify-center border border-[#30271F]/20">
                  {user.avatarInitials}
                </span>
                <span className="max-w-[120px] truncate font-medium">{user.name}</span>
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-[#F5EFE3] border border-[#30271F]/20 shadow-lg py-2 z-50 rounded-xs text-[#30271F] font-serif"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[#30271F]/10 text-xs text-[#826747]">
                    <p className="font-semibold text-[#30271F]">{user.name}</p>
                    <p className="truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveView('dashboard');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-[#E9DFC9] transition-colors flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-[#826747]" />
                    <span>Reader Ledger</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveView('documents');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-[#E9DFC9] transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-[#826747]" />
                    <span>My Private Folios</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveView('settings');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-[#E9DFC9] transition-colors flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4 text-[#826747]" />
                    <span>Transcription Settings</span>
                  </button>
                  <div className="border-t border-[#30271F]/10 my-1" />
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#75453F] hover:bg-[#75453F]/10 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Close Ledger (Sign Out)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="px-4 py-1.5 text-sm font-serif font-medium text-[#F5EFE3] bg-[#30271F] hover:bg-[#75453F] border border-[#30271F] transition-colors shadow-xs whitespace-nowrap shrink-0"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav drawer */}
      <div className="md:hidden border-t border-[#30271F]/10 px-4 py-2 flex items-center justify-around bg-[#D9C9A9]/60 text-xs font-serif text-[#30271F]">
        {navLinks.map(link => (
          <button
            key={link.view}
            onClick={() => setActiveView(link.view)}
            className={`py-1 px-2 ${activeView === link.view ? 'font-bold text-[#75453F] underline underline-offset-4' : 'text-[#826747]'}`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
};
