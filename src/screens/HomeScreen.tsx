import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Image as ImageIcon, Wheat } from 'lucide-react';
import { UrduText } from '../components/UrduText';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { analyzeCropDisease } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Content = (reader.result as string).split(',')[1];
        const result = await analyzeCropDisease(base64Content, file.type);
        navigate('/result', { state: { result, imageUri: reader.result } });
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      alert(error.message || 'Error analyzing image');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerUpload = () => fileInputRef.current?.click();
  const triggerCamera = () => cameraInputRef.current?.click();

  return (
    <div className="flex flex-col h-full bg-brand-cream relative">
      <LoadingOverlay isVisible={isLoading} message={t('loading')} />
      
      {/* Hero Header */}
      <div className="h-[40vh] bg-brand-primary rounded-br-[64px] p-10 flex flex-col justify-end text-brand-cream relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent opacity-20 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
        
        <div className="z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-brand-accent rounded-2xl flex items-center justify-center text-3xl shadow-lg">
              🌾
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white">{t('appTitle')}</h1>
          </div>
          <UrduText className="text-2xl font-semibold opacity-90 !text-white">{t('appSubtitle')}</UrduText>
          <p className="text-sm opacity-70 mt-2 italic font-sans">{t('description')}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-10 flex flex-col gap-8">
        <div className="grid grid-cols-2 gap-6">
          <button 
            onClick={triggerCamera}
            className="h-48 bg-[var(--bg-card)] border-2 border-dashed border-brand-accent rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-brand-accent/5 transition-all active:scale-95 group shadow-sm"
          >
            <span className="text-5xl mb-3 group-hover:scale-110 transition-transform">📷</span>
            <UrduText className="font-bold text-lg leading-tight">{t('takePhoto')}</UrduText>
            <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-[0.2em] font-sans">Take Photo</span>
          </button>

          <button 
            onClick={triggerUpload}
            className="h-48 bg-[var(--bg-card)] border-2 border-dashed border-brand-accent rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-brand-accent/5 transition-all active:scale-95 group shadow-sm"
          >
            <span className="text-5xl mb-3 group-hover:scale-110 transition-transform">🖼</span>
            <UrduText className="font-bold text-lg leading-tight">{t('chooseGallery')}</UrduText>
            <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-[0.2em] font-sans">Gallery</span>
          </button>
        </div>
      </div>

      {/* Hidden Inputs */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      <input type="file" ref={cameraInputRef} onChange={handleFileChange} accept="image/*" capture="environment" className="hidden" />
    </div>
  );
};

export default HomeScreen;
