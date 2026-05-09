import React from 'react';
import { Text, TextProps, StyleSheet, Platform } from 'react-native';

interface UrduTextProps extends TextProps {
  children: React.ReactNode;
}

export const UrduText: React.FC<UrduTextProps> = ({ children, style, ...props }) => {
  return (
    <Text 
      {...props} 
      style={[
        styles.urduText, 
        style
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  urduText: {
    fontFamily: Platform.OS === 'ios' ? 'Jameel Noori Nastaleeq' : 'sans-serif', // Fallback for native
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
