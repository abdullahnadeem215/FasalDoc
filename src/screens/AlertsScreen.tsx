import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  RefreshControl,
  SafeAreaView
} from 'react-native';
import { Bell, MapPin, RefreshCcw, ShieldAlert, CheckCircle2 } from 'lucide-react-native';
import { UrduText } from '../components/UrduText';
import { AlertCard } from '../components/AlertCard';
import { Alert as AlertType } from '../data/mockAlerts';
import { getAlertsForDistrict, getAlertHistory } from '../services/alertService';
import { getUserDistrict, UserLocation } from '../services/locationService';
import { runBackgroundAlertCheck } from '../services/backgroundTaskService';
import { getLanguage } from '../utils/storage';

const AlertsScreen = () => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [lang, setLang] = useState<'en' | 'ur'>('ur');

  const filters = [
    { id: 'all', ur: 'سب', en: 'All' },
    { id: 'pest', ur: 'کیڑے', en: 'Pests' },
    { id: 'disease', ur: 'بیماری', en: 'Diseases' },
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

      const severityMap: any = { Severe: 0, High: 1, Medium: 2, Low: 3 };
      combined.sort((a, b) => severityMap[a.severity] - severityMap[b.severity]);
      
      setAlerts(combined);
      const savedLang = await getLanguage();
      setLang(savedLang);
    } catch (error) {
      console.error("Failed to load alerts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const isUrdu = lang === 'ur';

  const filteredAlerts = activeFilter === 'all' 
    ? alerts 
    : alerts.filter(a => a.type === activeFilter);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <UrduText style={styles.headerTitle}>
            {isUrdu ? 'فصل الرٹ' : 'Crop Alerts'}
          </UrduText>
          {location && (
            <View style={styles.locationBadge}>
              <MapPin size={12} color="#1B4332" />
              <UrduText style={styles.locationText}>{location.district}</UrduText>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={() => loadData(true)}>
          <RefreshCcw size={24} color="#1B4332" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((f) => (
            <TouchableOpacity 
              key={f.id} 
              onPress={() => setActiveFilter(f.id)}
              style={[styles.filterChip, activeFilter === f.id && styles.activeChip]}
            >
              <UrduText style={[styles.filterText, activeFilter === f.id && styles.activeFilterText]}>
                {isUrdu ? f.ur : f.en}
              </UrduText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} />}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#1B4332" style={styles.loader} />
        ) : filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)
        ) : (
          <View style={styles.emptyState}>
            <CheckCircle2 color="#52B788" size={60} />
            <UrduText style={styles.emptyTitle}>{isUrdu ? 'کوئی الرٹ نہیں' : 'No Alerts'}</UrduText>
            <UrduText style={styles.emptyDesc}>
              {isUrdu ? 'آپ کا علاقہ فی الحال محفوظ ہے۔' : 'Your area is currently safe.'}
            </UrduText>
          </View>
        )}

        <View style={styles.infoCard}>
           <ShieldAlert color="white" size={40} style={styles.infoIcon} />
           <UrduText style={styles.infoTitle}>
             {isUrdu ? 'کسان الرٹ سسٹم' : 'Farmer Alert System'}
           </UrduText>
           <UrduText style={styles.infoDesc}>
             {isUrdu 
               ? 'یہ سسٹم خودکار طریقے سے آپ کے علاقے میں خطرات کی نشاندہی کرتا ہے۔' 
               : 'This system automatically identifies risks in your area.'}
           </UrduText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B4332',
    textAlign: 'left',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9F5EF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginTop: 5,
    gap: 5,
  },
  locationText: {
    fontSize: 10,
    color: '#1B4332',
    fontWeight: 'bold',
  },
  refreshBtn: {
    padding: 10,
  },
  filterBar: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 5,
  },
  activeChip: {
    backgroundColor: '#1B4332',
  },
  filterText: {
    fontSize: 13,
    color: '#666',
    fontWeight: 'bold',
  },
  activeFilterText: {
    color: 'white',
  },
  scrollContent: {
    padding: 15,
  },
  loader: {
    marginTop: 50,
  },
  emptyState: {
    alignItems: 'center',
    padding: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  infoCard: {
    backgroundColor: '#1B4332',
    padding: 25,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 40,
    overflow: 'hidden',
  },
  infoIcon: {
    position: 'absolute',
    right: -10,
    top: -10,
    opacity: 0.15,
  },
  infoTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'left',
  },
  infoDesc: {
    color: '#B7E4C7',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'left',
  },
});

export default AlertsScreen;
