import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wheat } from 'lucide-react';
import { UrduText } from './UrduText';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message = "بیماری کی پہچان ہو رہی ہے..." 
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-brand-background/90 flex flex-col items-center justify-center p-6 backdrop-blur-sm"
        >
          <div className="relative">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                rotate: { repeat: Infinity, duration: 3, ease: "linear" },
                scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }
              }}
              className="w-24 h-24 bg-brand-accent rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(45,198,83,0.3)]"
            >
              <Wheat className="w-12 h-12 text-brand-background" />
            </motion.div>
            
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute -inset-4 border-2 border-brand-accent rounded-full"
            />
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <UrduText className="text-2xl font-bold text-brand-cream leading-normal">
              {message}
            </UrduText>
            <p className="text-brand-cream/60 mt-2 font-mono text-xs uppercase tracking-[0.2em]">
              Analyzing with Gemini AI
            </p>
          </motion.div>

          <div className="absolute bottom-12 flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1, 
                  delay: i * 0.2 
                }}
                className="w-2 h-2 bg-brand-accent rounded-full"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
