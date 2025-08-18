import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Activity, CircleAlert as AlertCircle, TrendingUp, Target, Users, UserPlus, Heart, Shield, Clock, TriangleAlert as AlertTriangle, TrendingDown, Minus } from 'lucide-react-native';
import { DashboardCard as DashboardCardType } from '@/types';

const iconMap = {
  Activity,
  AlertCircle,
  TrendingUp,
  Target,
  Users,
  UserPlus,
  Heart,
  Shield,
  Clock,
  AlertTriangle,
};

interface Props {
  card: DashboardCardType;
}

export function DashboardCard({ card }: Props) {
  const IconComponent = iconMap[card.icon as keyof typeof iconMap] || Activity;
  
  const getChangeIcon = () => {
    if (card.changeType === 'increase') return TrendingUp;
    if (card.changeType === 'decrease') return TrendingDown;
    return Minus;
  };

  const getChangeColor = () => {
    if (card.changeType === 'increase') return '#10b981';
    if (card.changeType === 'decrease') return '#ef4444';
    return '#6b7280';
  };

  const ChangeIcon = getChangeIcon();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <IconComponent size={24} color="#3b82f6" />
        </View>
        <Text style={styles.title}>{card.title}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.value}>{card.value}</Text>
        <View style={styles.changeContainer}>
          <ChangeIcon size={16} color={getChangeColor()} />
          <Text style={[styles.change, { color: getChangeColor() }]}>
            {Math.abs(card.change)}%
          </Text>
        </View>
      </View>
      
      <Text style={styles.description}>{card.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  change: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  description: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    lineHeight: 16,
  },
});
