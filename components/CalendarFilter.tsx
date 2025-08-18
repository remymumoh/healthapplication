import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Calendar, ChevronDown, X, Filter } from 'lucide-react-native';
import { useDateRange, DateRange } from '../contexts/DateRangeContext';

const quarterPresets: DateRange[] = [
  {
    startDate: new Date(2024, 0, 1), // January 1, 2024
    endDate: new Date(2024, 2, 31), // March 31, 2024
    label: 'Q1 2024'
  },
  {
    startDate: new Date(2024, 3, 1), // April 1, 2024
    endDate: new Date(2024, 5, 30), // June 30, 2024
    label: 'Q2 2024'
  },
  {
    startDate: new Date(2024, 6, 1), // July 1, 2024
    endDate: new Date(2024, 8, 30), // September 30, 2024
    label: 'Q3 2024'
  },
  {
    startDate: new Date(2024, 9, 1), // October 1, 2024
    endDate: new Date(2024, 11, 31), // December 31, 2024
    label: 'Q4 2024'
  },
  {
    startDate: new Date(2025, 0, 1), // January 1, 2025
    endDate: new Date(2025, 2, 31), // March 31, 2025
    label: 'Q1 2025'
  },
  {
    startDate: new Date(2025, 3, 1), // April 1, 2025
    endDate: new Date(2025, 5, 30), // June 30, 2025
    label: 'Q2 2025'
  },
  {
    startDate: new Date(2025, 6, 1), // July 1, 2025
    endDate: new Date(2025, 8, 30), // September 30, 2025
    label: 'Q3 2025'
  },
  {
    startDate: new Date(2025, 9, 1), // October 1, 2025
    endDate: new Date(2025, 11, 31), // December 31, 2025
    label: 'Q4 2025'
  }
];

const monthPresets: DateRange[] = [
  {
    startDate: new Date(2024, 0, 1), // January 2024
    endDate: new Date(2024, 0, 31),
    label: 'January 2024'
  },
  {
    startDate: new Date(2024, 1, 1), // February 2024
    endDate: new Date(2024, 1, 29),
    label: 'February 2024'
  },
  {
    startDate: new Date(2024, 2, 1), // March 2024
    endDate: new Date(2024, 2, 31),
    label: 'March 2024'
  },
  {
    startDate: new Date(2024, 3, 1), // April 2024
    endDate: new Date(2024, 3, 30),
    label: 'April 2024'
  },
  {
    startDate: new Date(2024, 4, 1), // May 2024
    endDate: new Date(2024, 4, 31),
    label: 'May 2024'
  },
  {
    startDate: new Date(2024, 5, 1), // June 2024
    endDate: new Date(2024, 5, 30),
    label: 'June 2024'
  },
  {
    startDate: new Date(2024, 6, 1), // July 2024
    endDate: new Date(2024, 6, 31),
    label: 'July 2024'
  },
  {
    startDate: new Date(2024, 7, 1), // August 2024
    endDate: new Date(2024, 7, 31),
    label: 'August 2024'
  },
  {
    startDate: new Date(2024, 8, 1), // September 2024
    endDate: new Date(2024, 8, 30),
    label: 'September 2024'
  },
  {
    startDate: new Date(2024, 9, 1), // October 2024
    endDate: new Date(2024, 9, 31),
    label: 'October 2024'
  },
  {
    startDate: new Date(2024, 10, 1), // November 2024
    endDate: new Date(2024, 10, 30),
    label: 'November 2024'
  },
  {
    startDate: new Date(2024, 11, 1), // December 2024
    endDate: new Date(2024, 11, 31),
    label: 'December 2024'
  },
  {
    startDate: new Date(2025, 0, 1), // January 2025
    endDate: new Date(2025, 0, 31),
    label: 'January 2025'
  },
  {
    startDate: new Date(2025, 1, 1), // February 2025
    endDate: new Date(2025, 1, 28),
    label: 'February 2025'
  },
  {
    startDate: new Date(2025, 2, 1), // March 2025
    endDate: new Date(2025, 2, 31),
    label: 'March 2025'
  },
  {
    startDate: new Date(2025, 3, 1), // April 2025
    endDate: new Date(2025, 3, 30),
    label: 'April 2025'
  },
  {
    startDate: new Date(2025, 4, 1), // May 2025
    endDate: new Date(2025, 4, 31),
    label: 'May 2025'
  },
  {
    startDate: new Date(2025, 5, 1), // June 2025
    endDate: new Date(2025, 5, 30),
    label: 'June 2025'
  }
];

