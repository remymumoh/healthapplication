import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Activity, Heart } from 'lucide-react-native';
import { CategoryType } from '@/types';

interface Props {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

export function CategorySelector({ selectedCategory, onSelectCategory }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, selectedCategory === 'hts' && styles.selectedButton]}
        onPress={() => onSelectCategory('hts')}
      >
        <Activity 
          size={20} 
          color={selectedCategory === 'hts' ? '#ffffff' : '#6b7280'} 
        />
        <Text style={[styles.buttonText, selectedCategory === 'hts' && styles.selectedButtonText]}>
          HTS (HIV Testing Services)
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, selectedCategory === 'care-treatment' && styles.selectedButton]}
        onPress={() => onSelectCategory('care-treatment')}
      >
        <Heart 
          size={20} 
          color={selectedCategory === 'care-treatment' ? '#ffffff' : '#6b7280'} 
        />
        <Text style={[styles.buttonText, selectedCategory === 'care-treatment' && styles.selectedButtonText]}>
          Care & Treatment
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  selectedButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginLeft: 8,
  },
  selectedButtonText: {
    color: '#ffffff',
  },
});
