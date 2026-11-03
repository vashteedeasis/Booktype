import { Passage, UserDocument } from '../types';

export function splitTextIntoPassages(
  text: string, 
  docId: string, 
  targetWordCount: number = 110,
  mode: 'paragraph' | 'verse' | 'word_count' = 'word_count'
): Passage[] {
  // Normalize whitespace and carriage returns
  const cleanText = text.replace(/\r\n/g, '\n').trim();
  if (!cleanText) return [];

  const passages: Passage[] = [];

  if (mode === 'verse') {
    // Split by double newline (stanzas)
    const stanzas = cleanText.split(/\n\s*\n/).filter(s => s.trim().length > 0);
    stanzas.forEach((stanza, idx) => {
      passages.push({
        id: `${docId}-passage-${idx + 1}`,
        chapterId: docId,
        number: idx + 1,
        title: `Stanza / Section ${idx + 1}`,
        text: stanza.trim(),
        isVerse: true
      });
    });
    return passages.length > 0 ? passages : [{
      id: `${docId}-passage-1`,
      chapterId: docId,
      number: 1,
      title: 'Passage 1',
      text: cleanText,
      isVerse: true
    }];
  }

  if (mode === 'paragraph') {
    const paragraphs = cleanText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    paragraphs.forEach((p, idx) => {
      passages.push({
        id: `${docId}-passage-${idx + 1}`,
        chapterId: docId,
        number: idx + 1,
        title: `Paragraph ${idx + 1}`,
        text: p.replace(/\n+/g, ' ').trim(),
        isVerse: false
      });
    });
    return passages.length > 0 ? passages : [{
      id: `${docId}-passage-1`,
      chapterId: docId,
      number: 1,
      title: 'Passage 1',
      text: cleanText
    }];
  }

  // Split by sentences and pack into target word count
  // Split on sentence terminals
  const sentenceRegex = /([.?!]["']?\s+)/;
  const parts = cleanText.split(sentenceRegex);
  const sentences: string[] = [];
  
  for (let i = 0; i < parts.length; i += 2) {
    const sentence = parts[i] + (parts[i + 1] || '');
    if (sentence.trim()) {
      sentences.push(sentence.trim());
    }
  }

  if (sentences.length === 0) {
    sentences.push(cleanText);
  }

  let currentWords: string[] = [];
  let passageIndex = 1;

  for (const sentence of sentences) {
    const sWords = sentence.split(/\s+/).filter(Boolean);
    currentWords.push(...sWords);

    if (currentWords.length >= targetWordCount) {
      passages.push({
        id: `${docId}-passage-${passageIndex}`,
        chapterId: docId,
        number: passageIndex,
        title: `Passage ${passageIndex}`,
        text: currentWords.join(' '),
        isVerse: false
      });
      passageIndex++;
      currentWords = [];
    }
  }

  // Flush remaining words
  if (currentWords.length > 0) {
    if (passages.length > 0 && currentWords.length < 25) {
      // Append to previous passage if too short
      passages[passages.length - 1].text += ' ' + currentWords.join(' ');
    } else {
      passages.push({
        id: `${docId}-passage-${passageIndex}`,
        chapterId: docId,
        number: passageIndex,
        title: `Passage ${passageIndex}`,
        text: currentWords.join(' '),
        isVerse: false
      });
    }
  }

  return passages;
}

export const INITIAL_USER_DOCUMENTS: UserDocument[] = [
  {
    id: 'doc-aesthetics-lecture',
    title: 'Lecture Folio: On the Sublime & Beautiful',
    fileName: 'Edmund_Burke_Aesthetics_1757.pdf',
    fileType: 'pdf',
    createdAt: 'Yesterday, 14:20',
    totalWords: 342,
    isPrivate: true,
    passages: [
      {
        id: 'doc-aesthetics-passage-1',
        chapterId: 'doc-aesthetics-lecture',
        number: 1,
        title: 'Section I: Passion Caused by the Great',
        text: 'The passion caused by the great and sublime in nature, when those causes operate most powerfully, is astonishment; and astonishment is that state of the soul in which all its motions are suspended, with some degree of horror. In this case the mind is so entirely filled with its object, that it cannot entertain any other, nor by consequence reason on that object which employs it.'
      },
      {
        id: 'doc-aesthetics-passage-2',
        chapterId: 'doc-aesthetics-lecture',
        number: 2,
        title: 'Section II: Terror and Infinity',
        text: 'No passion so effectually robs the mind of all its powers of acting and reasoning as fear. For fear being an apprehension of pain or death, it operates in a manner that resembles actual pain. Whatever therefore is terrible, with regard to sight, is sublime too, whether this cause of terror be endued with greatness of dimensions or not; for it is impossible to look on anything as trifling, or contemptible, that may be dangerous.'
      }
    ]
  },
  {
    id: 'doc-rhetoric-notes',
    title: 'Reviewer: Classical Latin Oratory and Composition',
    fileName: 'Cicero_Oratorical_Principles.pdf',
    fileType: 'pdf',
    createdAt: '3 days ago',
    totalWords: 280,
    isPrivate: true,
    passages: [
      {
        id: 'doc-rhetoric-passage-1',
        chapterId: 'doc-rhetoric-notes',
        number: 1,
        title: 'Principle I: The Three Duties of the Speaker',
        text: 'The orator who is to be admired above all others is he whose discourse instructs, delights, and deeply moves the listener. To instruct is a matter of necessity, to delight is a mark of charm and beauty, to move is an imperative of victory; for by persuasion alone is the mind compelled to act.'
      },
      {
        id: 'doc-rhetoric-passage-2',
        chapterId: 'doc-rhetoric-notes',
        number: 2,
        title: 'Principle II: The Dignity of Cadence',
        text: 'Words should be chosen with delicate discernment and arranged with harmonious rhythm. When prose breathes with natural measure and balances symmetry without artificial constraint, it holds the court captive by the innate majesty of language.'
      }
    ]
  }
];
