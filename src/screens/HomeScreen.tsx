import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Alert,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { Camera, Image as ImageIcon, Info } from 'lucide-react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { UrduText } from '../components/UrduText';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { analyzeCropDisease } from '../services/geminiService';
import { getLanguage } from '../utils/storage';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<'en' | 'ur'>('ur');

  useEffect(() => {
    const loadSettings = async () => {
      const savedLang = await getLanguage();
      setLang(savedLang);
    };
    loadSettings();
    const unsubscribe = navigation.addListener('focus', loadSettings);
    return unsubscribe;
  }, [navigation]);

  const isUrdu = lang === 'ur';

  const handleImagePicker = async (type: 'camera' | 'library') => {
    const options: any = {
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.7,
    };

    const result = type === 'camera' 
      ? await launchCamera(options) 
      : await launchImageLibrary(options);

    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Failed to pick image');
      return;
    }

    if (result.assets && result.assets[0].base64) {
      processImage(result.assets[0].base64, result.assets[0].uri!);
    }
  };

  const processImage = async (base64: string, uri: string) => {
    setLoading(true);
    try {
      const result = await analyzeCropDisease(base64);
      navigation.navigate('Result', { result, imageUri: uri, isFresh: true });
    } catch (error: any) {
      Alert.alert('Analysis Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const crops = [
    { name: 'Wheat', ur: 'گندم', icon: '🌾' },
    { name: 'Cotton', ur: 'کپاس', icon: '☁️' },
    { name: 'Rice', ur: 'چاول', icon: '🍚' },
    { name: 'Sugarcane', ur: 'گنا', icon: '🎋' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <UrduText style={styles.title}>
            {isUrdu ? 'فصل ڈاکٹر' : 'Fasal Doc'}
          </UrduText>
          <UrduText style={styles.subtitle}>
            {isUrdu ? 'اپنی فصلوں کی حفاظت کریں' : 'Protect your crops with AI'}
          </UrduText>
        </View>

        <View style={styles.mainCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1590682222485-3fd217b8ad15?auto=format&fit=crop&q=80&w=800' }} 
            style={styles.heroImage}
          />
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => handleImagePicker('camera')}
            >
              <Camera color="white" size={24} />
              <UrduText style={styles.buttonText}>
                {isUrdu ? 'تصویر لیں' : 'Take Photo'}
              </UrduText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => handleImagePicker('library')}
            >
              <ImageIcon color="#1B4332" size={24} />
              <UrduText style={styles.secondaryButtonText}>
                {isUrdu ? 'گیلری سے منتخب کریں' : 'Pick from Gallery'}
              </UrduText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <UrduText style={styles.sectionTitle}>
            {isUrdu ? 'مشہور فصلیں' : 'Common Crops'}
          </UrduText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {crops.map((crop, idx) => (
              <View key={idx} style={styles.cropChip}>
                <UrduText style={styles.chipText}>
                  {crop.icon} {isUrdu ? crop.ur : crop.name}
                </UrduText>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.infoCard}>
          <Info color="#2D6A4F" size={20} />
          <UrduText style={styles.infoText}>
            {isUrdu 
              ? 'بہترین نتائج کے لیے تصویر صاف اور دن کی روشنی میں لیں۔' 
              : 'For best results, take a clear photo in natural daylight.'}
          </UrduText>
        </View>
      </ScrollView>

      <LoadingOverlay visible={loading} isUrdu={isUrdu} />
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
  },
  header: {
    marginBottom: 25,
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1B4332',
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    color: '#52B788',
    marginTop: -5,
    textAlign: 'left',
  },
  mainCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 25,
  },
  heroImage: {
    width: '100%',
    height: 200,
  },
  actionContainer: {
    padding: 20,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#1B4332',
    height: 60,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#E9F5EF',
    height: 60,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#B7E4C7',
  },
  secondaryButtonText: {
    color: '#1B4332',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'left',
  },
  chipScroll: {
    flexDirection: 'row',
  },
  cropChip: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  chipText: {
    fontSize: 14,
    color: '#555',
    fontWeight: 'bold',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#D8F3DC',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    flex: 1,
    color: '#2D6A4F',
    fontSize: 13,
    textAlign: 'left',
  },
});

export default HomeScreen;
