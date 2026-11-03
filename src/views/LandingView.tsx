import React from 'react';
import { useApp } from '../context/AppContext';
import { HERO_DESK_IMAGE } from '../data/booksData';
import { BookOpen, FileUp, Feather, ArrowRight, ShieldCheck, Clock, Award } from 'lucide-react';

export const LandingView: React.FC = () => {
  const { 
    books, 
    openBookDetail, 
    startTypingPassage, 
    setActiveView,
    openAuthModal,
    user 
  } = useApp();

  const featuredBook = books[0]; // Pride and Prejudice

  const handleQuickStart = () => {
    if (featuredBook && featuredBook.chapters[0]?.passages[0]) {
      startTypingPassage(featuredBook.chapters[0].passages[0], {
        type: 'book',
        sourceId: featuredBook.id,
        sourceTitle: featuredBook.title,
        chapterOrPartTitle: featuredBook.chapters[0].title
      });
    }
  };

  return (
    <div className="font-serif text-[#30271F] space-y-24 py-6">
      
      {/* 1. HERO SECTION (Quiet, high-impact editorial atmosphere) */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Literary Title & Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#826747]">
              <span>❦</span>
              <span>An Antique Digital Folio</span>
              <span>·</span>
              <span>Monkeytype Precision</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[#30271F] leading-[1.15]" style={{ textWrap: 'balance' }}>
              Transcribe Classic Literature, Page by Page.
            </h1>

            <p className="text-lg sm:text-xl text-[#826747] leading-relaxed max-w-2xl">
              Immerse yourself in the deliberate rhythm of historic printing. Transcribe timeless prose from Jane Austen and Alexandre Dumas on warm parchment, or bind your private documents into custom typing passages.
            </p>

            {/* Editorial CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={handleQuickStart}
                className="px-6 py-3.5 bg-[#30271F] hover:bg-[#75453F] text-[#F5EFE3] text-sm font-semibold tracking-wide transition-colors border border-[#30271F] flex items-center gap-2 shadow-xs"
              >
                <Feather className="w-4 h-4" />
                <span>Begin Transcribing</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => setActiveView('library')}
                className="px-6 py-3.5 bg-[#F5EFE3] hover:bg-[#D9C9A9] text-[#30271F] text-sm font-medium tracking-wide transition-colors border border-[#30271F]/30 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-[#826747]" />
                <span>Browse Public Folios</span>
              </button>

              <button
                onClick={() => setActiveView('upload')}
                className="px-5 py-3.5 text-xs text-[#826747] hover:text-[#30271F] uppercase tracking-wider transition-colors"
              >
                Upload Private PDF →
              </button>
            </div>

            {/* Zero-Pill Unboxed Trust Metadata */}
            <div className="pt-6 border-t border-[#30271F]/15 flex flex-wrap items-center gap-6 text-xs text-[#826747]">
              <span>Public Domain Classics</span>
              <span aria-hidden="true">·</span>
              <span>Zero Distractions & Ads</span>
              <span aria-hidden="true">·</span>
              <span>Private Encrypted Folios</span>
              <span aria-hidden="true">·</span>
              <span>Vintage Mechanical Audio</span>
            </div>
          </div>

          {/* Right Column: Hero Antique Reading Desk Visual */}
          <div className="lg:col-span-5 relative">
            <div 
              className="relative p-3 bg-[#F5EFE3] border border-[#30271F]/20 shadow-xl rounded-xs overflow-hidden group"
              style={{
                boxShadow: '0 20px 40px -15px rgba(48,39,31,0.25), inset 0 0 20px rgba(130,103,71,0.05)'
              }}
            >
              <div className="aspect-[4/3] overflow-hidden rounded-xs border border-[#30271F]/10 relative">
                <img 
                  src={HERO_DESK_IMAGE} 
                  alt="Antique reading desk with open book and inkwell"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#30271F]/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 right-4 text-[#F5EFE3]">
                  <p className="text-[11px] tracking-widest uppercase text-[#D9C9A9]">Desk Folio</p>
                  <p className="text-sm font-serif italic">Pride and Prejudice · Volume I</p>
                </div>
              </div>

              {/* Sample transcription excerpt card */}
              <div className="mt-3 p-4 bg-[#E9DFC9]/60 border border-[#30271F]/15 text-xs leading-relaxed">
                <p className="italic text-[#30271F]/90 mb-2">
                  &ldquo;It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife...&rdquo;
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#826747]">
                  <span>Chapter I · Passage 1</span>
                  <button 
                    onClick={handleQuickStart}
                    className="text-[#75453F] hover:underline font-semibold"
                  >
                    Transcribe This Passage →
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. CURATED CLASSICAL LIBRARY PREVIEW */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="border-t border-[#30271F]/20 pt-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#826747]">Curated Public Domain Archive</span>
              <h2 className="text-3xl font-serif font-bold text-[#30271F] mt-1">
                The Masterwork Library
              </h2>
              <p className="text-sm text-[#826747] mt-1 max-w-xl">
                Complete, unabridged editions divided into measured typing passages. Progress saved chapter by chapter.
              </p>
            </div>

            <button
              onClick={() => setActiveView('library')}
              className="text-xs uppercase tracking-widest text-[#75453F] hover:text-[#30271F] font-semibold underline underline-offset-4"
            >
              View All Public Folios ({books.length}) →
            </button>
          </div>

          {/* Curated Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {books.map(book => (
              <div 
                key={book.id}
                onClick={() => openBookDetail(book)}
                className="cursor-pointer bg-[#F5EFE3] border border-[#30271F]/20 p-5 rounded-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group flex flex-col justify-between"
                style={{
                  boxShadow: '0 4px 15px -3px rgba(48,39,31,0.06)'
                }}
              >
                <div>
                  {/* Book Cover Frame */}
                  <div className="aspect-[3/4] mb-5 overflow-hidden rounded-xs border border-[#30271F]/20 bg-[#E9DFC9] relative shadow-inner">
                    <img 
                      src={book.coverImage} 
                      alt={`Antique cover of ${book.title}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-[#F5EFE3]/90 border border-[#30271F]/20 px-2 py-0.5 text-[10px] font-mono-vintage text-[#30271F]">
                      {book.year}
                    </div>
                  </div>

                  {/* Clean unboxed metadata */}
                  <div className="flex items-center gap-2 text-xs text-[#826747] mb-1.5">
                    <span>{book.genre}</span>
                    <span aria-hidden="true">·</span>
                    <span>{book.chapters.length} Chapters</span>
                  </div>

                  <h3 className="text-xl font-bold font-serif text-[#30271F] group-hover:text-[#75453F] transition-colors leading-snug">
                    {book.title}
                  </h3>
                  
                  <p className="text-sm text-[#826747] italic mt-0.5 mb-3">
                    by {book.author}
                  </p>

                  <p className="text-xs text-[#30271F]/80 line-clamp-3 leading-relaxed">
                    {book.description}
                  </p>
                </div>

                {/* Card Action */}
                <div className="mt-6 pt-4 border-t border-[#30271F]/10 flex items-center justify-between text-xs text-[#30271F]">
                  <span className="text-[#826747] font-mono-vintage">
                    {(book.totalWords / 1000).toFixed(0)}k words
                  </span>
                  <span className="font-semibold text-[#75453F] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Open Folio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. PRIVATE DOCUMENTS & PDF UPLOADS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-[#D9C9A9]/50 border border-[#30271F]/20 p-8 sm:p-12 rounded-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#75453F]">
                <ShieldCheck className="w-4 h-4" />
                <span>Strictly Private to Your Account</span>
              </div>

              <h2 className="text-3xl font-serif font-bold text-[#30271F]">
                Transcribe Your Own School Notes, Essays & PDFs
              </h2>

              <p className="text-base text-[#826747] max-w-2xl leading-relaxed">
                Need to memorize a lecture reviewer, study legal briefs, or prepare for university examinations? Upload any PDF or text file. Our parser divides your document into optimal typing passages, tracking your WPM and comprehension speed.
              </p>

              <div className="flex flex-wrap items-center gap-6 text-xs text-[#30271F] pt-2">
                <span className="flex items-center gap-1.5">
                  <span className="text-[#75453F] font-bold">✓</span> PDF & Text Extraction
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#75453F] font-bold">✓</span> Automatic Passage Splitting
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#75453F] font-bold">✓</span> Never Shared Publicly
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                onClick={() => setActiveView('upload')}
                className="w-full py-3.5 px-6 bg-[#30271F] hover:bg-[#75453F] text-[#F5EFE3] text-sm font-semibold transition-colors border border-[#30271F] flex items-center justify-center gap-2"
              >
                <FileUp className="w-4 h-4" />
                <span>Upload a Document / PDF</span>
              </button>

              <button
                onClick={() => setActiveView('documents')}
                className="w-full py-2.5 px-4 bg-[#F5EFE3] hover:bg-[#E9DFC9] text-[#30271F] text-xs uppercase tracking-wider transition-colors border border-[#30271F]/30 text-center"
              >
                View My Uploaded Folios
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 4. DESIGN CRAFTSMANSHIP & TYPING ENGINE PILLARS */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#826747]">Atmosphere & Precision</span>
          <h2 className="text-3xl font-serif font-bold text-[#30271F] mt-1">
            The Antiquarian Typing Desk
          </h2>
          <p className="text-sm text-[#826747] mt-2">
            Engineered with Monkeytype precision, styled with 19th-century editorial tranquility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-[#F5EFE3] border border-[#30271F]/15 rounded-xs">
            <div className="text-xl text-[#75453F] mb-3 select-none">❦</div>
            <h3 className="text-lg font-bold text-[#30271F] mb-2">Printed Page Surface</h3>
            <p className="text-xs text-[#826747] leading-relaxed">
              Warm parchment texture, authentic book gutter shadows, and traditional book margins formatted for ergonomic eye tracking and long transcription sessions.
            </p>
          </div>

          <div className="p-6 bg-[#F5EFE3] border border-[#30271F]/15 rounded-xs">
            <div className="text-xl text-[#75453F] mb-3 select-none">❖</div>
            <h3 className="text-lg font-bold text-[#30271F] mb-2">Understated Ink Highlighting</h3>
            <p className="text-xs text-[#826747] leading-relaxed">
              Correct characters set in rich dark ink; transcription errors illuminated in muted burgundy without jarring flash effects. Real-time WPM and accuracy metrics kept discreetly outside the folio.
            </p>
          </div>

          <div className="p-6 bg-[#F5EFE3] border border-[#30271F]/15 rounded-xs">
            <div className="text-xl text-[#75453F] mb-3 select-none">❧</div>
            <h3 className="text-lg font-bold text-[#30271F] mb-2">Vintage Mechanical Audio</h3>
            <p className="text-xs text-[#826747] leading-relaxed">
              Synthesized mechanical keystroke clicks, wooden spacebar acoustics, and a soft brass bell chime when you complete a chapter, powered by pure low-latency Web Audio.
            </p>
          </div>
        </div>
      </section>

      {/* 5. READER PROGRESSION & REGISTRATION CTA */}
      {!user && (
        <section className="max-w-4xl mx-auto px-6 text-center">
          <div className="p-10 bg-[#F5EFE3] border-2 border-[#30271F]/30 rounded-xs shadow-md">
            <div className="text-2xl text-[#75453F] mb-2 select-none">❦</div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#30271F]">
              Preserve Your Reading & Typing Records
            </h2>
            <p className="text-sm text-[#826747] max-w-lg mx-auto mt-2 mb-6 leading-relaxed">
              Anyone can transcribe public books freely. Create a reader account to save your book chapter progress, review your typing speeds, and keep private study folios bound to your ledger.
            </p>
            <button
              onClick={() => openAuthModal('register')}
              className="px-8 py-3 bg-[#30271F] hover:bg-[#75453F] text-[#F5EFE3] text-sm font-semibold transition-colors border border-[#30271F]"
            >
              Create Free Reader Account
            </button>
          </div>
        </section>
      )}

    </div>
  );
};
