import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CalendarFilter() {
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Date Range Filter</Text>
    <Text style={styles.subtitle}>Current Month</Text>
    </View>
);
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    title: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: '#111827',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: '#6b7280',
    },
});