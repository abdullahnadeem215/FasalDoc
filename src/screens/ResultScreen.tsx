import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  LayoutAnimation, 
  Platform, 
  UIManager,
  SafeAreaView
} from 'react-native';
import { ChevronDown, ChevronUp, Save, Camera, ShieldCheck, AlertTriangle, Info } from 'lucide-react-native';
import { UrduText } from '../components/UrduText';
import { saveScan, getLanguage } from '../utils/storage';
import { DiseaseResult } from '../types';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

const ResultScreen = ({ route, navigation }: any) => {
  const { result, imageUri, isFresh } = route.params as { result: DiseaseResult; imageUri: string; isFresh?: boolean };
  const [expandedSection, setExpandedSection] = useState<string | null>('symptoms');
  const [isSaved, setIsSaved] = useState(!isFresh);
  const [lang, setLang] = useState<'en' | 'ur'>('ur');

  useEffect(() => {
    const loadLang = async () => {
      const savedLang = await getLanguage();
      setLang(savedLang);
    };
    loadLang();
  }, []);

  const isUrdu = lang === 'ur';

  const toggleSection = (section: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSave = async () => {
    if (isSaved) return;
    const scan = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      imageUri,
      result
    };
    await saveScan(scan);
    setIsSaved(true);
  };

  const severityData = {
    Low: { color: '#52B788', icon: <ShieldCheck color="white" size={16} /> },
    Medium: { color: '#FFB703', icon: <Info color="white" size={16} /> },
    High: { color: '#FB8500', icon: <AlertTriangle color="white" size={16} /> },
    Severe: { color: '#D00000', icon: <AlertTriangle color="white" size={16} /> },
  };

  const sections = [
    { id: 'symptoms', en: 'Symptoms', ur: 'علامات', contentEn: result.symptoms_en, contentUr: result.symptoms_ur },
    { id: 'treatment', en: 'Treatment', ur: 'علاج', contentEn: result.treatment_en, contentUr: result.treatment_ur },
    { id: 'prevention', en: 'Prevention', ur: 'بچاؤ', contentEn: result.prevention_en, contentUr: result.prevention_ur },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.mainImage} />
          <View style={[styles.severityBadge, { backgroundColor: severityData[result.severity].color }]}>
            {severityData[result.severity].icon}
            <UrduText style={styles.severityText}>{result.severity}</UrduText>
          </View>
        </View>

        <View style={styles.contentCard}>
          <View style={styles.headerRow}>
            <View flex={1}>
              <UrduText style={styles.diseaseName}>
                {isUrdu ? result.diseaseName_ur : result.diseaseName_en}
              </UrduText>
              <UrduText style={styles.confidenceText}>
                {isUrdu ? `${Math.round(result.confidence * 100)}% درستگی` : `${Math.round(result.confidence * 100)}% Confidence`}
              </UrduText>
            </View>
            <TouchableOpacity 
              style={[styles.saveButton, isSaved && styles.savedButton]} 
              onPress={handleSave}
              disabled={isSaved}
            >
              <Save color={isSaved ? '#1B4332' : 'white'} size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {sections.map((section) => (
            <View key={section.id} style={styles.sectionContainer}>
              <TouchableOpacity 
                style={styles.sectionHeader} 
                onPress={() => toggleSection(section.id)}
              >
                <UrduText style={styles.sectionTitle}>
                  {isUrdu ? section.ur : section.en}
                </UrduText>
                {expandedSection === section.id ? <ChevronUp color="#1B4332" /> : <ChevronDown color="#1B4332" />}
              </TouchableOpacity>
              {expandedSection === section.id && (
                <View style={styles.sectionBody}>
                  <UrduText style={styles.sectionContent}>
                    {isUrdu ? section.contentUr : section.contentEn}
                  </UrduText>
                </View>
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => navigation.navigate('HomeStack')}
        >
          <Camera color="white" size={24} />
          <UrduText style={styles.footerButtonText}>
            {isUrdu ? 'دوبارہ اسکین کریں' : 'Scan Again'}
          </UrduText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#ddd',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  severityBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  severityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 25,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  diseaseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B4332',
    textAlign: 'left',
  },
  confidenceText: {
    fontSize: 14,
    color: '#52B788',
    marginTop: 2,
    textAlign: 'left',
  },
  saveButton: {
    backgroundColor: '#1B4332',
    padding: 12,
    borderRadius: 15,
  },
  savedButton: {
    backgroundColor: '#E9F5EF',
    borderWidth: 1,
    borderColor: '#1B4332',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 10,
  },
  sectionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
  },
  sectionBody: {
    paddingBottom: 15,
  },
  sectionContent: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    textAlign: 'left',
  },
  footerButton: {
    backgroundColor: '#1B4332',
    height: 60,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 10,
  },
  footerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ResultScreen;
