import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../utils/audio';
import { TypingResult, TypingMode } from '../types';
import { 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  AlignLeft, 
  AlignJustify,
  Sliders,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

export const TypingInterfaceView: React.FC = () => {
  const { 
    activePassage, 
    activeSource, 
    settings, 
    updateSettings, 
    recordTypingResult, 
    getNextPassage, 
    getPreviousPassage, 
    startTypingPassage,
    openBookDetail,
    books,
    setActiveView
  } = useApp();

  const passageText = activePassage ? activePassage.text : '';

  // Typing state
  const [typedText, setTypedText] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<TypingResult | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset state when activePassage changes
  const resetTyping = useCallback(() => {
    setTypedText('');
    setStartTime(null);
    setElapsedSeconds(0);
    setIsCompleted(false);
    setErrorCount(0);
    setTotalKeystrokes(0);
    setShowSummaryModal(false);
    setLastResult(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // Auto focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, []);

  useEffect(() => {
    resetTyping();
  }, [activePassage?.id, resetTyping]);

  // Timer loop
  useEffect(() => {
    if (startTime && !isCompleted) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 500);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTime, isCompleted]);

  // Focus keeper
  const focusInput = () => {
    inputRef.current?.focus();
    setIsFocused(true);
  };

  // Calculate live statistics
  const typedLength = typedText.length;
  let correctCharsCount = 0;
  for (let i = 0; i < typedLength; i++) {
    if (typedText[i] === passageText[i]) {
      correctCharsCount++;
    }
  }

  const durationMin = elapsedSeconds > 0 ? elapsedSeconds / 60 : 0.001;
  const liveWpm = elapsedSeconds > 0 
    ? Math.max(0, Math.round((correctCharsCount / 5) / durationMin)) 
    : 0;
  const liveRawWpm = elapsedSeconds > 0 
    ? Math.max(0, Math.round((typedLength / 5) / durationMin)) 
    : 0;
  const liveAccuracy = typedLength > 0 
    ? Math.max(0, Math.min(100, Math.round((correctCharsCount / typedLength) * 100))) 
    : 100;

  // Handle Passage Completion
  const handlePassageComplete = useCallback((finalTyped: string, finalErrors: number, finalKeystrokes: number, finalStartTime: number) => {
    const finalElapsed = Math.max(1, Math.round((Date.now() - finalStartTime) / 1000));
    const finalMinutes = finalElapsed / 60;
    
    let finalCorrect = 0;
    for (let i = 0; i < finalTyped.length; i++) {
      if (finalTyped[i] === passageText[i]) {
        finalCorrect++;
      }
    }

    const calculatedWpm = Math.max(0, Math.round((finalCorrect / 5) / finalMinutes));
    const calculatedRawWpm = Math.max(0, Math.round((finalTyped.length / 5) / finalMinutes));
    const calculatedAccuracy = finalTyped.length > 0 
      ? Math.max(0, Math.min(100, Math.round((finalCorrect / finalTyped.length) * 100 * 10) / 10)) 
      : 100;

    const result: TypingResult = {
      passageId: activePassage?.id || 'unknown',
      sourceTitle: activeSource?.sourceTitle || 'Untitled Folio',
      chapterOrDocTitle: activeSource?.chapterOrPartTitle || 'Section',
      wpm: calculatedWpm,
      rawWpm: calculatedRawWpm,
      accuracy: calculatedAccuracy,
      timeSeconds: finalElapsed,
      errorsCount: finalErrors,
      totalCharacters: finalTyped.length,
      completedAt: 'Just now'
    };

    setIsCompleted(true);
    setLastResult(result);
    recordTypingResult(result);

    // Play antique bell sound!
    soundEngine.playBell(settings.soundVolume);

    setShowSummaryModal(true);

    if (settings.autoAdvance) {
      setTimeout(() => {
        handleNextPassage();
      }, 1600);
    }
  }, [passageText, activePassage, activeSource, recordTypingResult, settings.soundVolume, settings.autoAdvance]);

  // Keyboard input handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Shortcuts
    if (e.key === 'Tab') {
      e.preventDefault();
      resetTyping();
      return;
    }

    if (e.key === 'Escape') {
      if (settings.focusMode) {
        updateSettings({ focusMode: false });
      }
      return;
    }

    if (isCompleted) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleNextPassage();
      }
      return;
    }

    // Initialize timer on first keypress
    let currentStartTime = startTime;
    if (!currentStartTime) {
      currentStartTime = Date.now();
      setStartTime(currentStartTime);
    }

    if (e.key === 'Backspace') {
      if (typedText.length > 0) {
        soundEngine.playKeystroke(settings.soundType, settings.soundVolume);
        setTypedText(prev => prev.slice(0, -1));
      }
      return;
    }

    // Ignore modifier keys
    if (e.ctrlKey || e.metaKey || e.altKey || e.key.length > 1) {
      return;
    }

    const nextChar = e.key;
    const targetChar = passageText[typedText.length];

    setTotalKeystrokes(prev => prev + 1);

    // Track error
    if (nextChar !== targetChar) {
      setErrorCount(prev => prev + 1);
    }

    // Sound feedback
    soundEngine.playKeystroke(settings.soundType, settings.soundVolume);

    const newTyped = typedText + nextChar;
    setTypedText(newTyped);

    // Check if reached the end of the passage
    if (newTyped.length >= passageText.length) {
      handlePassageComplete(newTyped, errorCount + (nextChar !== targetChar ? 1 : 0), totalKeystrokes + 1, currentStartTime);
    }
  };

  const handleNextPassage = () => {
    const next = getNextPassage();
    if (next) {
      startTypingPassage(next.passage, next.source);
    } else {
      // Reached the end of the book or collection!
      setShowSummaryModal(false);
      setActiveView('library');
    }
  };

  const handlePreviousPassage = () => {
    const prev = getPreviousPassage();
    if (prev) {
      startTypingPassage(prev.passage, prev.source);
    }
  };

  const currentBook = books.find(b => b.id === activeSource?.sourceId);

  // Font scale classes
  const fontScaleClass = 
    settings.fontScale === 'compact' ? 'text-lg leading-relaxed' :
    settings.fontScale === 'generous' ? 'text-2xl leading-[2.1]' :
    'text-xl leading-[1.95]';

  // Caret style
  const caretClass = 
    settings.caretStyle === 'underline' ? 'border-b-2 border-[#30271F] pb-0.5' :
    settings.caretStyle === 'block' ? 'bg-[#30271F]/20 rounded-xs' :
    'border-r-2 border-[#75453F] animate-caret';

  if (!activePassage) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center font-serif text-[#30271F]">
        <p className="text-xl mb-4">No transcription manuscript is currently open.</p>
        <button
          onClick={() => setActiveView('library')}
          className="px-6 py-2.5 bg-[#30271F] text-[#F5EFE3] hover:bg-[#75453F] transition-colors"
        >
          Select from the Library
        </button>
      </div>
    );
  }

  // Calculate passage progress percentage
  const passageProgressPercent = Math.min(100, Math.round((typedLength / passageText.length) * 100));

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between py-6 px-4 font-serif">
      
      {/* Hidden input to capture keystrokes smoothly */}
      <input
        ref={inputRef}
        type="text"
        value=""
        onChange={() => {}}
        onKeyDown={handleKeyDown}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        className="opacity-0 absolute -top-9999 left-0 pointer-events-none"
        autoFocus
        tabIndex={0}
      />

      {/* Top Header / Book Folio Running Header */}
      {!settings.focusMode && (
        <div className="max-w-4xl mx-auto w-full mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#30271F]/15 pb-3 text-xs tracking-wider uppercase text-[#826747]">
          <div className="flex items-center gap-3">
            {currentBook ? (
              <button 
                onClick={() => openBookDetail(currentBook)}
                className="hover:text-[#30271F] flex items-center gap-1.5 transition-colors font-medium"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{activeSource?.sourceTitle}</span>
              </button>
            ) : (
              <span className="font-medium text-[#30271F]">{activeSource?.sourceTitle}</span>
            )}
            <span className="text-[#30271F]/30" aria-hidden="true">·</span>
            <span className="text-[#30271F]/80">{activeSource?.chapterOrPartTitle}</span>
            <span className="text-[#30271F]/30" aria-hidden="true">·</span>
            <span>Passage {activePassage.number}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePreviousPassage}
              disabled={!getPreviousPassage()}
              className="p-1 hover:text-[#30271F] disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Previous Passage"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono-vintage text-xs font-medium text-[#30271F] tabular-nums">
              {passageProgressPercent}%
            </span>
            <button
              onClick={handleNextPassage}
              disabled={!getNextPassage()}
              className="p-1 hover:text-[#30271F] disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Next Passage"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* THE PRINTED PAGE TYPING CANVAS */}
      <div className="flex-1 flex items-center justify-center py-4">
        <div 
          ref={pageContainerRef}
          onClick={focusInput}
          className="relative w-full max-w-3xl book-page-surface border border-[#D9C9A9] rounded-xs px-8 sm:px-16 py-12 sm:py-16 cursor-text transition-all duration-300 select-none"
          style={{
            boxShadow: '0 8px 30px -4px rgba(48,39,31,0.08), 0 2px 8px -1px rgba(48,39,31,0.04), inset 0 0 60px rgba(130,103,71,0.03)'
          }}
        >
          {/* Subtle Gutter & Center Fold effect for genuine open-book aesthetic */}
          <div className="absolute inset-y-0 left-0 w-3 pointer-events-none bg-gradient-to-r from-[#30271F]/6 to-transparent rounded-l-xs" />
          <div className="absolute inset-y-0 right-0 w-3 pointer-events-none bg-gradient-to-l from-[#30271F]/6 to-transparent rounded-r-xs" />

          {/* Book Page Header within the page */}
          <div className="text-center mb-8 border-b border-[#30271F]/10 pb-4">
            <p className="text-[11px] tracking-widest uppercase text-[#826747] font-sans">
              {activeSource?.sourceTitle} — {activePassage.title}
            </p>
          </div>

          {/* Character by character rendering */}
          <div 
            className={`font-galliard ${fontScaleClass} text-[#30271F] ${
              settings.textAlignment === 'justify' ? 'text-justify' : 'text-left'
            } transition-all`}
            style={{ 
              textRendering: 'optimizeLegibility',
              hyphens: 'none'
            }}
          >
            {passageText.split('').map((char, index) => {
              const isTyped = index < typedLength;
              const isCurrent = index === typedLength;
              const isCorrect = isTyped && typedText[index] === char;
              const isError = isTyped && typedText[index] !== char;

              let charDisplayClass = '';
              if (isCorrect) {
                // Subtle crisp dark ink brown for correct letters
                charDisplayClass = 'text-[#30271F] font-normal';
              } else if (isError) {
                // Muted burgundy for mistakes with subtle underline
                charDisplayClass = 'text-[#75453F] bg-[#75453F]/15 rounded-xs underline decoration-[#75453F]/60';
              } else {
                // Untyped text: elegant muted sepia printed ink
                charDisplayClass = 'text-[#826747]/45';
              }

              return (
                <span key={index} className="relative inline">
                  {/* Caret before current character */}
                  {isCurrent && isFocused && (
                    <span 
                      className={`inline-block absolute -left-[1px] top-0 bottom-0 w-[2px] bg-[#75453F] animate-caret ${caretClass}`}
                      style={{ height: '1.2em', verticalAlign: 'text-bottom' }}
                    />
                  )}
                  
                  {/* Render newline or character */}
                  {char === '\n' ? (
                    <span className="block h-4" />
                  ) : (
                    <span className={`${charDisplayClass} transition-colors duration-75`}>
                      {char}
                    </span>
                  )}
                </span>
              );
            })}

            {/* Caret at very end if complete */}
            {typedLength >= passageText.length && isFocused && (
              <span className="inline-block w-[2px] h-[1.2em] bg-[#75453F] animate-caret ml-[1px]" />
            )}
          </div>

          {/* Bottom Page Number Ornament */}
          <div className="mt-12 pt-6 border-t border-[#30271F]/10 flex items-center justify-between text-xs text-[#826747]">
            <span className="select-none text-[#75453F] text-sm">❦</span>
            <span className="font-serif tracking-widest text-[11px]">
              — {activePassage.number} —
            </span>
            <span className="select-none text-[#75453F] text-sm">❧</span>
          </div>

          {/* Unfocused Click Prompt */}
          {!isFocused && !isCompleted && (
            <div 
              onClick={focusInput}
              className="absolute inset-0 bg-[#F5EFE3]/75 backdrop-blur-[1px] flex items-center justify-center cursor-pointer transition-all"
            >
              <div className="px-5 py-2.5 bg-[#E9DFC9] border border-[#30271F]/30 text-[#30271F] text-xs uppercase tracking-widest font-sans shadow-md">
                Click to Resume Folio Transcription
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DISCREET BOTTOM TOOLBAR (Kept clean outside the printed page) */}
      <div className="max-w-4xl mx-auto w-full mt-4">
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 px-5 bg-[#D9C9A9]/70 border border-[#30271F]/15 rounded-xs text-[#30271F]">
          
          {/* Real-time stats display */}
          <div className="flex items-center gap-6 font-mono-vintage text-sm tabular-nums">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-serif uppercase tracking-wider text-[#826747]">WPM</span>
              <span className="text-lg font-semibold text-[#30271F]">{liveWpm}</span>
            </div>
            
            <div className="w-px h-4 bg-[#30271F]/20" />

            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-serif uppercase tracking-wider text-[#826747]">ACC</span>
              <span className="text-lg font-semibold text-[#30271F]">{liveAccuracy}%</span>
            </div>

            <div className="w-px h-4 bg-[#30271F]/20" />

            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-serif uppercase tracking-wider text-[#826747]">TIME</span>
              <span className="text-base text-[#30271F]">
                {Math.floor(elapsedSeconds / 60)}:{('0' + (elapsedSeconds % 60)).slice(-2)}
              </span>
            </div>
          </div>

          {/* Interactive controls */}
          <div className="flex items-center gap-3 text-xs">
            {/* Restart Passage button */}
            <button
              onClick={resetTyping}
              className="px-2.5 py-1.5 border border-[#30271F]/25 hover:bg-[#E9DFC9] transition-colors flex items-center gap-1.5 text-[#30271F]"
              title="Restart Passage (Tab)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restart</span>
              <kbd className="hidden sm:inline text-[10px] text-[#826747] font-mono-vintage">⇥</kbd>
            </button>

            {/* Typewriter Audio Sound Toggle */}
            <button
              onClick={() => {
                const nextType = 
                  settings.soundType === 'typewriter' ? 'soft_click' :
                  settings.soundType === 'soft_click' ? 'off' : 'typewriter';
                updateSettings({ soundType: nextType });
                soundEngine.playKeystroke(nextType, settings.soundVolume);
              }}
              className="px-2.5 py-1.5 border border-[#30271F]/25 hover:bg-[#E9DFC9] transition-colors flex items-center gap-1 text-[#30271F]"
              title={`Audio: ${settings.soundType}`}
            >
              {settings.soundType === 'off' ? (
                <VolumeX className="w-3.5 h-3.5 text-[#826747]" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#30271F]" />
              )}
              <span className="hidden sm:inline capitalize">{settings.soundType.replace('_', ' ')}</span>
            </button>

            {/* Text Alignment Toggle */}
            <button
              onClick={() => updateSettings({ 
                textAlignment: settings.textAlignment === 'left' ? 'justify' : 'left' 
              })}
              className="p-1.5 border border-[#30271F]/25 hover:bg-[#E9DFC9] transition-colors text-[#30271F]"
              title={`Alignment: ${settings.textAlignment}`}
            >
              {settings.textAlignment === 'left' ? (
                <AlignLeft className="w-3.5 h-3.5" />
              ) : (
                <AlignJustify className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Font Scale selector */}
            <button
              onClick={() => {
                const scales: ('compact' | 'standard' | 'generous')[] = ['compact', 'standard', 'generous'];
                const next = scales[(scales.indexOf(settings.fontScale) + 1) % scales.length];
                updateSettings({ fontScale: next });
              }}
              className="px-2 py-1.5 border border-[#30271F]/25 hover:bg-[#E9DFC9] transition-colors text-xs font-serif text-[#30271F]"
              title="Change Text Size"
            >
              {settings.fontScale === 'compact' ? 'A Small' : settings.fontScale === 'generous' ? 'A Large' : 'A Normal'}
            </button>

            {/* Distraction-free Focus Mode */}
            <button
              onClick={() => updateSettings({ focusMode: !settings.focusMode })}
              className="p-1.5 border border-[#30271F]/25 hover:bg-[#E9DFC9] transition-colors text-[#30271F]"
              title="Focus Mode (Esc to exit)"
            >
              {settings.focusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Quiet footnote tip */}
        <p className="text-[11px] text-center text-[#826747] mt-2 font-serif">
          Transcribing directly into the manuscript page · Press <kbd className="font-mono-vintage px-1 py-0.5 bg-[#D9C9A9]/60 rounded-xs">Tab</kbd> to restart · <kbd className="font-mono-vintage px-1 py-0.5 bg-[#D9C9A9]/60 rounded-xs">Esc</kbd> for focus view
        </p>
      </div>

      {/* PASSAGE COMPLETION SUMMARY MODAL / LEDGER */}
      {showSummaryModal && lastResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#30271F]/70 backdrop-blur-xs font-serif animate-in fade-in duration-200">
          <div 
            className="w-full max-w-lg bg-[#F5EFE3] border-2 border-[#30271F]/30 shadow-2xl p-8 rounded-xs text-[#30271F] relative"
            style={{
              boxShadow: '0 25px 50px -12px rgba(48,39,31,0.4), inset 0 0 40px rgba(130,103,71,0.08)'
            }}
          >
            {/* Fleuron and Header */}
            <div className="text-center mb-6 border-b border-[#30271F]/15 pb-4">
              <div className="text-2xl text-[#75453F] mb-1 select-none">❦</div>
              <span className="text-xs uppercase tracking-widest text-[#826747]">Folio Transcription Ledger</span>
              <h2 className="text-2xl font-serif font-bold text-[#30271F] mt-1">
                Passage Transcribed
              </h2>
              <p className="text-xs text-[#826747] mt-1 italic">
                {lastResult.sourceTitle} · {lastResult.chapterOrDocTitle}
              </p>
            </div>

            {/* Performance Ledger Scores */}
            <div className="grid grid-cols-3 gap-3 text-center my-6 py-4 bg-[#E9DFC9]/50 border border-[#30271F]/15">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#826747]">Speed (WPM)</p>
                <p className="text-3xl font-bold font-mono-vintage text-[#30271F] mt-1">
                  {lastResult.wpm}
                </p>
                <p className="text-[10px] text-[#826747] mt-0.5">Raw: {lastResult.rawWpm}</p>
              </div>

              <div className="border-x border-[#30271F]/15">
                <p className="text-[11px] uppercase tracking-wider text-[#826747]">Accuracy</p>
                <p className="text-3xl font-bold font-mono-vintage text-[#30271F] mt-1">
                  {lastResult.accuracy}%
                </p>
                <p className="text-[10px] text-[#826747] mt-0.5">{lastResult.errorsCount} corrections</p>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#826747]">Duration</p>
                <p className="text-3xl font-bold font-mono-vintage text-[#30271F] mt-1">
                  {lastResult.timeSeconds}s
                </p>
                <p className="text-[10px] text-[#826747] mt-0.5">{lastResult.totalCharacters} chars</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 pt-4 border-t border-[#30271F]/15">
              <button
                onClick={() => {
                  setShowSummaryModal(false);
                  resetTyping();
                }}
                className="w-full sm:w-1/2 py-2.5 px-4 border border-[#30271F]/30 bg-[#E9DFC9]/40 hover:bg-[#D9C9A9] text-xs uppercase tracking-wider text-[#30271F] transition-colors"
              >
                Transcribe Again
              </button>

              <button
                onClick={() => {
                  setShowSummaryModal(false);
                  handleNextPassage();
                }}
                className="w-full sm:w-1/2 py-2.5 px-4 bg-[#30271F] hover:bg-[#75453F] text-[#F5EFE3] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 border border-[#30271F]"
              >
                <span>Next Passage</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Back to book */}
            <div className="text-center mt-4">
              <button
                onClick={() => {
                  setShowSummaryModal(false);
                  if (currentBook) {
                    openBookDetail(currentBook);
                  } else {
                    setActiveView('library');
                  }
                }}
                className="text-xs text-[#826747] hover:text-[#30271F] underline transition-colors"
              >
                Return to Table of Contents
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
