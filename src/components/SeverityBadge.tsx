import React from 'react';
import { cn } from '../lib/utils';
import { UrduText } from './UrduText';
import { useLanguage } from '../contexts/LanguageContext';

interface SeverityBadgeProps {
  severity: 'Low' | 'Medium' | 'High' | 'Severe' | null;
  className?: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, className }) => {
  const { language, t } = useLanguage();
  if (!severity) return null;

  const config = {
    Low: { 
      ur: 'کم', 
      bg: 'bg-success/10', 
      text: 'text-success', 
      border: 'border-success/20' 
    },
    Medium: { 
      ur: 'درمیانہ', 
      bg: 'bg-warning/10', 
      text: 'text-warning', 
      border: 'border-warning/20' 
    },
    High: { 
      ur: 'شدید', 
      bg: 'bg-danger/10', 
      text: 'text-danger', 
      border: 'border-danger/20' 
    },
    Severe: { 
      ur: 'بہت شدید', 
      bg: 'bg-danger/20', 
      text: 'text-danger', 
      border: 'border-danger/40' 
    }
  };

  const { bg, text, border } = config[severity];

  return (
    <div className={cn(
      "px-3 py-1 rounded-full border text-[10px] sm:text-xs font-bold whitespace-nowrap flex items-center justify-center gap-1.5",
      bg, text, border, className
    )}>
      <UrduText className="text-[10px] leading-tight m-0 p-0 !text-inherit">
        {language === 'ur' ? config[severity].ur : severity}
      </UrduText>
      {language === 'ur' && <span className="opacity-60 text-[8px] uppercase tracking-wider">{severity}</span>}
    </div>
  );
};
