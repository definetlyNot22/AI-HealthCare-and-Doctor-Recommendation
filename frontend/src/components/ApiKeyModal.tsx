import React, { useState } from 'react';
import { X, Key, Sparkles, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  isBackendKeySet: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  isBackendKeySet
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Key className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-base">AI Engine Configuration</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="p-4 bg-teal-50 dark:bg-teal-950/50 rounded-2xl border border-teal-100 dark:border-teal-800/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-teal-900 dark:text-teal-300">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Dual-Intelligence System Active</span>
            </div>
            <p className="text-xs text-teal-800 dark:text-teal-200 leading-relaxed font-medium">
              TriHealth AI automatically uses our <strong>Clinical Intelligence Core</strong> (offline verified protocols covering 20+ disease groups) so all 3 paradigms (Ayurveda, Homeopathy, Allopathy) work immediately with zero configuration.
            </p>
            {isBackendKeySet && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold pt-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Backend Google Gemini API Key is configured via environment.</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Optional: Custom Google Gemini API Key
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden font-mono"
            />
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Your key is saved locally in your browser and used exclusively for your symptom analysis.
            </p>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 dark:text-teal-400 hover:text-teal-700 font-bold flex items-center gap-1"
            >
              <span>Get a free Gemini API key</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {inputKey && (
              <button
                type="button"
                onClick={() => {
                  setInputKey('');
                  onSaveApiKey('');
                }}
                className="text-slate-400 hover:text-rose-600 font-semibold"
              >
                Clear Key
              </button>
            )}
          </div>

          <div className="pt-3 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black transition-all shadow-md shadow-teal-600/30 flex items-center justify-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Key</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
