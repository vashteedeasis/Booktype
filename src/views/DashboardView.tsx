import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  Clock, 
  Feather, 
  BookOpen, 
  FileText, 
  RotateCcw, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    user, 
    history, 
    books, 
    userDocuments, 
    resumeLastProgress, 
    openBookDetail, 
    startTypingPassage, 
    setActiveView,
    openAuthModal,
    isPassageCompleted
  } = useApp();

  // Aggregate stats
  const totalPassagesCompleted = history.length;
  const totalCharactersTyped = history.reduce((acc, h) => acc + h.totalCharacters, 0);
  const totalWordsTyped = Math.round(totalCharactersTyped / 5);
  const totalSecondsTranscribing = history.reduce((acc, h) => acc + h.timeSeconds, 0);
  const totalMinutes = Math.round(totalSecondsTranscribing / 60);

  const avgWpm = history.length > 0 
    ? Math.round(history.reduce((acc, h) => acc + h.wpm, 0) / history.length) 
    : 0;

  const peakWpm = history.length > 0 
    ? Math.max(...history.map(h => h.wpm)) 
    : 0;

  const avgAccuracy = history.length > 0 
    ? Math.round((history.reduce((acc, h) => acc + h.accuracy, 0) / history.length) * 10) / 10 
    : 100;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 font-serif text-[#30271F] space-y-12">
      
      {/* Reader Ledger Header */}
      <div className="border-b border-[#30271F]/15 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#826747] mb-1">
            <span>❦</span>
            <span>Folio Reader Ledger</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#30271F]">
            {user ? `${user.name}’s Reading Desk` : 'Reader Ledger'}
          </h1>
          <p className="text-sm text-[#826747] mt-1 max-w-xl">
            {user 
              ? `Member since ${user.joinedDate} · Reader ID: ${user.id}`
              : 'Sign in to sync your typing milestones permanently across devices.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resumeLastProgress}
            className="px-5 py-2.5 bg-[#30271F] hover:bg-[#75453F] text-[#F5EFE3] text-sm font-semibold transition-colors border border-[#30271F] flex items-center gap-2 shadow-xs"
          >
            <Feather className="w-4 h-4" />
            <span>Resume Current Folio</span>
          </button>
        </div>
      </div>

      {/* 1. KEY PERFORMANCE LEDGER (Tabular Numerals, Unboxed) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        <div className="p-5 bg-[#F5EFE3] border border-[#30271F]/20 rounded-xs shadow-xs">
          <p className="text-[11px] uppercase tracking-wider text-[#826747]">Words Transcribed</p>
          <p className="text-3xl font-bold font-mono-vintage text-[#30271F] mt-1 tabular-nums">
            {totalWordsTyped.toLocaleString()}
          </p>
          <p className="text-[10px] text-[#826747] mt-1">{totalCharactersTyped.toLocaleString()} keystrokes</p>
        </div>

        <div className="p-5 bg-[#F5EFE3] border border-[#30271F]/20 rounded-xs shadow-xs">
          <p className="text-[11px] uppercase tracking-wider text-[#826747]">Average Speed</p>
          <p className="text-3xl font-bold font-mono-vintage text-[#30271F] mt-1 tabular-nums">
            {avgWpm} <span className="text-sm font-normal text-[#826747]">WPM</span>
          </p>
          <p className="text-[10px] text-[#826747] mt-1">Across all sessions</p>
        </div>

        <div className="p-5 bg-[#F5EFE3] border border-[#30271F]/20 rounded-xs shadow-xs">
          <p className="text-[11px] uppercase tracking-wider text-[#826747]">Personal Best</p>
          <p className="text-3xl font-bold font-mono-vintage text-[#75453F] mt-1 tabular-nums">
            {peakWpm} <span className="text-sm font-normal text-[#75453F]/70">WPM</span>
          </p>
          <p className="text-[10px] text-[#826747] mt-1">High-water mark</p>
        </div>

        <div className="p-5 bg-[#F5EFE3] border border-[#30271F]/20 rounded-xs shadow-xs">
          <p className="text-[11px] uppercase tracking-wider text-[#826747]">Accuracy Rate</p>
          <p className="text-3xl font-bold font-mono-vintage text-[#30271F] mt-1 tabular-nums">
            {avgAccuracy}%
          </p>
          <p className="text-[10px] text-[#826747] mt-1">Transcription precision</p>
        </div>

        <div className="p-5 bg-[#F5EFE3] border border-[#30271F]/20 rounded-xs shadow-xs col-span-2 md:col-span-1">
          <p className="text-[11px] uppercase tracking-wider text-[#826747]">Desk Time</p>
          <p className="text-3xl font-bold font-mono-vintage text-[#30271F] mt-1 tabular-nums">
            {totalMinutes} <span className="text-sm font-normal text-[#826747]">min</span>
          </p>
          <p className="text-[10px] text-[#826747] mt-1">{totalPassagesCompleted} passages finished</p>
        </div>

      </div>

      {/* 2. IN-PROGRESS FOLIOS & RESUME CARDS */}
      <div className="space-y-6">
        <div className="border-b border-[#30271F]/15 pb-3 flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-[#30271F]">
            Folios In Progress
          </h2>
          <button 
            onClick={() => setActiveView('library')}
            className="text-xs text-[#75453F] hover:underline uppercase tracking-wider"
          >
            Library Catalog →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {books.map(book => {
            const allP = book.chapters.flatMap(c => c.passages);
            const done = allP.filter(p => isPassageCompleted(p.id)).length;
            const percent = allP.length > 0 ? Math.round((done / allP.length) * 100) : 0;
            const nextP = allP.find(p => !isPassageCompleted(p.id)) || allP[0];
            const ch = book.chapters.find(c => c.passages.some(p => p.id === nextP?.id)) || book.chapters[0];

            return (
              <div 
                key={book.id}
                className="p-5 bg-[#F5EFE3] border border-[#30271F]/20 rounded-xs flex gap-5 items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-20 shrink-0 overflow-hidden rounded-xs border border-[#30271F]/20 shadow-xs">
                    <img 
                      src={book.coverImage} 
                      alt={book.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#826747]">
                      <span>{book.year}</span>
                      <span aria-hidden="true">·</span>
                      <span>{done}/{allP.length} passages</span>
                    </div>
                    <h3 className="text-base font-bold text-[#30271F]">{book.title}</h3>
                    <p className="text-xs text-[#826747] italic">by {book.author}</p>
                    <div className="w-36 h-1.5 bg-[#D9C9A9] rounded-full overflow-hidden mt-2">
                      <div 
                        className="h-full bg-[#75453F]" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-2">
                  <span className="text-xs font-mono-vintage text-[#75453F] font-bold">
                    {percent}%
                  </span>
                  <button
                    onClick={() => {
                      if (nextP && ch) {
                        startTypingPassage(nextP, {
                          type: 'book',
                          sourceId: book.id,
                          sourceTitle: book.title,
                          chapterOrPartTitle: ch.title
                        });
                      }
                    }}
                    className="px-3 py-1.5 bg-[#30271F] hover:bg-[#75453F] text-[#F5EFE3] text-xs font-serif transition-colors flex items-center gap-1"
                  >
                    <Feather className="w-3 h-3" />
                    <span>Transcribe</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. RECENT TRANSCRIPTION HISTORY LOG */}
      <div className="space-y-4">
        <div className="border-b border-[#30271F]/15 pb-3 flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-[#30271F]">
            Recent Transcription Ledger
          </h2>
          <span className="text-xs text-[#826747] font-mono-vintage">
            {history.length} records inscribed
          </span>
        </div>

        {history.length === 0 ? (
          <p className="text-sm text-[#826747] italic py-4">
            No transcription records yet. Transcribe your first passage to start recording your ledger.
          </p>
        ) : (
          <div className="bg-[#F5EFE3] border border-[#30271F]/20 rounded-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-serif">
                <thead className="bg-[#E9DFC9]/60 border-b border-[#30271F]/15 text-[#826747] uppercase tracking-wider font-sans text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Folio & Passage</th>
                    <th className="py-3 px-4">Speed (WPM)</th>
                    <th className="py-3 px-4">Accuracy</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Corrections</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30271F]/10">
                  {history.map((record, index) => (
                    <tr key={index} className="hover:bg-[#E9DFC9]/30 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-[#30271F]">{record.sourceTitle}</p>
                        <p className="text-[11px] text-[#826747] italic">{record.chapterOrDocTitle}</p>
                      </td>
                      <td className="py-3 px-4 font-mono-vintage text-sm font-semibold text-[#30271F] tabular-nums">
                        {record.wpm}
                        <span className="text-[10px] text-[#826747] ml-1 font-normal font-sans">
                          (raw: {record.rawWpm})
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono-vintage tabular-nums text-[#30271F]">
                        {record.accuracy}%
                      </td>
                      <td className="py-3 px-4 font-mono-vintage tabular-nums text-[#826747]">
                        {record.timeSeconds}s
                      </td>
                      <td className="py-3 px-4 font-mono-vintage tabular-nums text-[#826747]">
                        {record.errorsCount}
                      </td>
                      <td className="py-3 px-4 text-[#826747]">
                        {record.completedAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
