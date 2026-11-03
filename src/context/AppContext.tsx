import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ActiveView, 
  Book, 
  Passage, 
  TypingResult, 
  UserDocument, 
  UserProfile, 
  UserSettings, 
  TypingMode 
} from '../types';
import { BOOKS_DATA, CLASSICAL_VERSES } from '../data/booksData';
import { INITIAL_USER_DOCUMENTS } from '../utils/textSplitter';

export interface ActiveSourceInfo {
  type: 'book' | 'document' | 'verse';
  sourceId: string;
  sourceTitle: string;
  chapterOrPartTitle: string;
}

interface AppContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  user: UserProfile | null;
  books: Book[];
  userDocuments: UserDocument[];
  selectedBook: Book | null;
  activePassage: Passage | null;
  activeSource: ActiveSourceInfo | null;
  history: TypingResult[];
  settings: UserSettings;
  authModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (name: string, email: string) => void;
  logout: () => void;
  openBookDetail: (book: Book) => void;
  startTypingPassage: (passage: Passage, source: ActiveSourceInfo) => void;
  recordTypingResult: (result: TypingResult) => void;
  getNextPassage: () => { passage: Passage; source: ActiveSourceInfo } | null;
  getPreviousPassage: () => { passage: Passage; source: ActiveSourceInfo } | null;
  addDocument: (doc: UserDocument) => void;
  deleteDocument: (docId: string) => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  setTypingMode: (mode: TypingMode) => void;
  resumeLastProgress: () => void;
  isPassageCompleted: (passageId: string) => boolean;
  getPassageBestWpm: (passageId: string) => number | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_SETTINGS: UserSettings = {
  fontScale: 'standard',
  caretStyle: 'line',
  soundType: 'typewriter',
  soundVolume: 0.45,
  textAlignment: 'left',
  focusMode: false,
  autoAdvance: false,
  typingMode: 'paragraph'
};

