import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { splitTextIntoPassages } from '../utils/textSplitter';
import { UserDocument, Passage } from '../types';
import { 
  FileUp, 
  ArrowLeft, 
  Lock, 
  Check, 
  Eye, 
  Feather, 
  FileText, 
  Sliders 
} from 'lucide-react';

export const UploadView: React.FC = () => {
  const { addDocument, setActiveView, startTypingPassage } = useApp();

  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('paste');
  const [docTitle, setDocTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [rawText, setRawText] = useState(
    `The study of literature and rhetoric is the discipline of understanding how human thought is given enduring form. When an author chooses a word, they balance melody, historical etymology, and syntactic force. In transcribing passages from memory or text, the typist does not merely copy letters—they participate in the architectural reconstruction of each sentence, observing the cadence of clauses and the solemnity of punctuation.`
  );
  const [targetLength, setTargetLength] = useState<'short' | 'medium' | 'long' | 'verse'>('medium');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Compute passages based on current text and settings
  const wordCountTarget = 
    targetLength === 'short' ? 65 : 
    targetLength === 'long' ? 180 : 110;
  
  const splitMode = targetLength === 'verse' ? 'verse' : 'word_count';
  const computedPassages = splitTextIntoPassages(rawText, 'new-doc', wordCountTarget, splitMode);
  const totalWords = rawText.split(/\s+/).filter(Boolean).length;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setFileName(file.name);
    if (!docTitle) {
      setDocTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        // If it's a mock binary or real text file, extract text
        setRawText(content);
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setIsProcessing(false);
    };

    // Read as text
    reader.readAsText(file);
  };

  const handleSaveAndTranscribe = (startNow: boolean = false) => {
    const finalTitle = docTitle.trim() || 'Untitled Manuscript';
    const finalFileName = fileName || `${finalTitle.toLowerCase().replace(/\s+/g, '_')}.txt`;
    const docId = `doc_${Date.now()}`;

    const finalPassages: Passage[] = computedPassages.map((p, idx) => ({
      ...p,
      id: `${docId}-passage-${idx + 1}`,
      chapterId: docId
    }));

    const newDoc: UserDocument = {
      id: docId,
      title: finalTitle,
      fileName: finalFileName,
      fileType: finalFileName.toLowerCase().endsWith('.pdf') ? 'pdf' : 'txt',
      createdAt: 'Just now',
      totalWords: totalWords,
      passages: finalPassages,
      isPrivate: true
    };

    addDocument(newDoc);

    if (startNow && finalPassages.length > 0) {
      startTypingPassage(finalPassages[0], {
        type: 'document',
        sourceId: newDoc.id,
        sourceTitle: newDoc.title,
        chapterOrPartTitle: finalPassages[0].title
      });
    } else {
      setActiveView('documents');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 font-serif text-[#30271F] space-y-8">
      
      {/* Back link */}
      <div>
        <button
          onClick={() => setActiveView('documents')}
          className="text-xs uppercase tracking-widest text-[#826747] hover:text-[#30271F] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Documents</span>
        </button>
      </div>

      {/* Header */}
      <div className="border-b border-[#30271F]/15 pb-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#75453F] mb-1">
          <Lock className="w-3.5 h-3.5" />
          <span>Private Document Binding</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#30271F]">
          Upload Private PDF or Manuscript
        </h1>
        <p className="text-sm text-[#826747] mt-1 max-w-2xl leading-relaxed">
          Import your personal study guides, lecture summaries, or literature excerpts. Text will be parsed and formatted into comfortable transcription passages.
        </p>
      </div>

      {/* Main Form Container */}
      <div className="bg-[#F5EFE3] border border-[#30271F]/20 p-8 rounded-xs shadow-md space-y-6">
        
        {/* Document Title */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#826747] mb-1.5 font-sans">
            Manuscript Folio Title
          </label>
          <input
            type="text"
            value={docTitle}
            onChange={e => setDocTitle(e.target.value)}
            placeholder="e.g. Modern Philosophy Reviewer · Chapter 4"
            className="w-full px-3.5 py-2.5 bg-[#E9DFC9]/40 border border-[#30271F]/25 focus:border-[#75453F] focus:outline-hidden text-base text-[#30271F] font-serif"
          />
        </div>

        {/* Input Method Segmented Control */}
        <div>
          <div className="flex items-center gap-1 p-1 bg-[#D9C9A9]/50 border border-[#30271F]/20 rounded-xs max-w-sm mb-4">
            <button
              onClick={() => setActiveTab('paste')}
              className={`flex-1 py-1.5 text-xs text-center transition-colors ${
                activeTab === 'paste' 
                  ? 'bg-[#F5EFE3] text-[#30271F] font-semibold shadow-xs' 
                  : 'text-[#826747] hover:text-[#30271F]'
              }`}
            >
              Paste Prose or Notes
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-1.5 text-xs text-center transition-colors ${
                activeTab === 'upload' 
                  ? 'bg-[#F5EFE3] text-[#30271F] font-semibold shadow-xs' 
                  : 'text-[#826747] hover:text-[#30271F]'
              }`}
            >
              Upload PDF / TXT File
            </button>
          </div>

          {activeTab === 'upload' ? (
            <div className="border-2 border-dashed border-[#30271F]/25 p-8 text-center bg-[#E9DFC9]/20 hover:bg-[#E9DFC9]/40 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.txt,.md,.rtf"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <FileUp className="w-8 h-8 text-[#75453F] mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#30271F]">
                {fileName ? fileName : 'Select a PDF or Text Document to Bind'}
              </p>
              <p className="text-xs text-[#826747] mt-1">
                Supports PDF, TXT, and Markdown files up to 25MB.
              </p>
              {isProcessing && (
                <p className="text-xs text-[#75453F] mt-2 font-mono-vintage animate-pulse">
                  Extracting text and typesetting passages...
                </p>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#826747] mb-1 font-sans">
                Document Text
              </label>
              <textarea
                rows={6}
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder="Paste the full text of your document, lecture notes, or essays here..."
                className="w-full p-3.5 bg-[#E9DFC9]/40 border border-[#30271F]/25 focus:border-[#75453F] focus:outline-hidden text-sm text-[#30271F] font-serif leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* Passage Length & Split Configuration */}
        <div className="pt-4 border-t border-[#30271F]/15">
          <label className="block text-xs uppercase tracking-wider text-[#826747] mb-2 font-sans">
            Typeset Passage Breakdown
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'short', label: 'Compact', desc: '~65 words / fast' },
              { id: 'medium', label: 'Standard', desc: '~110 words / balanced' },
              { id: 'long', label: 'Extended', desc: '~180 words / deep' },
              { id: 'verse', label: 'Verse / Stanzas', desc: 'Poetic lines' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setTargetLength(opt.id as 'short' | 'medium' | 'long' | 'verse')}
                className={`p-2.5 text-left border rounded-xs transition-colors ${
                  targetLength === opt.id 
                    ? 'border-[#75453F] bg-[#E9DFC9] text-[#30271F]' 
                    : 'border-[#30271F]/15 bg-[#E9DFC9]/30 hover:bg-[#E9DFC9]/60 text-[#826747]'
                }`}
              >
                <p className="text-xs font-semibold text-[#30271F]">{opt.label}</p>
                <p className="text-[10px] text-[#826747] mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Calculated Stats & Preview Accordion */}
        <div className="p-4 bg-[#E9DFC9]/40 border border-[#30271F]/15 rounded-xs flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4 text-[#826747]">
            <span>Total Words: <strong className="text-[#30271F] font-mono-vintage">{totalWords}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Generated Passages: <strong className="text-[#30271F] font-mono-vintage">{computedPassages.length}</strong></span>
          </div>

          <button
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            className="text-xs text-[#75453F] hover:underline font-semibold flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isPreviewOpen ? 'Hide Passage Preview' : 'Preview Passages'}</span>
          </button>
        </div>

        {/* Live Preview of Parsed Passages */}
        {isPreviewOpen && (
          <div className="space-y-3 pt-2 max-h-60 overflow-y-auto pr-1">
            {computedPassages.map((p, idx) => (
              <div 
                key={idx}
                className="p-3 bg-[#E9DFC9]/20 border border-[#30271F]/10 text-xs rounded-xs"
              >
                <p className="font-semibold text-[#30271F] mb-1">
                  Passage {idx + 1} ({p.text.split(/\s+/).length} words)
                </p>
                <p className="text-[#826747] italic line-clamp-2">
                  &ldquo;{p.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="pt-6 border-t border-[#30271F]/15 flex flex-wrap items-center gap-4">
          <button
            onClick={() => handleSaveAndTranscribe(true)}
            disabled={totalWords === 0}
            className="px-6 py-3 bg-[#30271F] hover:bg-[#75453F] text-[#F5EFE3] text-sm font-semibold transition-colors border border-[#30271F] disabled:opacity-40 flex items-center gap-2 shadow-xs"
          >
            <Feather className="w-4 h-4" />
            <span>Bind & Start Transcribing Now</span>
          </button>

          <button
            onClick={() => handleSaveAndTranscribe(false)}
            disabled={totalWords === 0}
            className="px-5 py-3 bg-[#E9DFC9]/60 hover:bg-[#D9C9A9] text-[#30271F] text-xs uppercase tracking-wider font-semibold transition-colors border border-[#30271F]/25 disabled:opacity-40"
          >
            Save to My Documents
          </button>
        </div>

      </div>
    </div>
  );
};
