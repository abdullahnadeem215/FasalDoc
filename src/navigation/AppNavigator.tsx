import React from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Home, History, Settings, Bell } from 'lucide-react';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import AlertsScreen from '../screens/AlertsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ResultScreen from '../screens/ResultScreen';
import { UrduText } from '../components/UrduText';
import { useLanguage } from '../contexts/LanguageContext';

const AppNavigator: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: t('home'), icon: Home, path: '/', ur: t('home') },
    { label: t('alerts'), icon: Bell, path: '/alerts', ur: t('alerts') },
    { label: t('history'), icon: History, path: '/history', ur: t('history') },
    { label: t('settings'), icon: Settings, path: '/settings', ur: t('settings') },
  ];

  const isTabVisible = ['/', '/alerts', '/history', '/settings'].includes(location.pathname);

  return (
    <div className="relative min-h-screen pb-24 md:pb-0 md:max-w-md md:mx-auto md:bg-[var(--bg-card)] md:shadow-2xl overflow-hidden flex flex-col bg-brand-cream">
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location}>
            <Route path="/" element={<PageWrapper key="home"><HomeScreen /></PageWrapper>} />
            <Route path="/alerts" element={<PageWrapper key="alerts"><AlertsScreen /></PageWrapper>} />
            <Route path="/history" element={<PageWrapper key="history"><HistoryScreen /></PageWrapper>} />
            <Route path="/settings" element={<PageWrapper key="settings"><SettingsScreen /></PageWrapper>} />
            <Route path="/result" element={<PageWrapper key="result"><ResultScreen /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </div>

      {isTabVisible && (
        <div className="fixed bottom-0 left-0 right-0 md:absolute bg-brand-primary text-brand-cream px-6 py-4 flex justify-around items-center border-t border-brand-accent/20 z-50 rounded-t-[32px]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1 group relative outline-none"
              >
                <div className={`p-2 rounded-2xl transition-all duration-300 ${
                  isActive ? 'bg-brand-accent text-brand-background' : 'text-brand-cream/40 group-hover:text-brand-cream/70'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <UrduText className={`text-[10px] leading-tight m-0 !text-inherit transition-opacity duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}>
                  {item.ur}
                </UrduText>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute -top-1 w-1 h-1 bg-brand-accent rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
};

export default AppNavigator;
