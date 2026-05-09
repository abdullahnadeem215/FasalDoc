import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Alert,
  Switch
} from 'react-native';
import { Key, Eye, EyeOff, Globe, Info, Trash, ChevronRight } from 'lucide-react-native';
import { UrduText } from '../components/UrduText';
import { getApiKey, saveApiKey, getLanguage, setLanguage, clearHistory } from '../utils/storage';

const SettingsScreen = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [lang, setLang] = useState<'en' | 'ur'>('ur');

  useEffect(() => {
    const loadSettings = async () => {
      const key = await getApiKey();
      if (key) setApiKey(key);
      const savedLang = await getLanguage();
      setLang(savedLang);
    };
    loadSettings();
  }, []);

  const isUrdu = lang === 'ur';

  const handleSaveKey = async () => {
    await saveApiKey(apiKey);
    Alert.alert(isUrdu ? 'کامیابی' : 'Success', isUrdu ? 'API کی محفوظ کر لی گئی ہے۔' : 'API Key saved successfully.');
  };

  const handleToggleLanguage = async () => {
    const newLang = lang === 'en' ? 'ur' : 'en';
    await setLanguage(newLang);
    setLang(newLang);
  };

  const handleClearHistory = () => {
    Alert.alert(
      isUrdu ? 'تاریخ صاف کریں' : 'Clear History',
      isUrdu ? 'کیا آپ تمام محفوظ کردہ اسکینز کو حذف کرنا چاہتے ہیں؟' : 'Are you sure you want to delete all saved scans?',
      [
        { text: isUrdu ? 'نہیں' : 'Cancel', style: 'cancel' },
        { 
          text: isUrdu ? 'ہاں' : 'Clear', 
          style: 'destructive',
          onPress: async () => {
            await clearHistory();
            Alert.alert(isUrdu ? 'صاف ہو گیا' : 'Cleared', isUrdu ? 'تاریخ صاف کر دی گئی ہے۔' : 'History cleared.');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <UrduText style={styles.title}>
          {isUrdu ? 'ترتیبات' : 'Settings'}
        </UrduText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <UrduText style={styles.sectionLabel}>{isUrdu ? 'API کی (Gemini)' : 'API Key (Gemini)'}</UrduText>
          <View style={styles.inputContainer}>
            <Key color="#1B4332" size={20} />
            <TextInput
              style={styles.input}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="Enter Gemini API Key"
              secureTextEntry={!showKey}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowKey(!showKey)}>
              {showKey ? <EyeOff color="#666" size={20} /> : <Eye color="#666" size={20} />}
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveKey}>
            <UrduText style={styles.saveButtonText}>{isUrdu ? 'محفوظ کریں' : 'Save Key'}</UrduText>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <UrduText style={styles.sectionLabel}>{isUrdu ? 'ایپ سیٹنگز' : 'App Settings'}</UrduText>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Globe color="#1B4332" size={20} />
              <UrduText style={styles.settingText}>{isUrdu ? 'زبان (اردو)' : 'Language (Urdu)'}</UrduText>
            </View>
            <Switch 
              value={lang === 'ur'} 
              onValueChange={handleToggleLanguage}
              trackColor={{ false: "#767577", true: "#52B788" }}
              thumbColor={lang === 'ur' ? "#1B4332" : "#f4f3f4"}
            />
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={handleClearHistory}>
            <View style={styles.settingLabelContainer}>
              <Trash color="#D00000" size={20} />
              <UrduText style={[styles.settingText, { color: '#D00000' }]}>{isUrdu ? 'تاریخ صاف کریں' : 'Clear History'}</UrduText>
            </View>
            <ChevronRight color="#CCC" size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <UrduText style={styles.sectionLabel}>{isUrdu ? 'معلومات' : 'Information'}</UrduText>
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Info color="#1B4332" size={20} />
              <UrduText style={styles.settingText}>{isUrdu ? 'ورژن' : 'Version'}</UrduText>
            </View>
            <UrduText style={styles.settingValue}>1.0.0</UrduText>
          </View>
        </View>

        <View style={styles.footer}>
          <UrduText style={styles.footerText}>
            {isUrdu ? 'پاکستانی کسانوں کے لیے محبت کے ساتھ بنایا گیا' : 'Made with love for Pakistani farmers'}
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
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    height: 55,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#1B4332',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
    color: '#888',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#AAA',
    textAlign: 'center',
  },
});

export default SettingsScreen;