const DEFAULT_USER: UserProfile = {
  id: 'usr_jane_reader',
  name: 'Jane Sterling',
  email: 'j.sterling@classicfolio.org',
  avatarInitials: 'JS',
  joinedDate: 'October 2026',
  isGuest: false
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [selectedBook, setSelectedBook] = useState<Book | null>(BOOKS_DATA[0]);
  const [books] = useState<Book[]>(BOOKS_DATA);
  
  // Persistent user documents
  const [userDocuments, setUserDocuments] = useState<UserDocument[]>(() => {
    try {
      const saved = localStorage.getItem('bibliotype_docs');
      return saved ? JSON.parse(saved) : INITIAL_USER_DOCUMENTS;
    } catch {
      return INITIAL_USER_DOCUMENTS;
    }
  });

  // Persistent user auth
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('bibliotype_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  // Persistent history records
  const [history, setHistory] = useState<TypingResult[]>(() => {
    try {
      const saved = localStorage.getItem('bibliotype_history');
      if (saved) return JSON.parse(saved);
      // Sample initial historical entry for rich dashboard experience
      return [
        {
          passageId: 'pap-1-1',
          sourceTitle: 'Pride and Prejudice',
          chapterOrDocTitle: 'Chapter I: The Arrival of Netherfield',
          wpm: 68,
          rawWpm: 72,
          accuracy: 98.4,
          timeSeconds: 48,
          errorsCount: 2,
          totalCharacters: 295,
          completedAt: 'Yesterday'
        },
        {
          passageId: 'cmc-1-1',
          sourceTitle: 'The Count of Monte Cristo',
          chapterOrDocTitle: 'Chapter I: Marseilles — The Arrival',
          wpm: 71,
          rawWpm: 74,
          accuracy: 99.1,
          timeSeconds: 52,
          errorsCount: 1,
          totalCharacters: 320,
          completedAt: '2 days ago'
        }
      ];
    } catch {
      return [];
    }
  });

  // Persistent user settings
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('bibliotype_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Active transcription target
  const [activePassage, setActivePassage] = useState<Passage | null>(BOOKS_DATA[0].chapters[0].passages[0]);
  const [activeSource, setActiveSource] = useState<ActiveSourceInfo | null>({
    type: 'book',
    sourceId: 'pride-and-prejudice',
    sourceTitle: 'Pride and Prejudice',
    chapterOrPartTitle: 'Chapter I'
  });

  // Auth modal
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('bibliotype_docs', JSON.stringify(userDocuments));
    } catch { /* ignore */ }
  }, [userDocuments]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('bibliotype_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('bibliotype_user');
      }
    } catch { /* ignore */ }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('bibliotype_history', JSON.stringify(history));
    } catch { /* ignore */ }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('bibliotype_settings', JSON.stringify(settings));
    } catch { /* ignore */ }
  }, [settings]);

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const login = (name: string, email: string) => {
    const initials = name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'BR';

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name,
      email,
      avatarInitials: initials,
      joinedDate: 'Today',
      isGuest: false
    };
    setUser(newUser);
    setAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const openBookDetail = (book: Book) => {
    setSelectedBook(book);
    setActiveView('book-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startTypingPassage = (passage: Passage, source: ActiveSourceInfo) => {
    setActivePassage(passage);
    setActiveSource(source);
    setActiveView('typing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const recordTypingResult = (result: TypingResult) => {
    setHistory(prev => [result, ...prev]);
  };

  const getNextPassage = (): { passage: Passage; source: ActiveSourceInfo } | null => {
    if (!activePassage || !activeSource) return null;

    if (activeSource.type === 'book') {
      const book = books.find(b => b.id === activeSource.sourceId);
      if (!book) return null;

      for (let cIdx = 0; cIdx < book.chapters.length; cIdx++) {
        const chapter = book.chapters[cIdx];
        const pIdx = chapter.passages.findIndex(p => p.id === activePassage.id);
        if (pIdx !== -1) {
          // Check next passage in same chapter
          if (pIdx + 1 < chapter.passages.length) {
            return {
              passage: chapter.passages[pIdx + 1],
              source: {
                type: 'book',
                sourceId: book.id,
                sourceTitle: book.title,
                chapterOrPartTitle: chapter.title
              }
            };
          }
          // Or first passage of next chapter
          if (cIdx + 1 < book.chapters.length) {
            const nextChapter = book.chapters[cIdx + 1];
            return {
              passage: nextChapter.passages[0],
              source: {
                type: 'book',
                sourceId: book.id,
                sourceTitle: book.title,
                chapterOrPartTitle: nextChapter.title
              }
            };
          }
        }
      }
    } else if (activeSource.type === 'document') {
      const doc = userDocuments.find(d => d.id === activeSource.sourceId);
      if (!doc) return null;
      const pIdx = doc.passages.findIndex(p => p.id === activePassage.id);
      if (pIdx !== -1 && pIdx + 1 < doc.passages.length) {
        return {
          passage: doc.passages[pIdx + 1],
          source: {
            type: 'document',
            sourceId: doc.id,
            sourceTitle: doc.title,
            chapterOrPartTitle: doc.passages[pIdx + 1].title
          }
        };
      }
    } else if (activeSource.type === 'verse') {
      const pIdx = CLASSICAL_VERSES.findIndex(p => p.id === activePassage.id);
      if (pIdx !== -1 && pIdx + 1 < CLASSICAL_VERSES.length) {
        return {
          passage: CLASSICAL_VERSES[pIdx + 1],
          source: {
            type: 'verse',
            sourceId: 'classical-verses',
            sourceTitle: 'Anthology of Classical Verse',
            chapterOrPartTitle: CLASSICAL_VERSES[pIdx + 1].title
          }
        };
      }
    }
    return null;
  };

  const getPreviousPassage = (): { passage: Passage; source: ActiveSourceInfo } | null => {
    if (!activePassage || !activeSource) return null;

    if (activeSource.type === 'book') {
      const book = books.find(b => b.id === activeSource.sourceId);
      if (!book) return null;

      for (let cIdx = 0; cIdx < book.chapters.length; cIdx++) {
        const chapter = book.chapters[cIdx];
        const pIdx = chapter.passages.findIndex(p => p.id === activePassage.id);
        if (pIdx > 0) {
          return {
            passage: chapter.passages[pIdx - 1],
            source: {
              type: 'book',
              sourceId: book.id,
              sourceTitle: book.title,
              chapterOrPartTitle: chapter.title
            }
          };
        } else if (pIdx === 0 && cIdx > 0) {
          const prevChapter = book.chapters[cIdx - 1];
          return {
            passage: prevChapter.passages[prevChapter.passages.length - 1],
            source: {
              type: 'book',
              sourceId: book.id,
              sourceTitle: book.title,
              chapterOrPartTitle: prevChapter.title
            }
          };
        }
      }
    }
    return null;
  };

  const addDocument = (doc: UserDocument) => {
    setUserDocuments(prev => [doc, ...prev]);
  };

  const deleteDocument = (docId: string) => {
    setUserDocuments(prev => prev.filter(d => d.id !== docId));
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const setTypingMode = (mode: TypingMode) => {
    setSettings(prev => ({ ...prev, typingMode: mode }));
  };

  const resumeLastProgress = () => {
    if (history.length > 0) {
      const last = history[0];
      // Find matching passage
      for (const book of books) {
        for (const ch of book.chapters) {
          const found = ch.passages.find(p => p.id === last.passageId);
          if (found) {
            startTypingPassage(found, {
              type: 'book',
              sourceId: book.id,
              sourceTitle: book.title,
              chapterOrPartTitle: ch.title
            });
            return;
          }
        }
      }
    }
    // Fallback to first book passage
    const defaultBook = books[0];
    startTypingPassage(defaultBook.chapters[0].passages[0], {
      type: 'book',
      sourceId: defaultBook.id,
      sourceTitle: defaultBook.title,
      chapterOrPartTitle: defaultBook.chapters[0].title
    });
  };

  const isPassageCompleted = (passageId: string) => {
    return history.some(h => h.passageId === passageId);
  };

  const getPassageBestWpm = (passageId: string): number | null => {
    const records = history.filter(h => h.passageId === passageId);
    if (records.length === 0) return null;
    return Math.max(...records.map(r => r.wpm));
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        user,
        books,
        userDocuments,
        selectedBook,
        activePassage,
        activeSource,
        history,
        settings,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        logout,
        openBookDetail,
        startTypingPassage,
        recordTypingResult,
        getNextPassage,
        getPreviousPassage,
        addDocument,
        deleteDocument,
        updateSettings,
        setTypingMode,
        resumeLastProgress,
        isPassageCompleted,
        getPassageBestWpm
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
