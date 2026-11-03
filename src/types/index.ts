export type TypingMode = 'paragraph' | 'verse' | 'continuous';

export interface Passage {
  id: string;
  chapterId: string;
  number: number;
  title: string;
  text: string;
  isVerse?: boolean;
}

export interface Chapter {
  id: string;
  bookId: string;
  number: number;
  title: string;
  description?: string;
  passages: Passage[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  coverImage: string;
  description: string;
  genre: string;
  totalWords: number;
  chapters: Chapter[];
}

export interface UserDocument {
  id: string;
  title: string;
  fileName: string;
  fileType: 'pdf' | 'txt' | 'custom';
  createdAt: string;
  totalWords: number;
  passages: Passage[];
  isPrivate: boolean;
}

export interface TypingResult {
  passageId: string;
  sourceTitle: string;
  chapterOrDocTitle: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  timeSeconds: number;
  errorsCount: number;
  totalCharacters: number;
  completedAt: string;
}

export interface UserSettings {
  fontScale: 'compact' | 'standard' | 'generous';
  caretStyle: 'line' | 'underline' | 'block';
  soundType: 'typewriter' | 'soft_click' | 'off';
  soundVolume: number;
  textAlignment: 'left' | 'justify';
  focusMode: boolean;
  autoAdvance: boolean;
  typingMode: TypingMode;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  joinedDate: string;
  isGuest: boolean;
}

export type ActiveView = 
  | 'landing' 
  | 'library' 
  | 'book-detail' 
  | 'typing' 
  | 'documents' 
  | 'upload' 
  | 'dashboard' 
  | 'settings';
