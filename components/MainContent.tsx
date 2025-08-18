import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { DashboardGrid } from './DashboardGrid';
import { County, Facility, DashboardCard, CategoryType } from '@/types';

interface Props {
    category: CategoryType;
    selectedCounty: string | null;
    selectedFacility: string | null;
    counties: County[];
    facilities: Facility[];
    dashboardCards: DashboardCard[];
    loading: boolean;
}

export function MainContent({
                                category,
                                selectedCounty,
                                selectedFacility,
                                counties,
                                facilities,
                                dashboardCards,
                                loading
                            }: Props) {
    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text style={styles.loadingText}>Loading data...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <DashboardGrid cards={dashboardCards} loading={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: '#6b7280',
    },
});