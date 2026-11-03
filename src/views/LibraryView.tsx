import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Book, Passage } from '../types';
import { CLASSICAL_VERSES } from '../data/booksData';
import { BookOpen, Feather, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LibraryView: React.FC = () => {
  const { 
    books, 
    openBookDetail, 
    startTypingPassage, 
    isPassageCompleted,
    getPassageBestWpm 
  } = useApp();

  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  const genres = [
    { id: 'all', label: 'All Masterworks' },
    { id: 'romance', label: 'Regency Romance' },
    { id: 'adventure', label: 'Epic Adventure' },
    { id: 'gothic', label: 'Gothic Fiction' },
    { id: 'verse', label: 'Poetry & Verse' }
  ];

  const filteredBooks = books.filter(b => {
    if (selectedGenre === 'all') return true;
    if (selectedGenre === 'romance') return b.genre.toLowerCase().includes('romance');
    if (selectedGenre === 'adventure') return b.genre.toLowerCase().includes('adventure');
    if (selectedGenre === 'gothic') return b.genre.toLowerCase().includes('gothic');
    return true;
  });

  const getBookCompletionRate = (book: Book) => {
    let totalPassages = 0;
    let completed = 0;
    book.chapters.forEach(ch => {
      ch.passages.forEach(p => {
        totalPassages++;
        if (isPassageCompleted(p.id)) completed++;
      });
    });
    return totalPassages > 0 ? Math.round((completed / totalPassages) * 100) : 0;
  };

  const handleStartBook = (book: Book, e: React.MouseEvent) => {
    e.stopPropagation();
    if (book.chapters[0]?.passages[0]) {
      startTypingPassage(book.chapters[0].passages[0], {
        type: 'book',
        sourceId: book.id,
        sourceTitle: book.title,
        chapterOrPartTitle: book.chapters[0].title
      });
    }
  };

  const handleStartVerse = (verse: Passage) => {
    startTypingPassage(verse, {
      type: 'verse',
      sourceId: 'classical-verses',
      sourceTitle: 'Anthology of Classical Verse',
      chapterOrPartTitle: verse.title
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 font-serif text-[#30271F] space-y-12">
      
      {/* Header & Catalog Synopsis */}
      <div className="border-b border-[#30271F]/15 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#826747] mb-1">
            <span>❦</span>
            <span>Public Domain Repository</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#30271F]">
            The Public Book Library
          </h1>
          <p className="text-base text-[#826747] mt-2 max-w-2xl leading-relaxed">
            Curated unabridged editions formatted into transcription passages. Transcribe at your own pace, track your speed by chapter, and experience literature intimately.
          </p>
        </div>

        {/* Functional Genre Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#D9C9A9]/50 border border-[#30271F]/20 rounded-xs">
          {genres.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGenre(g.id)}
              className={`px-3 py-1.5 text-xs font-serif transition-colors whitespace-nowrap shrink-0 ${
                selectedGenre === g.id
                  ? 'bg-[#F5EFE3] text-[#30271F] font-semibold shadow-xs'
                  : 'text-[#826747] hover:text-[#30271F]'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Book Catalog Grid */}
      {selectedGenre !== 'verse' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map(book => {
            const completion = getBookCompletionRate(book);
            return (
              <div
                key={book.id}
                onClick={() => openBookDetail(book)}
                className="cursor-pointer bg-[#F5EFE3] border border-[#30271F]/20 p-6 rounded-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group flex flex-col justify-between"
                style={{
                  boxShadow: '0 4px 15px -3px rgba(48,39,31,0.06)'
                }}
              >
                <div>
                  {/* Book Cover Frame */}
                  <div className="aspect-[3/4] mb-5 overflow-hidden rounded-xs border border-[#30271F]/25 bg-[#E9DFC9] relative shadow-inner">
                    <img 
                      src={book.coverImage} 
                      alt={`Antique cover of ${book.title}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-[#F5EFE3]/90 border border-[#30271F]/20 px-2 py-0.5 text-[10px] font-mono-vintage text-[#30271F]">
                      {book.year}
                    </div>

                    {completion > 0 && (
                      <div className="absolute bottom-2 left-2 right-2 bg-[#30271F]/85 text-[#F5EFE3] text-[10px] px-2.5 py-1 flex items-center justify-between">
                        <span>Progress</span>
                        <span className="font-mono-vintage">{completion}% complete</span>
                      </div>
                    )}
                  </div>

                  {/* Clean unboxed metadata */}
                  <div className="flex items-center gap-2 text-xs text-[#826747] mb-1.5">
                    <span>{book.genre}</span>
                    <span aria-hidden="true">·</span>
                    <span>{book.chapters.length} Chapters</span>
                  </div>

                  <h2 className="text-2xl font-bold font-serif text-[#30271F] group-hover:text-[#75453F] transition-colors leading-snug">
                    {book.title}
                  </h2>
                  
                  <p className="text-sm text-[#826747] italic mt-0.5 mb-3">
                    by {book.author}
                  </p>

                  <p className="text-xs text-[#30271F]/80 line-clamp-3 leading-relaxed mb-4">
                    {book.description}
                  </p>
                </div>

                {/* Card Bottom / Action Row */}
                <div className="pt-4 border-t border-[#30271F]/15 flex items-center justify-between">
                  <span className="text-xs text-[#826747] font-mono-vintage">
                    {book.chapters.reduce((acc, c) => acc + c.passages.length, 0)} passages
                  </span>

                  <button
                    onClick={(e) => handleStartBook(book, e)}
                    className="px-3.5 py-1.5 bg-[#30271F] group-hover:bg-[#75453F] text-[#F5EFE3] text-xs font-serif font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Feather className="w-3.5 h-3.5" />
                    <span>Transcribe</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Classical Poetry & Verse Anthology */}
      {(selectedGenre === 'all' || selectedGenre === 'verse') && (
        <div className="pt-8">
          <div className="border-t border-[#30271F]/20 pt-8 mb-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#826747]">
              <span>❖</span>
              <span>Anthology Collection</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#30271F] mt-1">
              Classical Poetry & Verse Transcriptions
            </h2>
            <p className="text-xs text-[#826747] mt-1">
              Refined verse layouts with natural meter, poetic indentations, and lyrical cadence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CLASSICAL_VERSES.map(verse => {
              const completed = isPassageCompleted(verse.id);
              const bestWpm = getPassageBestWpm(verse.id);

              return (
                <div 
                  key={verse.id}
                  className="p-6 bg-[#F5EFE3] border border-[#30271F]/20 rounded-xs flex flex-col justify-between"
                  style={{
                    boxShadow: '0 4px 15px -3px rgba(48,39,31,0.04)'
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#826747] mb-2">
                      <span className="uppercase tracking-wider">Verse Folio</span>
                      {completed && (
                        <span className="flex items-center gap-1 text-[#75453F] font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Transcribed {bestWpm ? `(${bestWpm} WPM)` : ''}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold font-serif text-[#30271F] mb-3">
                      {verse.title}
                    </h3>

                    <pre className="font-galliard text-xs text-[#30271F]/80 italic whitespace-pre-wrap leading-relaxed line-clamp-4 bg-[#E9DFC9]/30 p-3 border border-[#30271F]/10">
                      {verse.text}
                    </pre>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#30271F]/10 flex items-center justify-between">
                    <span className="text-xs text-[#826747] font-mono-vintage">
                      {verse.text.split(/\s+/).length} words
                    </span>
                    <button
                      onClick={() => handleStartVerse(verse)}
                      className="px-3.5 py-1.5 bg-[#30271F] hover:bg-[#75453F] text-[#F5EFE3] text-xs font-serif transition-colors flex items-center gap-1.5"
                    >
                      <Feather className="w-3.5 h-3.5" />
                      <span>Transcribe Verse</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
