import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { DashboardGrid } from './DashboardGrid';
import { County, Facility, DashboardCard, CategoryType, HTSData, CareAndTreatmentData } from '@/types';
import { dataService } from '@/services/dataService';

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
    const [cards, setCards] = useState<DashboardCard[]>([]);
    const [dataLoading, setDataLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setDataLoading(true);
            try {
                let newCards: DashboardCard[] = [];

                if (category === 'hts') {
                    const htsData = await dataService.getHTSData(selectedFacility || undefined);
                    newCards = dataService.convertHTSToCards(htsData);
                } else if (category === 'care-treatment') {
                    const careData = await dataService.getCareAndTreatmentData(selectedFacility || undefined);
                    newCards = dataService.convertCareAndTreatmentToCards(careData);
                } else if (category === 'dashboard') {
                    const dashboardData = await dataService.getDashboardData(selectedFacility || undefined);
                    newCards = dataService.convertDashboardToCards(dashboardData);
                }

                setCards(newCards);
            } catch (error) {
                console.error('Error fetching data:', error);
                setCards([]);
            } finally {
                setDataLoading(false);
            }
        };

        fetchData();
    }, [category, selectedCounty, selectedFacility]);

    if (loading || dataLoading) {
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
            <DashboardGrid cards={cards} loading={dataLoading} />
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