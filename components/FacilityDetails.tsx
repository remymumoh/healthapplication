import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Facility, County } from '@/types';

interface Props {
    facility: Facility;
    county: County;
}

export default function FacilityDetails({ facility, county }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{facility.name}</Text>
            <Text style={styles.subtitle}>{county.name} County</Text>
            <Text style={styles.type}>{facility.type}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontFamily: 'Inter-Bold',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: '#6b7280',
        marginBottom: 4,
    },
    type: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: '#9ca3af',
    },
});