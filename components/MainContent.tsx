import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { DashboardGrid } from './DashboardGrid';
import { DemographicChart } from './DemographicChart';
import { County, Facility, DashboardCard, CategoryType, DemographicData } from '@/types';

interface Props {
    category: CategoryType;
    selectedCounty: string | null;
    selectedFacility: string | null;
    counties: County[];
    facilities: Facility[];
    dashboardCards: DashboardCard[];
    loading: boolean;
    demographicData: DemographicData | null;
    selectedFacilityName?: string;
}

export function MainContent({
                                category,
                                selectedCounty,
                                selectedFacility,
                                counties,
                                facilities,
                                dashboardCards,
                                loading,
                                demographicData,
                                selectedFacilityName
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

    // Show demographic chart when facility is selected and we have demographic data
    if (selectedFacility && demographicData && category === 'hts' && selectedFacilityName) {
        return (
            <View style={styles.container}>
                <DemographicChart 
                    data={demographicData} 
                    facilityName={selectedFacilityName}
                />
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