export default function CalendarFilter() {
  const { selectedDateRange, setSelectedDateRange } = useDateRange();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'quarters' | 'months' | 'custom'>('months');

  const formatDateRange = (range: DateRange) => {
    return range.label;
  };

  const handlePresetSelect = (preset: DateRange) => {
    setSelectedDateRange(preset);
    setIsModalVisible(false);
  };

  const renderPresetButton = (preset: DateRange, isSelected: boolean) => (
    <TouchableOpacity
      key={preset.label}
      style={[
        styles.presetButton,
        isSelected && styles.selectedPresetButton
      ]}
      onPress={() => handlePresetSelect(preset)}
      activeOpacity={0.7}
    >
      <View style={styles.presetContent}>
        <Text style={[
          styles.presetLabel,
          isSelected && styles.selectedPresetLabel
        ]}>
          {preset.label}
        </Text>
        <Text style={[
          styles.presetDate,
          isSelected && styles.selectedPresetDate
        ]}>
          {preset.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {preset.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </Text>
      </View>
      {isSelected && (
        <View style={styles.selectedIndicator}>
          <View style={styles.selectedDot} />
        </View>
      )}
    </TouchableOpacity>
  );

  const isPresetSelected = (preset: DateRange) => {
    return preset.startDate.getTime() === selectedDateRange.startDate.getTime() &&
           preset.endDate.getTime() === selectedDateRange.endDate.getTime();
  };

  return (
    <>
      <TouchableOpacity
        style={styles.periodButton}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.8}
      >
        <View style={styles.periodButtonContent}>
          <Calendar size={18} color="#6b7280" />
          <View style={styles.periodTextContainer}>
            <Text style={styles.periodLabel}>Period</Text>
            <Text style={styles.periodValue}>{formatDateRange(selectedDateRange)}</Text>
          </View>
          <ChevronDown size={16} color="#9ca3af" />
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderContent}>
              <Filter size={24} color="#3b82f6" />
              <Text style={styles.modalTitle}>Select Date Range</Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.closeButton}
            >
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'quarters' && styles.activeTab]}
              onPress={() => setActiveTab('quarters')}
            >
              <Text style={[styles.tabText, activeTab === 'quarters' && styles.activeTabText]}>
                Quarters
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'months' && styles.activeTab]}
              onPress={() => setActiveTab('months')}
            >
              <Text style={[styles.tabText, activeTab === 'months' && styles.activeTabText]}>
                Months
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'custom' && styles.activeTab]}
              onPress={() => setActiveTab('custom')}
            >
              <Text style={[styles.tabText, activeTab === 'custom' && styles.activeTabText]}>
                Custom
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {activeTab === 'quarters' && (
              <View style={styles.presetsContainer}>
                <Text style={styles.sectionTitle}>Select Quarter</Text>
                {quarterPresets.map(preset => renderPresetButton(preset, isPresetSelected(preset)))}
              </View>
            )}

            {activeTab === 'months' && (
              <View style={styles.presetsContainer}>
                <Text style={styles.sectionTitle}>Select Month</Text>
                {monthPresets.map(preset => renderPresetButton(preset, isPresetSelected(preset)))}
              </View>
            )}

            {activeTab === 'custom' && (
              <View style={styles.customContainer}>
                <Text style={styles.sectionTitle}>Custom Date Range</Text>
                <View style={styles.customPlaceholder}>
                  <Calendar size={48} color="#d1d5db" />
                  <Text style={styles.customPlaceholderText}>
                    Custom date picker coming soon
                  </Text>
                  <Text style={styles.customPlaceholderSubtext}>
                    Use the preset options above for now
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  periodButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  periodButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  periodTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  periodLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginBottom: 1,
  },
  periodValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginLeft: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    margin: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#3b82f6',
  },
  modalContent: {
    flex: 1,
  },
  presetsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  presetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPresetButton: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  presetContent: {
    flex: 1,
  },
  presetLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  selectedPresetLabel: {
    color: '#3b82f6',
  },
  presetDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  selectedPresetDate: {
    color: '#1d4ed8',
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  customContainer: {
    padding: 20,
  },
  customPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  customPlaceholderText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  customPlaceholderSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    textAlign: 'center',
  },
});