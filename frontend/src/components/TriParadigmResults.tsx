import React, { useState } from 'react';
import { 
  Leaf, 
  Droplet, 
  Cross, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  ChevronRight, 
  Sparkles, 
  ArrowLeft,
  Flame,
  Wind,
  Droplets,
  HeartPulse,
  Info,
  CheckCircle2
} from 'lucide-react';
import { SymptomAnalysisResponse } from '../types';

interface TriParadigmResultsProps {
  data: SymptomAnalysisResponse;
  onSelectSystem: (system: 'Ayurveda' | 'Homeopathy' | 'Allopathy' | 'All') => void;
  onReset: () => void;
  city: string;
}

export const TriParadigmResults: React.FC<TriParadigmResultsProps> = ({
  data,
  onSelectSystem,
  onReset,
  city,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'ayurveda' | 'homeopathy' | 'allopathy'>('all');

  const { ayurveda, homeopathy, allopathy, comparison } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn transition-colors duration-300">
      {/* Top Clinical Summary Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1.5">
            <button
              onClick={onReset}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1.5 mb-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Modify Symptoms
            </button>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Clinical Assessment & 3-Paradigm Strategy
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              {data.symptom_summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-700/60 flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              {data.generated_by}
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700/60 shadow-2xs">
              {data.severity_assessment}
            </span>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="pt-4 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Select your preferred paradigm to find matched doctors in <strong>{city}</strong>:
          </p>
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-black shadow-inner">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'all' 
                  ? 'bg-white dark:bg-slate-700 shadow-xs text-slate-900 dark:text-white' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Compare All (3 Columns)
            </button>
            <button
              onClick={() => setActiveTab('ayurveda')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'ayurveda' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400'
              }`}
            >
              🌿 Ayurveda
            </button>
            <button
              onClick={() => setActiveTab('homeopathy')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'homeopathy' 
                  ? 'bg-teal-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-400'
              }`}
            >
              💧 Homeopathy
            </button>
            <button
              onClick={() => setActiveTab('allopathy')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'allopathy' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400'
              }`}
            >
              🔬 Allopathy
            </button>
          </div>
        </div>
      </div>

      {/* The 3 Medical Paradigm Cards */}
      <div className={`grid gap-6 ${
        activeTab === 'all' 
          ? 'grid-cols-1 lg:grid-cols-3' 
          : 'grid-cols-1 max-w-3xl mx-auto'
      }`}>
        {/* ================= 1. AYURVEDA CARD ================= */}
        {(activeTab === 'all' || activeTab === 'ayurveda') && (
          <div className="bg-gradient-to-b from-emerald-50/70 to-white dark:from-slate-900 dark:to-slate-900/95 rounded-3xl border-2 border-emerald-500/40 dark:border-emerald-600/40 shadow-xl shadow-emerald-900/10 overflow-hidden flex flex-col justify-between hover:border-emerald-500 transition-all duration-300 group">
            <div>
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-2xl bg-white/15 backdrop-blur-md shadow-inner">
                      <Leaf className="w-5 h-5 text-emerald-200" />
                    </span>
                    <div>
                      <h3 className="font-black text-lg tracking-tight">Option 1: Ayurveda</h3>
                      <p className="text-xs text-emerald-100 font-medium">प्राकृतिक चिकित्सा • Dosha Balance</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-900/80 text-emerald-200 border border-emerald-400/40 uppercase tracking-wider">
                    Root Cause
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 text-sm">
                {/* Dosha Imbalance Section */}
                <div className="space-y-2 bg-emerald-50/90 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-950 dark:text-emerald-300">
                    <span>Dosha Analysis:</span>
                    <span className="font-extrabold text-emerald-800 dark:text-emerald-400">{ayurveda.dosha_imbalance}</span>
                  </div>

                  {/* Dosha Ratio Meter */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1"><Wind className="w-3 h-3 text-sky-500" /> Vata {ayurveda.dosha_breakdown?.Vata || 40}%</span>
                      <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-amber-500" /> Pitta {ayurveda.dosha_breakdown?.Pitta || 45}%</span>
                      <span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-emerald-500" /> Kapha {ayurveda.dosha_breakdown?.Kapha || 15}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full flex overflow-hidden shadow-inner">
                      <div style={{ width: `${ayurveda.dosha_breakdown?.Vata || 40}%` }} className="bg-sky-400" title="Vata"></div>
                      <div style={{ width: `${ayurveda.dosha_breakdown?.Pitta || 45}%` }} className="bg-amber-400" title="Pitta"></div>
                      <div style={{ width: `${ayurveda.dosha_breakdown?.Kapha || 15}%` }} className="bg-emerald-500" title="Kapha"></div>
                    </div>
                  </div>
                </div>

                {/* Classical Herbal Formulations */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Classical Herbal Formulations:
                  </h4>
                  <div className="space-y-2">
                    {ayurveda.herbal_remedies.map((herb, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-slate-900 dark:text-white">{herb.name}</span>
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full font-bold border border-emerald-200/50 dark:border-emerald-800">
                            {herb.form}
                          </span>
                        </div>
                        {herb.sanskrit_name && (
                          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-serif italic font-medium">{herb.sanskrit_name}</div>
                        )}
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">{herb.purpose}</p>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1 pt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" /> {herb.dosage}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Diet & Lifestyle (Ahara / Vihara) */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-400">
                    Dietary & Lifestyle Guidelines (Ahara / Vihara):
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {ayurveda.dietary_guidelines.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Timeline */}
                <div className="pt-2 border-t border-emerald-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Expected Timeline:</span>
                  <span className="text-emerald-800 dark:text-emerald-400 font-extrabold">{ayurveda.expected_timeline}</span>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="p-6 pt-0">
              <button
                onClick={() => onSelectSystem('Ayurveda')}
                className="w-full py-3.5 px-4 rounded-2xl font-black text-white text-sm bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Choose Ayurveda & View Top Doctors</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* ================= 2. HOMEOPATHY CARD ================= */}
        {(activeTab === 'all' || activeTab === 'homeopathy') && (
          <div className="bg-gradient-to-b from-teal-50/70 to-white dark:from-slate-900 dark:to-slate-900/95 rounded-3xl border-2 border-teal-500/40 dark:border-teal-600/40 shadow-xl shadow-teal-900/10 overflow-hidden flex flex-col justify-between hover:border-teal-500 transition-all duration-300 group">
            <div>
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-700 to-cyan-800 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-2xl bg-white/15 backdrop-blur-md shadow-inner">
                      <Droplet className="w-5 h-5 text-teal-200" />
                    </span>
                    <div>
                      <h3 className="font-black text-lg tracking-tight">Option 2: Homeopathy</h3>
                      <p className="text-xs text-teal-100 font-medium">समान चिकित्सा • Vital Force Healing</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-teal-900/80 text-teal-200 border border-teal-400/40 uppercase tracking-wider">
                    Zero Side-Effects
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 text-sm">
                {/* Constitutional Analysis */}
                <div className="space-y-2 bg-teal-50/90 dark:bg-teal-950/40 p-4 rounded-2xl border border-teal-200/80 dark:border-teal-800/60">
                  <div className="text-xs font-bold text-teal-950 dark:text-teal-300">Constitutional Assessment:</div>
                  <p className="text-xs text-teal-900 dark:text-teal-200 leading-snug font-medium">
                    {homeopathy.totality_of_symptoms}
                  </p>
                  <div className="text-[11px] font-bold text-teal-700 dark:text-teal-400 pt-1">
                    Profile Diathesis: <strong>{homeopathy.constitutional_type}</strong>
                  </div>
                </div>

                {/* Homeopathic Remedies */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-teal-900 dark:text-teal-400 flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Indicated Constitutional Remedies:
                  </h4>
                  <div className="space-y-2">
                    {homeopathy.remedies.map((rem, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-slate-900 dark:text-white">{rem.name}</span>
                          <span className="text-[10px] text-teal-800 dark:text-teal-300 bg-teal-100 dark:bg-teal-950 px-2.5 py-0.5 rounded-full font-black border border-teal-300/40">
                            Potency: {rem.potency}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">{rem.key_indication}</p>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1 pt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" /> {rem.dosage}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lifestyle & Precautions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-teal-900 dark:text-teal-400">
                    Important Remedy Precautions:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {homeopathy.lifestyle_precautions.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Timeline */}
                <div className="pt-2 border-t border-teal-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Expected Timeline:</span>
                  <span className="text-teal-800 dark:text-teal-400 font-extrabold">{homeopathy.expected_timeline}</span>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="p-6 pt-0">
              <button
                onClick={() => onSelectSystem('Homeopathy')}
                className="w-full py-3.5 px-4 rounded-2xl font-black text-white text-sm bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 shadow-lg shadow-teal-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Choose Homeopathy & View Top Doctors</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* ================= 3. ALLOPATHY CARD ================= */}
        {(activeTab === 'all' || activeTab === 'allopathy') && (
          <div className="bg-gradient-to-b from-blue-50/70 to-white dark:from-slate-900 dark:to-slate-900/95 rounded-3xl border-2 border-blue-500/40 dark:border-blue-600/40 shadow-xl shadow-blue-900/10 overflow-hidden flex flex-col justify-between hover:border-blue-500 transition-all duration-300 group">
            <div>
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-2xl bg-white/15 backdrop-blur-md shadow-inner">
                      <Cross className="w-5 h-5 text-blue-200" />
                    </span>
                    <div>
                      <h3 className="font-black text-lg tracking-tight">Option 3: Allopathy</h3>
                      <p className="text-xs text-blue-100 font-medium">आधुनिक चिकित्सा • Evidence-Based Medicine</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-900/80 text-blue-200 border border-blue-400/40 uppercase tracking-wider">
                    Fast Relief
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 text-sm">
                {/* Clinical Diagnosis Section */}
                <div className="space-y-2 bg-blue-50/90 dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-200/80 dark:border-blue-800/60">
                  <div className="text-xs font-bold text-blue-950 dark:text-blue-300">Probable Clinical Diagnosis:</div>
                  <p className="text-xs font-black text-blue-900 dark:text-blue-200 leading-snug">
                    {allopathy.probable_diagnosis}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed pt-1 font-medium">
                    {allopathy.clinical_summary}
                  </p>
                </div>

                {/* Diagnostic Tests */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-blue-900 dark:text-blue-400 flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Standard Diagnostic Tests / Investigations:
                  </h4>
                  <div className="space-y-1.5">
                    {allopathy.diagnostic_tests.map((test, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white dark:bg-slate-800/90 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                        <span>{test}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conventional Medications */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-blue-900 dark:text-blue-400">
                    Standard Pharmacotherapy Classes:
                  </h4>
                  <div className="space-y-2">
                    {allopathy.conventional_medications.map((med, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-slate-900 dark:text-white">{med.drug_class}</span>
                          <span className="text-[10px] text-blue-700 dark:text-blue-300 font-bold bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                            {med.common_examples}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">{med.role}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Red Flags Alert Box */}
                {allopathy.red_flags?.length > 0 && (
                  <div className="space-y-1.5 bg-rose-50 dark:bg-rose-950/40 p-3.5 rounded-2xl border border-rose-200 dark:border-rose-800/60">
                    <div className="text-xs font-black text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 animate-pulse" />
                      <span>Red Flag Signs (Seek Immediate ER Care):</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-rose-900 dark:text-rose-200 font-medium">
                      {allopathy.red_flags.slice(0, 2).map((rf, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-rose-500">•</span>
                          <span>{rf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Timeline */}
                <div className="pt-2 border-t border-blue-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Expected Timeline:</span>
                  <span className="text-blue-800 dark:text-blue-400 font-extrabold">{allopathy.expected_timeline}</span>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="p-6 pt-0">
              <button
                onClick={() => onSelectSystem('Allopathy')}
                className="w-full py-3.5 px-4 rounded-2xl font-black text-white text-sm bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg shadow-blue-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Choose Allopathy & View Top Doctors</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tri-Paradigm Comparison Matrix */}
      {comparison && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-700/50">
              <Info className="w-5 h-5" />
            </div>
            <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
              Comparative Analysis Matrix: Which Approach Fits You Best?
            </h3>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-slate-50/90 dark:bg-slate-800/90">
                  <th className="p-3.5 font-black text-slate-900 dark:text-white">Evaluation Criteria</th>
                  <th className="p-3.5 font-black text-emerald-800 dark:text-emerald-400">🌿 Ayurveda</th>
                  <th className="p-3.5 font-black text-teal-800 dark:text-teal-400">💧 Homeopathy</th>
                  <th className="p-3.5 font-black text-blue-800 dark:text-blue-400">🔬 Allopathy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">Speed of Symptom Relief</td>
                  <td className="p-3.5 text-emerald-900 dark:text-emerald-300">{comparison.speed_of_relief?.Ayurveda}</td>
                  <td className="p-3.5 text-teal-900 dark:text-teal-300">{comparison.speed_of_relief?.Homeopathy}</td>
                  <td className="p-3.5 text-blue-900 dark:text-blue-300 font-bold">{comparison.speed_of_relief?.Allopathy}</td>
                </tr>
                <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">Root-Cause Focus</td>
                  <td className="p-3.5 text-emerald-900 dark:text-emerald-300 font-bold">{comparison.root_cause_focus?.Ayurveda}</td>
                  <td className="p-3.5 text-teal-900 dark:text-teal-300 font-bold">{comparison.root_cause_focus?.Homeopathy}</td>
                  <td className="p-3.5 text-blue-900 dark:text-blue-300">{comparison.root_cause_focus?.Allopathy}</td>
                </tr>
                <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">Side Effect Profile</td>
                  <td className="p-3.5 text-emerald-900 dark:text-emerald-300">{comparison.side_effect_profile?.Ayurveda}</td>
                  <td className="p-3.5 text-teal-900 dark:text-teal-300 font-bold">{comparison.side_effect_profile?.Homeopathy}</td>
                  <td className="p-3.5 text-blue-900 dark:text-blue-300">{comparison.side_effect_profile?.Allopathy}</td>
                </tr>
                <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">Lifestyle Dependency</td>
                  <td className="p-3.5 text-emerald-900 dark:text-emerald-300">{comparison.lifestyle_dependency?.Ayurveda}</td>
                  <td className="p-3.5 text-teal-900 dark:text-teal-300">{comparison.lifestyle_dependency?.Homeopathy}</td>
                  <td className="p-3.5 text-blue-900 dark:text-blue-300">{comparison.lifestyle_dependency?.Allopathy}</td>
                </tr>
                <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">Cost Level</td>
                  <td className="p-3.5 text-emerald-900 dark:text-emerald-300">{comparison.approx_cost_level?.Ayurveda}</td>
                  <td className="p-3.5 text-teal-900 dark:text-teal-300">{comparison.approx_cost_level?.Homeopathy}</td>
                  <td className="p-3.5 text-blue-900 dark:text-blue-300">{comparison.approx_cost_level?.Allopathy}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 mt-5">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Want to see all specialists without picking a single path?
            </p>
            <button
              onClick={() => onSelectSystem('All')}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-colors shrink-0"
            >
              Browse All Doctors in {city} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
