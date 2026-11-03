import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { LandingView } from './views/LandingView';
import { LibraryView } from './views/LibraryView';
import { BookDetailView } from './views/BookDetailView';
import { TypingInterfaceView } from './views/TypingInterfaceView';
import { DocumentsView } from './views/DocumentsView';
import { UploadView } from './views/UploadView';
import { DashboardView } from './views/DashboardView';
import { SettingsView } from './views/SettingsView';

const MainContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <main className="flex-1 w-full">
      {activeView === 'landing' && <LandingView />}
      {activeView === 'library' && <LibraryView />}
      {activeView === 'book-detail' && <BookDetailView />}
      {activeView === 'typing' && <TypingInterfaceView />}
      {activeView === 'documents' && <DocumentsView />}
      {activeView === 'upload' && <UploadView />}
      {activeView === 'dashboard' && <DashboardView />}
      {activeView === 'settings' && <SettingsView />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col justify-between selection:bg-[#75453F]/20 selection:text-[#30271F] font-galliard">
        <Navbar />
        <MainContent />
        <Footer />
        <AuthModal />
      </div>
    </AppProvider>
  );
}
