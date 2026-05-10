import React, { useState } from 'react';
import { Key, ShieldCheck, ExternalLink, Languages } from 'lucide-react';
import { UrduText } from '../components/UrduText';
import { storage } from '../utils/storage';
import { useLanguage } from '../contexts/LanguageContext';

const SettingsScreen: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [apiKey, setApiKey] = useState(storage.getApiKey() || '');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    storage.setApiKey(apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const onLanguageChange = (lang: 'ur' | 'en') => {
    setLanguage(lang);
  };

  return (
    <div className="p-6 flex flex-col gap-8">
      <header className="pt-4">
        <h1 className="text-3xl font-black">{t('settings')}</h1>
        <UrduText className="text-sm opacity-50">{language === 'ur' ? 'اپنی ترجیحات یہاں ترتیب دیں' : 'Configure your preferences here'}</UrduText>
      </header>

      {/* API Key Section */}
      <section className="premium-card p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-accent rounded-xl text-white">
            <Key className="w-5 h-5" />
          </div>
          <UrduText className="text-xl font-black text-brand-background">{t('apiKey')}</UrduText>
        </div>

        <div className="relative">
          <input 
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AI Studio API Key"
            className="w-full bg-brand-cream/30 border border-brand-accent/20 rounded-2xl pl-4 pr-16 py-4 text-brand-background outline-none focus:border-brand-accent transition-all placeholder:text-brand-background/20 font-mono text-sm"
          />
          <button 
            onClick={() => setShowKey(!showKey)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-accent text-xs font-bold uppercase tracking-wider px-2 py-1"
          >
            {showKey ? 'Hide' : 'Show'}
          </button>
        </div>

        <a 
          href="https://aistudio.google.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-xs text-brand-accent font-bold hover:underline mt-1"
        >
          <ExternalLink className="w-3 h-3" />
          <UrduText className="leading-none text-xs !text-inherit">{t('getApiKey')}</UrduText>
        </a>
      </section>

      {/* Language Selection */}
      <section className="premium-card p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-primary rounded-xl text-white">
            <Languages className="w-5 h-5" />
          </div>
          <UrduText className="text-xl font-bold">{t('languageSelect')}</UrduText>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(['ur', 'en'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              className={`px-4 py-3 rounded-2xl border transition-all flex flex-col items-center gap-1 ${
                language === lang 
                ? 'bg-brand-primary border-brand-primary text-white' 
                : 'bg-[var(--bg-card)] border-brand-primary/10 text-brand-background hover:bg-brand-cream'
              }`}
            >
              <UrduText className={`font-bold text-lg m-0 leading-tight ${language === lang ? '!text-white' : ''}`}>
                {lang === 'ur' ? 'اردو' : 'English'}
              </UrduText>
              <span className="text-[10px] opacity-60 uppercase tracking-widest">{lang === 'ur' ? 'Native' : 'Default'}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-4 mt-auto">
        <button 
          onClick={handleSave}
          disabled={saved}
          className={`w-full py-4 rounded-[24px] font-bold text-xl transition-all shadow-xl active:scale-95 ${
            saved ? 'bg-success text-white' : 'bg-brand-accent text-white'
          }`}
        >
          {saved ? (
             <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-6 h-6" />
                <UrduText className="!text-white text-center">{t('saved')}</UrduText>
             </div>
          ) : (
            <UrduText className="text-center w-full">{t('save')}</UrduText>
          )}
        </button>

        <div className="text-center py-4 flex flex-col gap-1">
          <p className="text-[10px] font-mono text-brand-background/30 uppercase tracking-[0.3em]">KisaanAI v1.0.0</p>
          <p className="text-[9px] text-brand-background/20">Designed for Pakistani Farmers</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
