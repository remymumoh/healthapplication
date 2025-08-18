export interface County {
    id: string;
    name: string;
    code: string;
    facilityCount?: number;
}

export interface Facility {
    id: string;
    name: string;
    type: string;
    county: string;
    subcounty?: string;
    ward?: string;
    program?: string;
    location: {
        latitude: number;
        longitude: number;
    };
}

export interface HTSData {
    totalTests: number;
    positiveTests: number;
    negativeTests: number;
    testingRate: number;
    monthlyGrowth: number;
    targetAchievement: number;
}

export interface CareAndTreatmentData {
    activePatients: number;
    newEnrollments: number;
    retentionRate: number;
    viralSuppression: number;
    adherenceRate: number;
    lostToFollowUp: number;
}

export interface DashboardCard {
    id: string;
    title: string;
    value: string | number;
    change: number;
    changeType: 'increase' | 'decrease' | 'neutral';
    icon: string;
    description: string;
}

export type CategoryType = 'hts' | 'care-treatment' | 'dashboard';

export interface FilterState {
    selectedCounty: string | null;
    selectedFacility: string | null;
    category: CategoryType;
}

export interface DashboardData {
    opdPatients: number;
    ipdPatients: number;
    tbCases: number;
    stiCases: number;
}

export interface DemographicIndicator {
    indicatorid: string;
    indicator_name: string;
    disagrgender: string;
    disagragegroup: string;
    locationid: string;
    total_value: number;
}

export interface DemographicData {
    indicators: DemographicIndicator[];
    totalMale: number;
    totalFemale: number;
    totalTests: number;
    ageGroups: {
        ageGroup: string;
        male: number;
        female: number;
        total: number;
    }[];
}

export interface APILocation {
    mflcode: string;
    facility: string;
    type: string;
    county: string;
    subcounty: string;
    ward: string;
    program: string;
}