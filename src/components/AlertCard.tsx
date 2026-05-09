import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Bell, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UrduText } from './UrduText';
import { Alert } from '../data/mockAlerts';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface AlertCardProps {
  alert: Alert;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { language } = useLanguage();
  const isUrdu = language === 'ur';

  const severityColors = {
    Severe: 'bg-danger',
    High: 'bg-danger/80',
    Medium: 'bg-warning',
    Low: 'bg-success',
  };

  const severityBorder = {
    Severe: 'border-danger',
    High: 'border-danger/80',
    Medium: 'border-warning',
    Low: 'border-success',
  };

  const getTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case 'pest': return '🐛';
      case 'disease': return '🦠';
      case 'locust': return '🦗';
      case 'weather': return '🌦️';
      case 'climate_migration': return '🌊';
      default: return '⚠️';
    }
  };

  return (
    <motion.div 
      layout
      className="premium-card mb-4 relative overflow-hidden"
    >
      {/* Side color strip */}
      <div className={cn("absolute top-0 bottom-0 w-1.5", severityColors[alert.severity])} />
      
      <div className="p-4 pl-6">
        {/* Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl" title={alert.type}>{getTypeIcon(alert.type)}</span>
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider",
              severityColors[alert.severity]
            )}>
              {alert.severity}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-brand-primary/10 text-brand-primary uppercase tracking-wider">
              {isUrdu ? alert.crop_ur : alert.crop}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{alert.valid_from}</span>
          </div>
        </div>

        {/* Title */}
        <UrduText className="text-xl font-bold mb-2 leading-tight">
          {isUrdu ? alert.title_ur : alert.title_en}
        </UrduText>

        {/* Description */}
        <UrduText className={cn(
          "text-sm text-gray-600 mb-4 transition-all duration-300",
          !isExpanded && "line-clamp-2"
        )}>
          {isUrdu ? alert.description_ur : alert.description_en}
        </UrduText>

        {/* Expandable Section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="pt-4 border-t border-gray-100">
                <UrduText className="font-bold text-brand-primary mb-3">
                  {isUrdu ? 'احتیاطی تدابیر:' : 'Precautions:'}
                </UrduText>
                <ul className="space-y-2">
                  {(isUrdu ? alert.precautions_ur : alert.precautions_en).map((p, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center text-[10px] font-bold">
                        {i + 1}
                      </span>
                      <UrduText className="flex-1">{p}</UrduText>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                <div className="flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  <span>{alert.source}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-2 text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-colors text-xs font-bold"
        >
          <UrduText className="m-0 !text-inherit">
            {isUrdu 
              ? (isExpanded ? 'کم معلومات' : 'احتیاطی تدابیر دیکھیں')
              : (isExpanded ? 'Show Less' : 'View Precautions')
            }
          </UrduText>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
    </motion.div>
  );
};
