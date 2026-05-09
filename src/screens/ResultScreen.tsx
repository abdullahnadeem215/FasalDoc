import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronUp, Save, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { UrduText } from '../components/UrduText';
import { SeverityBadge } from '../components/SeverityBadge';
import { DiseaseResult, ScanRecord } from '../types';
import { storage } from '../utils/storage';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

const ResultScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { result: DiseaseResult; imageUri: string; isFromHistory?: boolean };

  const [expandedSection, setExpandedSection] = useState<string | null>('symptoms');
  const [isSaved, setIsSaved] = useState(state?.isFromHistory || false);

  if (!state) {
    return (
      <div className="p-6 text-center">
        <UrduText className="text-xl">Data not available</UrduText>
        <button onClick={() => navigate('/')} className="gold-button mt-4">{t('home')}</button>
      </div>
    );
  }

  const { result, imageUri } = state;

  const handleSave = () => {
    if (isSaved) return;
    const record: ScanRecord = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      imageUri,
      result
    };
    const success = storage.saveToHistory(record);
    if (success) {
      setIsSaved(true);
    } else {
      alert(language === 'ur' ? 'ڈیٹا محفوظ کرنے کے لیے جگہ ختم ہو گئی ہے' : 'Storage full. Cannot save more records.');
    }
  };

  const sections = [
    { id: 'symptoms', title: t('symptoms'), ur: result.symptoms_ur, en: result.symptoms_en, color: 'bg-brand-primary/5' },
    { id: 'treatment', title: t('treatment'), ur: result.treatment_ur, en: result.treatment_en, color: 'bg-success/5' },
    { id: 'prevention', title: t('prevention'), ur: result.prevention_ur, en: result.prevention_en, color: 'bg-warning/5' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream relative pb-10">
      {/* Header Image */}
      <div className="relative h-[35vh] w-full group">
        <img src={imageUri} alt="Scanned Crop" className="w-full h-full object-cover shadow-2xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-background/80 to-transparent" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-3 bg-brand-background/20 backdrop-blur-md rounded-2xl text-white hover:bg-brand-background/40 transition-all border border-white/10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
           <div>
             <UrduText className="text-3xl font-black !text-brand-cream !text-left drop-shadow-lg">
                {language === 'ur' ? result.crop_type_ur : result.crop_type_en}
             </UrduText>
             <p className="text-brand-cream/60 font-mono uppercase tracking-[0.2em] text-xs">
                {language === 'ur' ? result.crop_type_en : result.crop_type_ur}
             </p>
           </div>
           <div className="bg-brand-accent/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-brand-accent/30">
              <span className="text-brand-accent text-sm font-bold">{result.confidence_percent}% Confidence</span>
           </div>
        </div>
      </div>

      {/* Result Card */}
      <div className="px-6 -mt-8 relative z-10 flex flex-col gap-4">
        <div className="premium-card p-6 flex flex-col items-center text-center gap-2">
          {result.healthy ? (
            <div className="p-3 bg-success/20 rounded-full text-success"><CheckCircle2 className="w-10 h-10" /></div>
          ) : (
            <div className="p-3 bg-danger/20 rounded-full text-danger"><AlertTriangle className="w-10 h-10" /></div>
          )}

          <div className="mt-2 text-center w-full">
            <UrduText className={cn("text-4xl font-black mb-1", result.healthy ? "text-success" : "text-danger")}>
              {language === 'ur' 
                ? (result.disease_name_ur || t('healthy')) 
                : (result.disease_name_en || t('healthy'))}
            </UrduText>
            <p className="text-brand-background/40 font-mono text-xs uppercase tracking-widest text-center">
              {language === 'ur' 
                ? (result.disease_name_en || 'Healthy Plant') 
                : (result.disease_name_ur || 'صحت مند پودا')}
            </p>
          </div>

          {!result.healthy && <SeverityBadge severity={result.severity} className="mt-2 scale-125" />}
        </div>

        {/* Expandable Sections */}
        {!result.healthy && sections.map((section) => (
          <div key={section.id} className={cn("premium-card border-none transition-all", section.color)}>
            <button 
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
              className="w-full flex items-center justify-between p-5 outline-none"
            >
              <UrduText className="text-2xl font-black text-brand-background">{section.title}</UrduText>
              {expandedSection === section.id ? <ChevronUp className="w-6 h-6 text-brand-accent" /> : <ChevronDown className="w-6 h-6 text-brand-accent/50" />}
            </button>
            
            <AnimatePresence>
              {expandedSection === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-0 flex flex-col gap-3">
                    <UrduText className="text-xl font-bold leading-[2.2] text-brand-background bg-white/60 p-5 rounded-2xl border border-brand-accent/20 shadow-inner">
                      {language === 'ur' ? (section.ur || 'معلومات دستیاب نہیں ہے') : (section.en || 'Information not available')}
                    </UrduText>
                    <p className="text-sm font-medium italic text-brand-background/50 pl-2 leading-relaxed">
                      {language === 'ur' ? section.en : section.ur}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-4">
          <button 
            onClick={handleSave}
            disabled={isSaved}
            className={cn(
              "w-full py-4 rounded-3xl font-bold text-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg",
              isSaved ? "bg-success text-white" : "bg-brand-accent text-white"
            )}
          >
            {isSaved ? <ShieldCheck className="w-6 h-6" /> : <Save className="w-6 h-6" />}
            <UrduText className="m-0 !text-white">{isSaved ? t('saved') : t('save')}</UrduText>
          </button>

          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 rounded-3xl border-2 border-brand-primary text-brand-primary font-bold text-xl flex items-center justify-center gap-3 hover:bg-brand-primary hover:text-white transition-all active:scale-95"
          >
            <RefreshCw className="w-6 h-6" />
            <UrduText className="m-0 !text-inherit">{t('scanAgain')}</UrduText>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
