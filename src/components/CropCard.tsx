import React from 'react';
import { ScanRecord } from '../types';
import { UrduText } from './UrduText';
import { Calendar, ChevronRight } from 'lucide-react';
import { SeverityBadge } from './SeverityBadge';
import { useLanguage } from '../contexts/LanguageContext';

interface CropCardProps {
  scan: ScanRecord;
  onClick?: () => void;
}

export const CropCard: React.FC<CropCardProps> = ({ scan, onClick }) => {
  const { language, t } = useLanguage();
  const date = new Date(scan.timestamp).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div 
      onClick={onClick}
      className="premium-card flex items-center p-4 gap-4 cursor-pointer hover:bg-brand-cream/50 transition-colors group"
    >
      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
        <img 
          src={scan.imageUri} 
          alt={scan.result.crop_type_en} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      <div className="flex-grow min-w-0">
        <UrduText className="text-lg font-bold truncate">
          {language === 'ur' 
            ? (scan.result.disease_name_ur || (scan.result.healthy ? 'صحت مند پودا' : 'بیماری کی شناخت'))
            : (scan.result.disease_name_en || (scan.result.healthy ? 'Healthy Plant' : 'Disease Detection'))}
        </UrduText>
        <div className="flex items-center gap-2 mt-1">
          <Calendar className="w-3 h-3 text-brand-background/40" />
          <span className="text-xs text-brand-background/40 font-medium">{date}</span>
          <span className="text-xs text-brand-background/40">•</span>
          <span className="text-xs text-brand-background/60">
            {language === 'ur' ? scan.result.crop_type_ur : scan.result.crop_type_en}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <SeverityBadge severity={scan.result.severity} />
        <ChevronRight className="w-4 h-4 text-brand-accent group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
