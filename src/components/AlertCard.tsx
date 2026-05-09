import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ChevronDown, ChevronUp, Calendar, ExternalLink } from 'lucide-react-native';
import { UrduText } from './UrduText';
import { Alert } from '../data/mockAlerts';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AlertCardProps {
  alert: Alert;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isUrdu = true; // Defaulting to true for demo, should be from context

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const severityColors: any = {
    Severe: '#D00000',
    High: '#FB8500',
    Medium: '#FFB703',
    Low: '#52B788',
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pest': return '🐛';
      case 'disease': return '🦠';
      case 'weather': return '🌦️';
      default: return '⚠️';
    }
  };

  return (
    <View style={styles.card}>
      <View style={[styles.sideStrip, { backgroundColor: severityColors[alert.severity] }]} />
      
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.badgeRow}>
            <UrduText style={styles.typeIcon}>{getTypeIcon(alert.type)}</UrduText>
            <View style={[styles.badge, { backgroundColor: severityColors[alert.severity] }]}>
              <UrduText style={styles.badgeText}>{alert.severity}</UrduText>
            </View>
            <View style={styles.cropBadge}>
              <UrduText style={styles.cropBadgeText}>{alert.crop_ur}</UrduText>
            </View>
          </View>
          <View style={styles.dateRow}>
            <Calendar size={12} color="#AAA" />
            <UrduText style={styles.dateText}>{alert.valid_from}</UrduText>
          </View>
        </View>

        <UrduText style={styles.title}>{alert.title_ur}</UrduText>
        <UrduText style={styles.description} numberOfLines={isExpanded ? 0 : 2}>
          {alert.description_ur}
        </UrduText>

        {isExpanded && (
          <View style={styles.expandedSection}>
            <View style={styles.divider} />
            <UrduText style={styles.sectionTitle}>احتیاطی تدابیر:</UrduText>
            {alert.precautions_ur.map((p, i) => (
              <View key={i} style={styles.precautionItem}>
                <View style={styles.bullet}>
                  <UrduText style={styles.bulletText}>{i + 1}</UrduText>
                </View>
                <UrduText style={styles.precautionText}>{p}</UrduText>
              </View>
            ))}
            <View style={styles.footerRow}>
               <ExternalLink size={12} color="#AAA" />
               <UrduText style={styles.sourceText}>{alert.source}</UrduText>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.toggleBtn} onPress={toggleExpand}>
          <UrduText style={styles.toggleText}>
            {isExpanded ? 'کم معلومات' : 'احتیاطی تدابیر دیکھیں'}
          </UrduText>
          {isExpanded ? <ChevronUp size={16} color="#1B4332" /> : <ChevronDown size={16} color="#1B4332" />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sideStrip: {
    width: 6,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeIcon: {
    fontSize: 18,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cropBadge: {
    backgroundColor: '#E9F5EF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  cropBadgeText: {
    color: '#1B4332',
    fontSize: 10,
    fontWeight: 'bold',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 9,
    color: '#AAA',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 10,
  },
  expandedSection: {
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 10,
  },
  precautionItem: {
    flexDirection: 'row-reverse',
    gap: 12,
    marginBottom: 8,
  },
  bullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1B4332',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulletText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  precautionText: {
    flex: 1,
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 15,
    gap: 5,
  },
  sourceText: {
    fontSize: 9,
    color: '#BBB',
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 5,
    gap: 5,
  },
  toggleText: {
    color: '#1B4332',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
