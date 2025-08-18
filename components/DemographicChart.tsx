import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Users, User, Activity } from 'lucide-react-native';
import { DemographicData } from '@/types';

interface Props {
  data: DemographicData;
  facilityName: string;
}

export function DemographicChart({ data, facilityName }: Props) {
  const getBarWidth = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.max((value / total) * 100, 2); // Minimum 2% for visibility
  };

  const formatAgeGroup = (ageGroup: string) => {
    if (ageGroup === '<1') return 'Under 1';
    if (ageGroup === '65-300') return '65+';
    return ageGroup;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Activity size={24} color="#3b82f6" />
        <View style={styles.headerText}>
          <Text style={styles.title}>HTS Testing Demographics</Text>
          <Text style={styles.subtitle}>{facilityName}</Text>
        </View>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Users size={20} color="#3b82f6" />
          <Text style={styles.summaryValue}>{data.totalTests}</Text>
          <Text style={styles.summaryLabel}>Total Tests</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <User size={20} color="#10b981" />
          <Text style={styles.summaryValue}>{data.totalFemale}</Text>
          <Text style={styles.summaryLabel}>Female</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <User size={20} color="#6366f1" />
          <Text style={styles.summaryValue}>{data.totalMale}</Text>
          <Text style={styles.summaryLabel}>Male</Text>
        </View>
      </View>

      {/* Age Group Breakdown */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Testing by Age Group</Text>
        
        {data.ageGroups
          .filter(group => group.total > 0)
          .map((group, index) => (
            <View key={group.ageGroup} style={styles.ageGroupRow}>
              <View style={styles.ageGroupHeader}>
                <Text style={styles.ageGroupLabel}>{formatAgeGroup(group.ageGroup)}</Text>
                <Text style={styles.ageGroupTotal}>{group.total}</Text>
              </View>
              
              <View style={styles.barContainer}>
                {/* Female bar */}
                <View style={styles.barRow}>
                  <Text style={styles.genderLabel}>F</Text>
                  <View style={styles.barTrack}>
                    <View 
                      style={[
                        styles.bar, 
                        styles.femaleBar,
                        { width: `${getBarWidth(group.female, data.totalTests)}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.valueLabel}>{group.female}</Text>
                </View>
                
                {/* Male bar */}
                <View style={styles.barRow}>
                  <Text style={styles.genderLabel}>M</Text>
                  <View style={styles.barTrack}>
                    <View 
                      style={[
                        styles.bar, 
                        styles.maleBar,
                        { width: `${getBarWidth(group.male, data.totalTests)}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.valueLabel}>{group.male}</Text>
                </View>
              </View>
            </View>
          ))}
      </View>

      {/* Gender Distribution */}
      <View style={styles.distributionContainer}>
        <Text style={styles.chartTitle}>Gender Distribution</Text>
        <View style={styles.distributionBar}>
          <View 
            style={[
              styles.distributionSegment, 
              styles.femaleSegment,
              { width: `${getBarWidth(data.totalFemale, data.totalTests)}%` }
            ]}
          />
          <View 
            style={[
              styles.distributionSegment, 
              styles.maleSegment,
              { width: `${getBarWidth(data.totalMale, data.totalTests)}%` }
            ]}
          />
        </View>
        <View style={styles.distributionLabels}>
          <View style={styles.distributionLabel}>
            <View style={[styles.legendDot, styles.femaleDot]} />
            <Text style={styles.legendText}>
              Female: {data.totalFemale} ({data.totalTests > 0 ? Math.round((data.totalFemale / data.totalTests) * 100) : 0}%)
            </Text>
          </View>
          <View style={styles.distributionLabel}>
            <View style={[styles.legendDot, styles.maleDot]} />
            <Text style={styles.legendText}>
              Male: {data.totalMale} ({data.totalTests > 0 ? Math.round((data.totalMale / data.totalTests) * 100) : 0}%)
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  ageGroupRow: {
    marginBottom: 16,
  },
  ageGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ageGroupLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  ageGroupTotal: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  barContainer: {
    gap: 4,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  genderLabel: {
    width: 12,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  barTrack: {
    flex: 1,
    height: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 8,
    minWidth: 2,
  },
  femaleBar: {
    backgroundColor: '#10b981',
  },
  maleBar: {
    backgroundColor: '#6366f1',
  },
  valueLabel: {
    width: 30,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    textAlign: 'right',
  },
  distributionContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  distributionBar: {
    flexDirection: 'row',
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    marginBottom: 12,
  },
  distributionSegment: {
    height: '100%',
  },
  femaleSegment: {
    backgroundColor: '#10b981',
  },
  maleSegment: {
    backgroundColor: '#6366f1',
  },
  distributionLabels: {
    gap: 8,
  },
  distributionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  femaleDot: {
    backgroundColor: '#10b981',
  },
  maleDot: {
    backgroundColor: '#6366f1',
  },
  legendText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
});