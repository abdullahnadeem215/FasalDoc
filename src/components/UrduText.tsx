import React from 'react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface LocalizedTextProps {
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span' | 'div';
}

/**
 * Component to render text with proper RTL/LTR and font settings based on language
 */
export const LocalizedText: React.FC<LocalizedTextProps> = ({ 
  children, 
  className, 
  as: Component = 'p' 
}) => {
  const { isRTL, language } = useLanguage();
  
  return (
    <Component 
      dir={isRTL ? "rtl" : "ltr"} 
      className={cn(
        language === 'ur' ? "font-urdu text-right" : "font-sans text-left",
        "leading-relaxed",
        className
      )}
    >
      {children}
    </Component>
  );
};

// Keep UrduText as an alias for backward compatibility or specific Urdu usage
export const UrduText = LocalizedText;
