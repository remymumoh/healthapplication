import { useState, useEffect } from 'react';
import { County, Facility, DashboardCard, CategoryType, FilterState } from '@/types';
import { dataService } from '@/services/dataService';

interface DataStoreState {
    counties: County[];
    facilities: Facility[];
    dashboardCards: DashboardCard[];
    loading: boolean;
    filterState: FilterState;
}

export function useDataStore() {
    const [state, setState] = useState<DataStoreState>({
        counties: [],
        facilities: [],
        dashboardCards: [],
        loading: true,
        filterState: {
            selectedCounty: null,
            selectedFacility: null,
            category: 'dashboard'
        }
    });

    // Load initial data
    useEffect(() => {
        const loadInitialData = async () => {
            setState(prev => ({ ...prev, loading: true }));
            try {
                const counties = await dataService.getCounties();
                setState(prev => ({
                    ...prev,
                    counties,
                    loading: false
                }));
            } catch (error) {
                console.error('Error loading initial data:', error);
                setState(prev => ({ ...prev, loading: false }));
            }
        };

        loadInitialData();
    }, []);

    // Load facilities when county changes
    useEffect(() => {
        const loadFacilities = async () => {
            if (state.filterState.selectedCounty) {
                setState(prev => ({ ...prev, loading: true }));
                try {
                    const facilities = await dataService.getFacilitiesByCounty(state.filterState.selectedCounty);
                    setState(prev => ({
                        ...prev,
                        facilities,
                        loading: false
                    }));
                } catch (error) {
                    console.error('Error loading facilities:', error);
                    setState(prev => ({ ...prev, loading: false }));
                }
            } else {
                setState(prev => ({ ...prev, facilities: [] }));
            }
        };

        loadFacilities();
    }, [state.filterState.selectedCounty]);

    // Load dashboard cards when filters or category change
    useEffect(() => {
        const loadDashboardData = async () => {
            // Only set loading if we don't already have cards for this combination
            const hasExistingData = state.dashboardCards.length > 0;
            if (!hasExistingData) {
                setState(prev => ({ ...prev, loading: true }));
            }
            
            try {
                let cards: DashboardCard[] = [];

                if (state.filterState.category === 'hts') {
                    const htsData = await dataService.getHTSData(state.filterState.selectedFacility || undefined);
                    cards = dataService.convertHTSToCards(htsData);
                } else if (state.filterState.category === 'care-treatment') {
                    const careData = await dataService.getCareAndTreatmentData(state.filterState.selectedFacility || undefined);
                    cards = dataService.convertCareAndTreatmentToCards(careData);
                } else if (state.filterState.category === 'dashboard') {
                    const dashboardData = await dataService.getDashboardData(state.filterState.selectedFacility || undefined);
                    cards = dataService.convertDashboardToCards(dashboardData);
                }

                setState(prev => ({
                    ...prev,
                    dashboardCards: cards,
                    loading: false
                }));
            } catch (error) {
                console.error('Error loading dashboard data:', error);
                setState(prev => ({
                    ...prev,
                    dashboardCards: [],
                    loading: false
                }));
            }
        };

        // Add a small delay to prevent rapid successive calls
        const timeoutId = setTimeout(() => {
            loadDashboardData();
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [state.filterState.category, state.filterState.selectedCounty, state.filterState.selectedFacility]);

    const selectCounty = (countyId: string | null) => {
        setState(prev => ({
            ...prev,
            filterState: {
                ...prev.filterState,
                selectedCounty: countyId,
                selectedFacility: null // Reset facility when county changes
            }
        }));
    };

    const selectFacility = (facilityId: string | null) => {
        setState(prev => ({
            ...prev,
            filterState: {
                ...prev.filterState,
                selectedFacility: facilityId
            }
        }));
    };

    const setCategory = (category: CategoryType) => {
        setState(prev => ({
            ...prev,
            filterState: {
                ...prev.filterState,
                category
            }
        }));
    };

    return {
        counties: state.counties,
        facilities: state.facilities,
        dashboardCards: state.dashboardCards,
        loading: state.loading,
        filterState: state.filterState,
        selectCounty,
        selectFacility,
        setCategory
    };
}