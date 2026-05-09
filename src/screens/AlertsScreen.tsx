import React, { useState, useEffect } from 'react';
import { Bell, MapPin, RefreshCcw, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { UrduText } from '../components/UrduText';
import { AlertCard } from '../components/AlertCard';
import { Alert } from '../data/mockAlerts';
import { getAlertsForDistrict, getAlertHistory } from '../services/alertService';
import { getUserDistrict, UserLocation } from '../services/locationService';
import { runBackgroundAlertCheck } from '../services/backgroundTaskService';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';

const AlertsScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filters = [
    { id: 'all', ur: 'سب', en: 'All' },
    { id: 'pest', ur: 'کیڑے', en: 'Pests' },
    { id: 'disease', ur: 'بیماری', en: 'Diseases' },
    { id: 'climate_migration', ur: 'ہجرت', en: 'Migration' },
    { id: 'weather', ur: 'موسم', en: 'Weather' },
  ];

  const loadData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      if (isManual) {
        await runBackgroundAlertCheck();
      }
      
      const loc = await getUserDistrict();
      setLocation(loc);
      
      const activeAlerts = await getAlertsForDistrict(loc.district);
      const historyAlerts = await getAlertHistory();
      
      const combined = [...activeAlerts];
      historyAlerts.forEach(h => {
        if (!combined.find(a => a.id === h.id)) {
          combined.push(h);
        }
      });

      const severityMap = { Severe: 0, High: 1, Medium: 2, Low: 3 };
      combined.sort((a, b) => severityMap[a.severity] - severityMap[b.severity]);
      
      setAlerts(combined);
      applyFilter(combined, activeFilter);
    } catch (error) {
      console.error("Failed to load alerts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilter = (data: Alert[], filterId: string) => {
    if (filterId === 'all') {
      setFilteredAlerts(data);
    } else if (filterId === 'disease') {
      // Small logic tweak to include both 'disease' and sometimes 'pest' if relevant
      setFilteredAlerts(data.filter(a => a.type === 'disease'));
    } else {
      setFilteredAlerts(data.filter(a => a.type === filterId));
    }
  };

  useEffect(() => {
    applyFilter(alerts, activeFilter);
  }, [activeFilter, alerts]);

  useEffect(() => {
    loadData();
  }, []);

  const isUrdu = language === 'ur';

  return (
    <div className="p-6 pb-24 min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <UrduText className="text-3xl font-bold text-brand-primary m-0">
            {isUrdu ? 'فصل الرٹ' : 'Crop Alerts'}
          </UrduText>
          {location && (
            <div className="flex items-center gap-1 mt-1 px-3 py-1 bg-brand-primary/10 rounded-full w-fit">
              <MapPin className="w-3 h-3 text-brand-primary" />
              <UrduText className="text-[10px] font-bold text-brand-primary leading-tight">
                {location.district}
              </UrduText>
            </div>
          )}
        </div>
        <button 
          onClick={() => loadData(true)}
          disabled={refreshing}
          className={cn(
            "p-3 bg-white rounded-2xl shadow-sm text-brand-primary active:scale-95 transition-all",
            refreshing && "animate-spin"
          )}
        >
          <RefreshCcw className="w-6 h-6" />
        </button>
      </header>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "px-4 py-2 rounded-xl whitespace-nowrap text-xs font-bold transition-all active:scale-95",
              activeFilter === filter.id 
                ? "bg-brand-primary text-white shadow-md" 
                : "bg-white text-brand-primary border border-brand-primary/10"
            )}
          >
            <UrduText className="m-0 !text-inherit">
              {isUrdu ? filter.ur : filter.en}
            </UrduText>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4" />
          <UrduText>لوڈنگ ہو رہی ہے...</UrduText>
        </div>
      ) : filteredAlerts.length > 0 ? (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-success" />
          </div>
          <UrduText className="text-2xl font-bold text-gray-800 mb-2">
            {isUrdu ? 'کوئی الرٹ نہیں' : 'No Alerts'}
          </UrduText>
          <UrduText className="text-gray-500 max-w-[200px]">
            {isUrdu 
              ? (activeFilter === 'all' 
                  ? 'آپ کے علاقے میں فی الحال کوئی بیماری یا کیڑوں کا خطرہ نہیں ہے۔' 
                  : `آپ کے علاقے میں فی الحال کوئی ${filters.find(f => f.id === activeFilter)?.ur} الرٹ نہیں ہے۔`)
              : (activeFilter === 'all'
                  ? 'Your area is currently safe from major pests and diseases.'
                  : `No ${filters.find(f => f.id === activeFilter)?.en} alerts in your area.`)}
          </UrduText>
        </motion.div>
      )}

      {/* Info Card */}
      <section className="premium-card bg-brand-primary p-6 mt-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <ShieldAlert className="w-20 h-20 text-white" />
        </div>
        <UrduText className="text-white text-lg font-bold mb-2">
          {isUrdu ? 'کسان الرٹ سسٹم' : 'Farmer Alert System'}
        </UrduText>
        <UrduText className="text-white/80 text-sm leading-relaxed">
          {isUrdu 
            ? 'یہ سسٹم خودکار طریقے سے آپ کے علاقے میں کیڑوں اور بیماریوں کی نشاندہی کرتا ہے۔ الرٹ ملنے پر فوری کارروائی کریں۔'
            : 'This system automatically detects pests and diseases in your area. Please take immediate action when alerted.'}
        </UrduText>
      </section>
    </div>
  );
};

export default AlertsScreen;
