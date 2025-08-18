import { useState, useEffect } from 'react';
import { County, Facility, DashboardCard, CategoryType, FilterState } from '@/types';
import { dataService } from '@/services/dataService';

interface DataStoreState {
    counties: County[];
    facilities: Facility[];
    dashboardCards: DashboardCard[];
    loading: boolean;
    error: string | null;
    filterState: FilterState;
}

export function useDataStore() {
    const [state, setState] = useState<DataStoreState>({
        counties: [],
        facilities: [],
        dashboardCards: [],
        loading: true,
        error: null,
        filterState: {
            selectedCounty: null,
            selectedFacility: null,
            category: 'dashboard'
        }
    });

    // Destructure primitive values to prevent infinite re-renders
    const { selectedCounty, selectedFacility, category } = state.filterState;

    // Load initial data
    useEffect(() => {
        const loadInitialData = async () => {
            setState(prev => ({ ...prev, loading: true, error: null }));
            try {
                const counties = await dataService.getCounties();
                setState(prev => ({
                    ...prev,
                    counties,
                    loading: false,
                    error: null
                }));
            } catch (error) {
                const errorMessage = 'Unable to connect to the server. Please check your network connection or contact support.';
                console.error('Error loading initial data:', error);
                setState(prev => ({ 
                    ...prev, 
                    loading: false,
                    error: errorMessage
                }));
            }
        };

        loadInitialData();
    }, []);

    // Load facilities when county changes
    useEffect(() => {
        const loadFacilities = async () => {
            if (selectedCounty) {
                setState(prev => ({ ...prev, loading: true, error: null }));
                try {
                    const facilities = await dataService.getFacilitiesByCounty(selectedCounty);
                    setState(prev => ({
                        ...prev,
                        facilities,
                        loading: false,
                        error: null
                    }));
                } catch (error) {
                    const errorMessage = 'Unable to load facilities. Please try again.';
                    console.error('Error loading facilities:', error);
                    setState(prev => ({ 
                        ...prev, 
                        loading: false,
                        error: errorMessage
                    }));
                }
            } else {
                setState(prev => ({ ...prev, facilities: [], error: null }));
            }
        };

        loadFacilities();
    }, [selectedCounty]);

    // Load dashboard cards when filters or category change
    useEffect(() => {
        const loadDashboardData = async () => {
            setState(prev => ({ ...prev, loading: true, error: null }));
            
            try {
                let cards: DashboardCard[] = [];

                if (category === 'hts') {
                    const htsData = await dataService.getHTSData(selectedFacility || undefined);
                    cards = dataService.convertHTSToCards(htsData);
                } else if (category === 'care-treatment') {
                    const careData = await dataService.getCareAndTreatmentData(selectedFacility || undefined);
                    cards = dataService.convertCareAndTreatmentToCards(careData);
                } else if (category === 'dashboard') {
                    const dashboardData = await dataService.getDashboardData(selectedFacility || undefined);
                    cards = dataService.convertDashboardToCards(dashboardData);
                }

                setState(prev => ({
                    ...prev,
                    dashboardCards: cards,
                    loading: false,
                    error: null
                }));
            } catch (error) {
                const errorMessage = 'Unable to load dashboard data. Please try again.';
                console.error('Error loading dashboard data:', error);
                setState(prev => ({
                    ...prev,
                    dashboardCards: [],
                    loading: false,
                    error: errorMessage
                }));
            }
        };

        loadDashboardData();
    }, [category, selectedCounty, selectedFacility]);

    const selectCounty = (countyId: string | null) => {
        setState(prev => ({
            ...prev,
            error: null,
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
            error: null,
            filterState: {
                ...prev.filterState,
                selectedFacility: facilityId
            }
        }));
    };

    const setCategory = (category: CategoryType) => {
        setState(prev => ({
            ...prev,
            error: null,
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
        error: state.error,
        filterState: state.filterState,
        selectCounty,
        selectFacility,
        setCategory
    };
}