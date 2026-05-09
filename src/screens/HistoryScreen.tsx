import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, History as HistoryIcon, Search, AlertCircle } from 'lucide-react';
import { UrduText } from '../components/UrduText';
import { CropCard } from '../components/CropCard';
import { storage } from '../utils/storage';
import { ScanRecord } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';

const HistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setHistory(storage.getHistory());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storage.removeFromHistory(id);
    setHistory(storage.getHistory());
  };

  const filteredHistory = history.filter(item => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    
    return (
      item.result.disease_name_ur?.toLowerCase().includes(query) || 
      item.result.disease_name_en?.toLowerCase().includes(query) ||
      item.result.crop_type_ur?.toLowerCase().includes(query) ||
      item.result.crop_type_en?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col h-full bg-brand-cream">
      <header className="p-6 pt-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-black">{t('history')}</h1>
          <HistoryIcon className="w-8 h-8 text-brand-accent" />
        </div>
        <UrduText className="text-sm opacity-50 mb-6">{language === 'ur' ? 'آپ کے تمام پچھلے اسکینز' : 'All your previous scans'}</UrduText>

        <div className="relative">
          <Search className={cn(
            "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-brand-background/30 z-10",
            language === 'ur' ? "right-4" : "left-4"
          )} />
          <input 
            dir={language === 'ur' ? 'rtl' : 'ltr'}
            type="text"
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full bg-[var(--bg-card)] border border-brand-accent/20 rounded-2xl py-3 outline-none focus:border-brand-accent transition-all font-urdu",
              language === 'ur' ? "pr-12 pl-4" : "pl-12 pr-4"
            )}
          />
        </div>
      </header>

      <div className="flex-grow overflow-y-auto px-6 pb-24">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30 gap-4 mt-20">
            <HistoryIcon className="w-20 h-20" />
            <UrduText className="text-xl font-bold">{t('noHistory')}</UrduText>
          </div>
        ) : filteredHistory.length === 0 ? (
           <div className="flex flex-col items-center justify-center p-12 opacity-30 gap-2">
            <AlertCircle className="w-12 h-12" />
            <UrduText className="text-lg">{t('noResults')}</UrduText>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {filteredHistory.map((scan) => (
                <motion.div
                  key={scan.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <CropCard 
                    scan={scan} 
                    onClick={() => navigate('/result', { state: { result: scan.result, imageUri: scan.imageUri, isFromHistory: true } })}
                  />
                  <button 
                    onClick={(e) => handleDelete(scan.id, e)}
                    className="absolute -top-2 -right-2 bg-danger text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:scale-110 active:scale-95"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryScreen;
