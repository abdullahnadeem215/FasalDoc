import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  Alert
} from 'react-native';
import { Trash2, History, ChevronRight } from 'lucide-react-native';
import { UrduText } from '../components/UrduText';
import { getScans, deleteScan, getLanguage } from '../utils/storage';
import { ScanRecord } from '../types';

const HistoryScreen = ({ navigation }: any) => {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [lang, setLang] = useState<'en' | 'ur'>('ur');

  const loadData = async () => {
    const data = await getScans();
    setScans(data);
    const savedLang = await getLanguage();
    setLang(savedLang);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const isUrdu = lang === 'ur';

  const handleDelete = (id: string) => {
    Alert.alert(
      isUrdu ? 'حذف کریں' : 'Delete',
      isUrdu ? 'کیا آپ اس اسکین کو حذف کرنا چاہتے ہیں؟' : 'Are you sure you want to delete this scan?',
      [
        { text: isUrdu ? 'نہیں' : 'Cancel', style: 'cancel' },
        { 
          text: isUrdu ? 'ہاں' : 'Delete', 
          style: 'destructive',
          onPress: async () => {
            await deleteScan(id);
            loadData();
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: ScanRecord }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('Home', { screen: 'Result', params: { result: item.result, imageUri: item.imageUri, isFresh: false } })}
    >
      <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
      <View style={styles.cardContent}>
        <UrduText style={styles.cardDate}>{item.date}</UrduText>
        <UrduText style={styles.cardTitle}>
          {isUrdu ? item.result.diseaseName_ur : item.result.diseaseName_en}
        </UrduText>
        <View style={styles.severityTag}>
           <View style={[styles.dot, { backgroundColor: item.result.severity === 'Low' ? '#52B788' : '#D00000' }]} />
           <UrduText style={styles.severityText}>{item.result.severity}</UrduText>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
        <Trash2 color="#D00000" size={20} />
      </TouchableOpacity>
      <ChevronRight color="#CCC" size={20} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <UrduText style={styles.title}>
          {isUrdu ? 'تاریخ' : 'History'}
        </UrduText>
      </View>

      {scans.length > 0 ? (
        <FlatList
          data={scans}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <History color="#CCC" size={80} strokeWidth={1} />
          <UrduText style={styles.emptyText}>
            {isUrdu ? 'ابھی تک کوئی اسکین نہیں کیا گیا۔' : 'No scans saved yet.'}
          </UrduText>
          <TouchableOpacity 
            style={styles.scanNowButton}
            onPress={() => navigation.navigate('Home')}
          >
            <UrduText style={styles.scanNowText}>
              {isUrdu ? 'ابھی اسکین کریں' : 'Scan Now'}
            </UrduText>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B4332',
    textAlign: 'left',
  },
  listContent: {
    padding: 15,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#EEE',
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
  },
  cardDate: {
    fontSize: 10,
    color: '#AAA',
    marginBottom: 2,
    textAlign: 'left',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
  },
  severityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  severityText: {
    fontSize: 10,
    color: '#666',
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 10,
    marginRight: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  scanNowButton: {
    marginTop: 25,
    backgroundColor: '#1B4332',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
  },
  scanNowText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HistoryScreen;
