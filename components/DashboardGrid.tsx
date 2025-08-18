import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { DashboardCard } from './DashboardCard';
import { DashboardCard as DashboardCardType } from '@/types';

interface Props {
  cards: DashboardCardType[];
  loading: boolean;
}

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768;

export function DashboardGrid({ cards, loading }: Props) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {Array.from({ length: 6 }).map((_, index) => (
          <View key={index} style={styles.loadingCard} />
        ))}
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.grid}>
        {cards.map((card) => (
          <View key={card.id} style={[styles.cardContainer, isLargeScreen && styles.cardContainerLarge]}>
            <DashboardCard card={card} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  cardContainer: {
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  cardContainerLarge: {
    width: '50%',
  },
  loadingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    marginHorizontal: -8,
  },
  loadingCard: {
    width: isLargeScreen ? '50%' : '100%',
    height: 140,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    marginHorizontal: 8,
    marginBottom: 16,
  },
});
