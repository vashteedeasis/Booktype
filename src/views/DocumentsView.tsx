import React from 'react';
import { useApp } from '../context/AppContext';
import { UserDocument } from '../types';
import { 
  FileText, 
  FileUp, 
  Lock, 
  Trash2, 
  Feather, 
  CheckCircle2, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { 
    userDocuments, 
    deleteDocument, 
    startTypingPassage, 
    setActiveView, 
    isPassageCompleted,
    getPassageBestWpm,
    user,
    openAuthModal
  } = useApp();

  const handleStartDocument = (doc: UserDocument) => {
    // Find next uncompleted passage or first
    const targetPassage = doc.passages.find(p => !isPassageCompleted(p.id)) || doc.passages[0];
    if (targetPassage) {
      startTypingPassage(targetPassage, {
        type: 'document',
        sourceId: doc.id,
        sourceTitle: doc.title,
        chapterOrPartTitle: targetPassage.title
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 font-serif text-[#30271F] space-y-10">
      
      {/* Header and Private Guarantee Notice */}
      <div className="border-b border-[#30271F]/15 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#75453F] mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Private User Folios · Confidential</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#30271F]">
            My Private Manuscripts & PDFs
          </h1>
          <p className="text-base text-[#826747] mt-2 max-w-2xl leading-relaxed">
            Your personal school notes, research reviewers, and private documents. Only accessible through your reader account and never shared with other users.
          </p>
        </div>

        <button
          onClick={() => setActiveView('upload')}
          className="px-5 py-3 bg-[#30271F] hover:bg-[#75453F] text-[#F5EFE3] text-sm font-semibold tracking-wide transition-colors border border-[#30271F] flex items-center gap-2 shrink-0 shadow-xs"
        >
          <FileUp className="w-4 h-4" />
          <span>Upload PDF or Manuscript</span>
        </button>
      </div>

      {/* Guest Notice if not logged in */}
      {!user && (
        <div className="p-4 bg-[#D9C9A9]/60 border border-[#30271F]/20 text-xs text-[#30271F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#75453F]" />
            <span>You are currently in guest mode. Sign in to ensure your personal uploaded folios remain permanently bound across devices.</span>
          </div>
          <button 
            onClick={() => openAuthModal('login')}
            className="underline font-semibold hover:text-[#75453F]"
          >
            Sign In Now
          </button>
        </div>
      )}

      {/* Documents List */}
      {userDocuments.length === 0 ? (
        <div className="p-16 text-center bg-[#F5EFE3] border border-[#30271F]/20 rounded-xs space-y-4">
          <div className="text-2xl text-[#75453F]">❦</div>
          <h3 className="text-xl font-bold text-[#30271F]">No Personal Documents Uploaded</h3>
          <p className="text-sm text-[#826747] max-w-md mx-auto">
            Upload course notes, syllabi, study reviewers, or custom prose to practice typing and speed-learning your own materials.
          </p>
          <button
            onClick={() => setActiveView('upload')}
            className="px-6 py-2.5 bg-[#30271F] text-[#F5EFE3] hover:bg-[#75453F] text-xs uppercase tracking-wider transition-colors"
          >
            Upload First Manuscript
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {userDocuments.map(doc => {
            const completedCount = doc.passages.filter(p => isPassageCompleted(p.id)).length;
            const progress = doc.passages.length > 0 
              ? Math.round((completedCount / doc.passages.length) * 100) 
              : 0;

            return (
              <div 
                key={doc.id}
                className="bg-[#F5EFE3] border border-[#30271F]/20 p-6 rounded-xs flex flex-col justify-between shadow-xs hover:border-[#826747] transition-all"
              >
                <div>
                  {/* Top metadata */}
                  <div className="flex items-center justify-between text-xs text-[#826747] mb-2 font-mono-vintage">
                    <span className="flex items-center gap-1.5 font-sans uppercase tracking-wider text-[#75453F]">
                      <Lock className="w-3 h-3" />
                      <span>{doc.fileType.toUpperCase()} Folio</span>
                    </span>
                    <span>Added {doc.createdAt}</span>
                  </div>

                  {/* Document Title */}
                  <h2 className="text-xl font-serif font-bold text-[#30271F] mb-1">
                    {doc.title}
                  </h2>
                  <p className="text-xs text-[#826747] font-mono-vintage truncate mb-4">
                    {doc.fileName}
                  </p>

                  {/* Clean unboxed statistics */}
                  <div className="flex items-center gap-4 text-xs text-[#826747] border-y border-[#30271F]/10 py-3 mb-4">
                    <span>{doc.totalWords} words</span>
                    <span aria-hidden="true">·</span>
                    <span>{doc.passages.length} passages</span>
                    <span aria-hidden="true">·</span>
                    <span>{progress}% transcribed</span>
                  </div>

                  {/* Passages Accordion / Overview */}
                  <div className="space-y-2 mb-6">
                    <p className="text-xs uppercase tracking-wider text-[#826747] font-sans">
                      Included Passages:
                    </p>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {doc.passages.map(p => {
                        const isDone = isPassageCompleted(p.id);
                        const best = getPassageBestWpm(p.id);

                        return (
                          <div 
                            key={p.id}
                            className="p-2 bg-[#E9DFC9]/40 border border-[#30271F]/10 text-xs flex items-center justify-between"
                          >
                            <span className="truncate pr-2 font-medium">{p.title}</span>
                            {isDone ? (
                              <span className="text-[11px] text-[#75453F] font-mono-vintage shrink-0 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{best} WPM</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-[#826747] shrink-0">Untyped</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-[#30271F]/15 flex items-center justify-between">
                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="p-2 text-[#826747] hover:text-[#75453F] transition-colors"
                    title="Remove Manuscript"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleStartDocument(doc)}
                    className="px-4 py-2 bg-[#30271F] hover:bg-[#75453F] text-[#F5EFE3] text-xs font-serif transition-colors flex items-center gap-1.5"
                  >
                    <Feather className="w-3.5 h-3.5" />
                    <span>{progress > 0 ? 'Resume Folio' : 'Transcribe Folio'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
