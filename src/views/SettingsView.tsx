import React from 'react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../utils/audio';
import { 
  Sliders, 
  Volume2, 
  VolumeX, 
  Type, 
  AlignLeft, 
  AlignJustify, 
  Check, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const handleTestSound = () => {
    soundEngine.playKeystroke(settings.soundType, settings.soundVolume);
  };

  const handleTestBell = () => {
    soundEngine.playBell(settings.soundVolume);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 font-serif text-[#30271F] space-y-10">
      
      {/* Header */}
      <div className="border-b border-[#30271F]/15 pb-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#826747] mb-1">
          <span>❦</span>
          <span>Reader Preferences</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#30271F]">
          Transcription Settings
        </h1>
        <p className="text-sm text-[#826747] mt-1 max-w-2xl leading-relaxed">
          Configure the visual typography, acoustic typewriter feedback, and transcription cadence to match your personal writing desk.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Settings Controls (Left Column) */}
        <div className="md:col-span-7 space-y-8 bg-[#F5EFE3] border border-[#30271F]/20 p-6 sm:p-8 rounded-xs shadow-xs">
          
          {/* 1. TYPOGRAPHY SIZING */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#826747] mb-2 font-sans">
              Folio Font Scale
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'compact', label: 'Compact', detail: '18px' },
                { id: 'standard', label: 'Standard', detail: '20px' },
                { id: 'generous', label: 'Generous', detail: '24px' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => updateSettings({ fontScale: opt.id as 'compact' | 'standard' | 'generous' })}
                  className={`p-3 text-center border rounded-xs transition-colors ${
                    settings.fontScale === opt.id
                      ? 'border-[#75453F] bg-[#E9DFC9] text-[#30271F] font-semibold'
                      : 'border-[#30271F]/15 bg-[#E9DFC9]/20 hover:bg-[#E9DFC9]/50 text-[#826747]'
                  }`}
                >
                  <p className="text-sm">{opt.label}</p>
                  <p className="text-[10px] text-[#826747] mt-0.5 font-mono-vintage">{opt.detail}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 2. CARET STYLE */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#826747] mb-2 font-sans">
              Cursor Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'line', label: 'Ink Line', sample: '|' },
                { id: 'underline', label: 'Underline', sample: '_' },
                { id: 'block', label: 'Classic Block', sample: '■' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => updateSettings({ caretStyle: opt.id as 'line' | 'underline' | 'block' })}
                  className={`p-3 text-center border rounded-xs transition-colors ${
                    settings.caretStyle === opt.id
                      ? 'border-[#75453F] bg-[#E9DFC9] text-[#30271F] font-semibold'
                      : 'border-[#30271F]/15 bg-[#E9DFC9]/20 hover:bg-[#E9DFC9]/50 text-[#826747]'
                  }`}
                >
                  <p className="text-sm">{opt.label}</p>
                  <p className="text-xs text-[#75453F] mt-1 font-mono-vintage">{opt.sample}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 3. TEXT ALIGNMENT */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#826747] mb-2 font-sans">
              Page Typeset Alignment
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateSettings({ textAlignment: 'left' })}
                className={`p-3 flex items-center justify-center gap-2 border rounded-xs transition-colors ${
                  settings.textAlignment === 'left'
                    ? 'border-[#75453F] bg-[#E9DFC9] text-[#30271F] font-semibold'
                    : 'border-[#30271F]/15 bg-[#E9DFC9]/20 hover:bg-[#E9DFC9]/50 text-[#826747]'
                }`}
              >
                <AlignLeft className="w-4 h-4" />
                <span className="text-sm">Natural Left</span>
              </button>

              <button
                onClick={() => updateSettings({ textAlignment: 'justify' })}
                className={`p-3 flex items-center justify-center gap-2 border rounded-xs transition-colors ${
                  settings.textAlignment === 'justify'
                    ? 'border-[#75453F] bg-[#E9DFC9] text-[#30271F] font-semibold'
                    : 'border-[#30271F]/15 bg-[#E9DFC9]/20 hover:bg-[#E9DFC9]/50 text-[#826747]'
                }`}
              >
                <AlignJustify className="w-4 h-4" />
                <span className="text-sm">Book Justified</span>
              </button>
            </div>
          </div>

          {/* 4. ACOUSTIC SOUND ENGINE */}
          <div className="pt-4 border-t border-[#30271F]/15 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#826747] font-sans">
                  Keystroke Sound
                </label>
                <p className="text-xs text-[#826747] mt-0.5">
                  Web Audio synthesized vintage typewriter acoustics
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestSound}
                  className="px-2.5 py-1 text-xs border border-[#30271F]/30 bg-[#E9DFC9] hover:bg-[#D9C9A9] text-[#30271F] transition-colors"
                >
                  Test Key
                </button>
                <button
                  type="button"
                  onClick={handleTestBell}
                  className="px-2.5 py-1 text-xs border border-[#30271F]/30 bg-[#E9DFC9] hover:bg-[#D9C9A9] text-[#30271F] transition-colors"
                >
                  Test Bell 🔔
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'typewriter', label: 'Mechanical', desc: 'Antique clack' },
                { id: 'soft_click', label: 'Fountain Pen', desc: 'Muted strike' },
                { id: 'off', label: 'Silent', desc: 'No sound' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    updateSettings({ soundType: opt.id as 'typewriter' | 'soft_click' | 'off' });
                    soundEngine.playKeystroke(opt.id as 'typewriter' | 'soft_click' | 'off', settings.soundVolume);
                  }}
                  className={`p-2.5 text-center border rounded-xs transition-colors ${
                    settings.soundType === opt.id
                      ? 'border-[#75453F] bg-[#E9DFC9] text-[#30271F] font-semibold'
                      : 'border-[#30271F]/15 bg-[#E9DFC9]/20 hover:bg-[#E9DFC9]/50 text-[#826747]'
                  }`}
                >
                  <p className="text-xs font-semibold">{opt.label}</p>
                  <p className="text-[10px] text-[#826747] mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>

            {settings.soundType !== 'off' && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs text-[#826747] mb-1">
                  <span>Audio Level</span>
                  <span className="font-mono-vintage">{Math.round(settings.soundVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={e => updateSettings({ soundVolume: parseFloat(e.target.value) })}
                  className="w-full accent-[#75453F] cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* 5. PASSAGE PROGRESSION TOGGLES */}
          <div className="pt-4 border-t border-[#30271F]/15 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-[#30271F]">Auto-Advance Passages</p>
                <p className="text-xs text-[#826747]">Automatically flip to the next passage upon finishing</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoAdvance}
                onChange={e => updateSettings({ autoAdvance: e.target.checked })}
                className="w-4 h-4 accent-[#75453F] rounded-xs cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-[#30271F]">Focus Mode by Default</p>
                <p className="text-xs text-[#826747]">Hide navigation bars during transcription</p>
              </div>
              <input
                type="checkbox"
                checked={settings.focusMode}
                onChange={e => updateSettings({ focusMode: e.target.checked })}
                className="w-4 h-4 accent-[#75453F] rounded-xs cursor-pointer"
              />
            </label>
          </div>

        </div>

        {/* Live Typographic Preview (Right Column) */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#826747]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Folio Preview</span>
          </div>

          <div 
            className="book-page-surface border border-[#30271F]/20 p-8 rounded-xs shadow-md space-y-4"
            style={{
              boxShadow: '0 8px 24px -4px rgba(48,39,31,0.06)'
            }}
          >
            <div className="text-center border-b border-[#30271F]/10 pb-3">
              <p className="text-[10px] tracking-widest uppercase text-[#826747] font-sans">
                Sample Leaf · Preview
              </p>
            </div>

            <div 
              className={`font-galliard ${
                settings.fontScale === 'compact' ? 'text-lg leading-relaxed' :
                settings.fontScale === 'generous' ? 'text-2xl leading-[2.1]' :
                'text-xl leading-[1.95]'
              } ${settings.textAlignment === 'justify' ? 'text-justify' : 'text-left'}`}
            >
              <span className="text-[#30271F]">It is a truth uni</span>
              <span className="text-[#75453F] bg-[#75453F]/15 underline decoration-[#75453F]/60">v</span>
              <span className="relative inline">
                <span 
                  className={`inline-block absolute -left-[1px] top-0 bottom-0 w-[2px] bg-[#75453F] ${
                    settings.caretStyle === 'underline' ? 'border-b-2 border-[#30271F]' :
                    settings.caretStyle === 'block' ? 'bg-[#30271F]/20' : 'bg-[#75453F]'
                  }`}
                  style={{ height: '1.2em' }}
                />
                <span className="text-[#826747]/45">ersally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.</span>
              </span>
            </div>

            <div className="pt-4 border-t border-[#30271F]/10 flex items-center justify-between text-[11px] text-[#826747]">
              <span>❦</span>
              <span>— 1 —</span>
              <span>❧</span>
            </div>
          </div>

          <div className="p-4 bg-[#E9DFC9]/40 border border-[#30271F]/15 text-xs text-[#826747] leading-relaxed">
            <p>
              Settings are saved automatically to your browser storage and will persist whenever you revisit your desk.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
