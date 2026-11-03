import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Chapter, Passage } from '../types';
import { 
  ArrowLeft, 
  Feather, 
  BookOpen, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  BookmarkCheck 
} from 'lucide-react';

export const BookDetailView: React.FC = () => {
  const { 
    selectedBook, 
    setActiveView, 
    startTypingPassage, 
    isPassageCompleted, 
    getPassageBestWpm 
  } = useApp();

  const [expandedChapters, setExpandedChapters] = useState<{ [id: string]: boolean }>({
    // Expand first chapter by default
    [selectedBook?.chapters[0]?.id || '']: true
  });

  if (!selectedBook) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center font-serif text-[#30271F]">
        <p className="text-xl mb-4">No book has been selected.</p>
        <button
          onClick={() => setActiveView('library')}
          className="px-6 py-2.5 bg-[#30271F] text-[#F5EFE3] hover:bg-[#75453F] transition-colors"
        >
          Return to Public Library
        </button>
      </div>
    );
  }

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  // Find next unfinished passage or default to first
  let nextPassageToResume: { passage: Passage; chapter: Chapter } | null = null;
  for (const ch of selectedBook.chapters) {
    for (const p of ch.passages) {
      if (!isPassageCompleted(p.id)) {
        nextPassageToResume = { passage: p, chapter: ch };
        break;
      }
    }
    if (nextPassageToResume) break;
  }

  const firstPassage = selectedBook.chapters[0]?.passages[0];
  const targetResumePassage = nextPassageToResume?.passage || firstPassage;
  const targetResumeChapter = nextPassageToResume?.chapter || selectedBook.chapters[0];

  const handleResume = () => {
    if (targetResumePassage && targetResumeChapter) {
      startTypingPassage(targetResumePassage, {
        type: 'book',
        sourceId: selectedBook.id,
        sourceTitle: selectedBook.title,
        chapterOrPartTitle: targetResumeChapter.title
      });
    }
  };

  // Total passages count
  const allPassages = selectedBook.chapters.flatMap(c => c.passages);
  const completedPassagesCount = allPassages.filter(p => isPassageCompleted(p.id)).length;
  const completionPercent = allPassages.length > 0 
    ? Math.round((completedPassagesCount / allPassages.length) * 100) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 font-serif text-[#30271F] space-y-12">
      
      {/* Back Button Breadcrumb */}
      <div>
        <button
          onClick={() => setActiveView('library')}
          className="text-xs uppercase tracking-widest text-[#826747] hover:text-[#30271F] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library Repository</span>
        </button>
      </div>

      {/* Book Folio Master Presentation */}
      <div 
        className="bg-[#F5EFE3] border border-[#30271F]/20 p-8 sm:p-12 rounded-xs shadow-md"
        style={{
          boxShadow: '0 10px 30px -5px rgba(48,39,31,0.08), inset 0 0 40px rgba(130,103,71,0.03)'
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Cover presentation */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="aspect-[3/4] overflow-hidden rounded-xs border-2 border-[#30271F]/30 shadow-xl bg-[#E9DFC9] relative">
              <img 
                src={selectedBook.coverImage} 
                alt={selectedBook.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="mt-4 p-3 bg-[#E9DFC9]/60 border border-[#30271F]/15 text-center text-xs text-[#826747]">
              <p className="font-semibold text-[#30271F]">Folio Preservation</p>
              <p>Unabridged Victorian Typeset</p>
            </div>
          </div>

          {/* Book Information & Metadata */}
          <div className="md:col-span-8 lg:col-span-9 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#826747] mb-1">
                <span>{selectedBook.genre}</span>
                <span aria-hidden="true">·</span>
                <span>Published {selectedBook.year}</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#30271F]">
                {selectedBook.title}
              </h1>

              <p className="text-lg text-[#826747] italic mt-1">
                by {selectedBook.author}
              </p>
            </div>

            <p className="text-sm sm:text-base text-[#30271F]/90 leading-relaxed max-w-3xl">
              {selectedBook.description}
            </p>

            {/* Zero-Pill Unboxed Key Metrics Strip */}
            <div className="pt-4 border-t border-[#30271F]/15 flex flex-wrap items-center gap-8 text-xs text-[#826747] font-mono-vintage">
              <div>
                <span className="block text-[10px] uppercase font-sans text-[#826747]">Total Words</span>
                <span className="text-sm font-semibold text-[#30271F]">{selectedBook.totalWords.toLocaleString()}</span>
              </div>
              <div className="w-px h-6 bg-[#30271F]/15" />
              <div>
                <span className="block text-[10px] uppercase font-sans text-[#826747]">Chapters</span>
                <span className="text-sm font-semibold text-[#30271F]">{selectedBook.chapters.length}</span>
              </div>
              <div className="w-px h-6 bg-[#30271F]/15" />
              <div>
                <span className="block text-[10px] uppercase font-sans text-[#826747]">Passages</span>
                <span className="text-sm font-semibold text-[#30271F]">{allPassages.length}</span>
              </div>
              <div className="w-px h-6 bg-[#30271F]/15" />
              <div>
                <span className="block text-[10px] uppercase font-sans text-[#826747]">Transcribed</span>
                <span className="text-sm font-semibold text-[#75453F]">{completionPercent}%</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={handleResume}
                className="px-6 py-3 bg-[#30271F] hover:bg-[#75453F] text-[#F5EFE3] text-sm font-medium tracking-wide transition-colors border border-[#30271F] flex items-center gap-2 shadow-xs"
              >
                <Feather className="w-4 h-4" />
                <span>
                  {completionPercent > 0 ? 'Resume Transcription' : 'Begin Transcription'}
                </span>
                <span className="text-xs text-[#D9C9A9]/80 font-normal">
                  ({targetResumeChapter?.title.split(':')[0]})
                </span>
              </button>

              <button
                onClick={() => {
                  const firstCh = selectedBook.chapters[0];
                  if (firstCh?.passages[0]) {
                    startTypingPassage(firstCh.passages[0], {
                      type: 'book',
                      sourceId: selectedBook.id,
                      sourceTitle: selectedBook.title,
                      chapterOrPartTitle: firstCh.title
                    });
                  }
                }}
                className="px-4 py-3 bg-[#E9DFC9]/60 hover:bg-[#D9C9A9] text-[#30271F] text-xs uppercase tracking-wider font-medium transition-colors border border-[#30271F]/20"
              >
                Start from Chapter I
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* TABLE OF CONTENTS: CHAPTERS & PASSAGES */}
      <div className="space-y-6">
        <div className="border-b border-[#30271F]/15 pb-4 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#826747]">Table of Contents</span>
            <h2 className="text-2xl font-serif font-bold text-[#30271F]">
              Chapters & Transcription Passages
            </h2>
          </div>
          
          <p className="text-xs text-[#826747]">
            {completedPassagesCount} of {allPassages.length} passages inscribed
          </p>
        </div>

        <div className="space-y-4">
          {selectedBook.chapters.map(chapter => {
            const isExpanded = !!expandedChapters[chapter.id];
            const chCompleted = chapter.passages.filter(p => isPassageCompleted(p.id)).length;

            return (
              <div 
                key={chapter.id}
                className="bg-[#F5EFE3] border border-[#30271F]/20 rounded-xs overflow-hidden"
              >
                {/* Chapter Row Header */}
                <button
                  onClick={() => toggleChapter(chapter.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#E9DFC9]/40 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-xs text-[#826747]">
                      <span>Chapter {chapter.number}</span>
                      <span aria-hidden="true">·</span>
                      <span>{chapter.passages.length} Passages</span>
                      {chCompleted === chapter.passages.length && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#75453F] font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Chapter Complete</span>
                          </span>
                        </>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold font-serif text-[#30271F]">
                      {chapter.title}
                    </h3>

                    {chapter.description && (
                      <p className="text-xs text-[#826747] italic">
                        {chapter.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#826747]">
                    <span className="font-mono-vintage">
                      {chCompleted}/{chapter.passages.length}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#30271F]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#30271F]" />
                    )}
                  </div>
                </button>

                {/* Passages List inside Chapter */}
                {isExpanded && (
                  <div className="border-t border-[#30271F]/10 divide-y divide-[#30271F]/10 bg-[#E9DFC9]/20">
                    {chapter.passages.map(passage => {
                      const completed = isPassageCompleted(passage.id);
                      const bestWpm = getPassageBestWpm(passage.id);
                      const wordCount = passage.text.split(/\s+/).length;

                      return (
                        <div 
                          key={passage.id}
                          className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F5EFE3] transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-serif font-bold text-[#30271F]">
                                Passage {passage.number}: {passage.title}
                              </span>
                              {completed && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-[#75453F] font-medium font-sans">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>{bestWpm} WPM</span>
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#826747] line-clamp-1 italic max-w-xl">
                              &ldquo;{passage.text.substring(0, 110)}...&rdquo;
                            </p>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <span className="text-xs text-[#826747] font-mono-vintage tabular-nums">
                              {wordCount} words
                            </span>
                            
                            <button
                              onClick={() => startTypingPassage(passage, {
                                type: 'book',
                                sourceId: selectedBook.id,
                                sourceTitle: selectedBook.title,
                                chapterOrPartTitle: chapter.title
                              })}
                              className={`px-3 py-1.5 text-xs font-serif transition-colors flex items-center gap-1.5 ${
                                completed 
                                  ? 'border border-[#30271F]/30 bg-[#F5EFE3] hover:bg-[#D9C9A9] text-[#30271F]' 
                                  : 'bg-[#30271F] hover:bg-[#75453F] text-[#F5EFE3]'
                              }`}
                            >
                              <Feather className="w-3 h-3" />
                              <span>{completed ? 'Re-transcribe' : 'Transcribe'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
