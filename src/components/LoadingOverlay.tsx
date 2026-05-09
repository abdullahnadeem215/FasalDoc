import React from 'react';
import { View, StyleSheet, Modal, ActivityIndicator, Text } from 'react-native';
import { UrduText } from './UrduText';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  isUrdu?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible, message, isUrdu = true }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.container}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color="#1B4332" />
          <UrduText style={styles.text}>
            {message || (isUrdu ? 'تجزیہ کیا جا رہا ہے...' : 'Analyzing...')}
          </UrduText>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    marginTop: 15,
    color: '#1B4332',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
