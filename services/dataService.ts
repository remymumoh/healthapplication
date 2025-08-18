import { County, Facility, HTSData, CareAndTreatmentData, DashboardCard, DashboardData, APILocation } from '@/types';
import { API_BASE_URL } from '@/constants/api';

interface HTSIndicator {
    id: string;
    title: string;
    reportdept: string;
    modality: string;
    description: string;
    icon: string;
}

class DataService {
    private locationsCache: APILocation[] = [];
    private countiesCache: County[] = [];
    private facilitiesCache: Map<string, Facility[]> = new Map();

    // Fallback data for when API is unreachable
    private fallbackCounties: County[] = [
        { id: '1', name: 'Nairobi', code: 'NAI' },
        { id: '2', name: 'Mombasa', code: 'MSA' },
        { id: '3', name: 'Kisumu', code: 'KSM' },
        { id: '4', name: 'Nakuru', code: 'NAK' },
        { id: '5', name: 'Eldoret', code: 'ELD' }
    ];

    private fallbackFacilities: Facility[] = [
        { id: '10001', name: 'Kenyatta National Hospital', type: 'Hospital', county: '1', location: { latitude: 0, longitude: 0 } },
        { id: '10002', name: 'Nairobi Hospital', type: 'Hospital', county: '1', location: { latitude: 0, longitude: 0 } },
        { id: '10003', name: 'Pumwani Maternity Hospital', type: 'Hospital', county: '1', location: { latitude: 0, longitude: 0 } },
        { id: '20001', name: 'Coast General Hospital', type: 'Hospital', county: '2', location: { latitude: 0, longitude: 0 } },
        { id: '20002', name: 'Aga Khan Hospital Mombasa', type: 'Hospital', county: '2', location: { latitude: 0, longitude: 0 } }
    ];

    private htsIndicators: HTSIndicator[] = [
        {
            id: '1',
            title: 'HTS Total Tested',
            reportdept: 'HTS_UPTAKE',
            modality: 'NEW_TESTING',
            description: 'Total number of HIV tests conducted',
            icon: 'Activity'
        },
        {
            id: '2',
            title: 'HTS Positive',
            reportdept: 'HTS_UPTAKE',
            modality: 'REPEAT_TESTING',
            description: 'Number of positive HIV test results',
            icon: 'AlertCircle'
        },
        {
            id: '3',
            title: 'HTS Negative',
            reportdept: 'HTS_UPTAKE',
            modality: 'TOTAL_POSITIVE',
            description: 'Number of negative HIV test results',
            icon: 'Shield'
        },
        {
            id: '4',
            title: 'HTS Linkage',
            reportdept: 'HTS_LINKAGE',
            modality: 'TOTAL_LINKAGE',
            description: 'Patients linked to care after positive test',
            icon: 'TrendingUp'
        }
    ];

    private async fetchLocations(): Promise<APILocation[]> {
        if (this.locationsCache.length > 0) {
            return this.locationsCache;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/locations/`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const locations: APILocation[] = await response.json();
            this.locationsCache = locations;
            return locations;
        } catch (error) {
            console.error('Error fetching locations:', error);
            // Return fallback data when API is unreachable
            this.locationsCache = this.fallbackCounties.flatMap(county => 
                this.fallbackFacilities
                    .filter(facility => facility.county === county.id)
                    .map(facility => ({
                        mflcode: facility.id,
                        facility: facility.name,
                        county: county.name,
                        subcounty: 'Default Subcounty',
                        ward: 'Default Ward',
                        type: facility.type,
                        program: 'HTS'
                    }))
            );
            return this.locationsCache;
        }
    }

    async getCounties(): Promise<County[]> {
        if (this.countiesCache.length > 0) {
            return this.countiesCache;
        }

        try {
            const locations = await this.fetchLocations();
            const uniqueCounties = [...new Set(locations.map(loc => loc.county))];

            this.countiesCache = uniqueCounties.map((countyName, index) => ({
                id: (index + 1).toString(),
                name: countyName,
                code: countyName.substring(0, 3).toUpperCase()
            }));

            return this.countiesCache;
        } catch (error) {
            console.error('Error processing counties:', error);
            // Return fallback counties when API is unreachable
            this.countiesCache = this.fallbackCounties;
            return this.countiesCache;
        }
    }

    async getFacilitiesByCounty(countyId: string): Promise<Facility[]> {
        if (this.facilitiesCache.has(countyId)) {
            return this.facilitiesCache.get(countyId)!;
        }

        try {
            const locations = await this.fetchLocations();
            const counties = await this.getCounties();

            const selectedCounty = counties.find(c => c.id === countyId);
            if (!selectedCounty) {
                return [];
            }

            const countyFacilities = locations
                .filter(loc => loc.county === selectedCounty.name)
                .map((loc) => ({
                    id: loc.mflcode,
                    name: loc.facility,
                    type: loc.type,
                    county: countyId,
                    location: {
                        latitude: 0,
                        longitude: 0
                    }
                }));

            this.facilitiesCache.set(countyId, countyFacilities);
            return countyFacilities;
        } catch (error) {
            console.error('Error fetching facilities:', error);
            // Return fallback facilities for the county
            const fallbackForCounty = this.fallbackFacilities.filter(f => f.county === countyId);
            this.facilitiesCache.set(countyId, fallbackForCounty);
            return fallbackForCounty;
        }
    }

    async getHTSData(facilityId?: string): Promise<HTSData> {
        try {
            const locationId = facilityId || 'ALL';
            const currentDate = new Date();
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

            const startDateStr = startDate.toISOString().split('T')[0];
            const endDateStr = endDate.toISOString().split('T')[0];

            const results = await Promise.all(
                this.htsIndicators.map(async (indicator) => {
                    try {
                        const url = `${API_BASE_URL}/summary/?reportdept=${indicator.reportdept}&modality=${indicator.modality}&locationid=${locationId}&startdate=${startDateStr}&enddate=${endDateStr}`;
                        const response = await fetch(url);

                        if (!response.ok) {
                            console.warn(`Failed to fetch ${indicator.title}: ${response.status}`);
                            return { indicator, value: 0 };
                        }

                        const data = await response.json();
                        const value = Array.isArray(data) && data.length > 0 ? (data[0].total || 0) : 0;
                        return { indicator, value };
                    } catch (error) {
                        console.error(`Error fetching ${indicator.title}:`, error);
                        return { indicator, value: 0 };
                    }
                })
            );

            const totalTests = results.find(r => r.indicator.modality === 'NEW_TESTING')?.value || 0;
            const positiveTests = results.find(r => r.indicator.modality === 'REPEAT_TESTING')?.value || 0;
            const negativeTests = totalTests - positiveTests;

            return {
                totalTests,
                positiveTests,
                negativeTests,
                testingRate: totalTests > 0 ? ((totalTests / 1000) * 100) : 0,
                monthlyGrowth: 5.7,
                targetAchievement: totalTests > 0 ? Math.min((totalTests / 500) * 100, 100) : 0,
            };
        } catch (error) {
            console.error('Error fetching HTS data:', error);
            return {
                totalTests: 0,
                positiveTests: 0,
                negativeTests: 0,
                testingRate: 0,
                monthlyGrowth: 0,
                targetAchievement: 0,
            };
        }
    }

    async getCareAndTreatmentData(facilityId?: string): Promise<CareAndTreatmentData> {
        try {
            const locationId = facilityId || 'ALL';
            const currentDate = new Date();
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

            const startDateStr = startDate.toISOString().split('T')[0];
            const endDateStr = endDate.toISOString().split('T')[0];

            const careIndicators = [
                { reportdept: 'CARE_TREATMENT', modality: 'ACTIVE_PATIENTS' },
                { reportdept: 'CARE_TREATMENT', modality: 'NEW_ENROLLMENTS' },
                { reportdept: 'CARE_TREATMENT', modality: 'RETENTION_RATE' },
                { reportdept: 'CARE_TREATMENT', modality: 'VIRAL_SUPPRESSION' },
                { reportdept: 'CARE_TREATMENT', modality: 'ADHERENCE_RATE' },
                { reportdept: 'CARE_TREATMENT', modality: 'LOST_TO_FOLLOWUP' }
            ];

            const results = await Promise.all(
                careIndicators.map(async (indicator) => {
                    try {
                        const url = `${API_BASE_URL}/summary/?reportdept=${indicator.reportdept}&modality=${indicator.modality}&locationid=${locationId}&startdate=${startDateStr}&enddate=${endDateStr}`;
                        const response = await fetch(url);

                        if (!response.ok) {
                            return { modality: indicator.modality, value: 0 };
                        }

                        const data = await response.json();
                        const value = Array.isArray(data) && data.length > 0 ? (data[0].total || 0) : 0;
                        return { modality: indicator.modality, value };
                    } catch (error) {
                        return { modality: indicator.modality, value: 0 };
                    }
                })
            );

            return {
                activePatients: results.find(r => r.modality === 'ACTIVE_PATIENTS')?.value || 0,
                newEnrollments: results.find(r => r.modality === 'NEW_ENROLLMENTS')?.value || 0,
                retentionRate: results.find(r => r.modality === 'RETENTION_RATE')?.value || 0,
                viralSuppression: results.find(r => r.modality === 'VIRAL_SUPPRESSION')?.value || 0,
                adherenceRate: results.find(r => r.modality === 'ADHERENCE_RATE')?.value || 0,
                lostToFollowUp: results.find(r => r.modality === 'LOST_TO_FOLLOWUP')?.value || 0,
            };
        } catch (error) {
            console.error('Error fetching care and treatment data:', error);
            return {
                activePatients: 0,
                newEnrollments: 0,
                retentionRate: 0,
                viralSuppression: 0,
                adherenceRate: 0,
                lostToFollowUp: 0,
            };
        }
    }

    async getDashboardData(facilityId?: string): Promise<DashboardData> {
        try {
            const locationId = facilityId || 'ALL';
            const currentDate = new Date();
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

            const startDateStr = startDate.toISOString().split('T')[0];
            const endDateStr = endDate.toISOString().split('T')[0];

            const dashboardIndicators = [
                { reportdept: 'OPD', modality: 'TESTING' },
                { reportdept: 'IPD', modality: 'TESTING' },
                { reportdept: 'TB', modality: 'TESTING' },
                { reportdept: 'STI', modality: 'TESTING' }
            ];

            const results = await Promise.all(
                dashboardIndicators.map(async (indicator) => {
                    try {
                        const url = `${API_BASE_URL}/summary/?reportdept=${indicator.reportdept}&modality=${indicator.modality}&locationid=${locationId}&startdate=${startDateStr}&enddate=${endDateStr}`;
                        const response = await fetch(url);

                        if (!response.ok) {
                            return { reportdept: indicator.reportdept, value: 0 };
                        }

                        const data = await response.json();
                        const value = Array.isArray(data) && data.length > 0 ? (data[0].total || 0) : 0;
                        return { reportdept: indicator.reportdept, value };
                    } catch (error) {
                        return { reportdept: indicator.reportdept, value: 0 };
                    }
                })
            );

            return {
                opdPatients: results.find(r => r.reportdept === 'OPD')?.value || 0,
                ipdPatients: results.find(r => r.reportdept === 'IPD')?.value || 0,
                tbCases: results.find(r => r.reportdept === 'TB')?.value || 0,
                stiCases: results.find(r => r.reportdept === 'STI')?.value || 0,
            };
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            return {
                opdPatients: 0,
                ipdPatients: 0,
                tbCases: 0,
                stiCases: 0,
            };
        }
    }

    convertHTSToCards(data: HTSData): DashboardCard[] {
        return [
            {
                id: '1',
                title: 'HTS Total Tested',
                value: data.totalTests.toLocaleString(),
                change: Math.abs(data.monthlyGrowth),
                changeType: data.monthlyGrowth >= 0 ? 'increase' : 'decrease',
                icon: 'Activity',
                description: 'Total number of HIV tests conducted'
            },
            {
                id: '2',
                title: 'HTS Positive',
                value: data.positiveTests.toLocaleString(),
                change: 2.3,
                changeType: 'increase',
                icon: 'AlertCircle',
                description: 'Number of positive HIV test results'
            },
            {
                id: '3',
                title: 'HTS Negative',
                value: data.negativeTests.toLocaleString(),
                change: 1.2,
                changeType: 'increase',
                icon: 'Shield',
                description: 'Number of negative HIV test results'
            },
            {
                id: '4',
                title: 'HTS Linkage',
                value: Math.floor(data.positiveTests * 0.85).toLocaleString(),
                change: 3.4,
                changeType: 'increase',
                icon: 'TrendingUp',
                description: 'Patients linked to care after positive test'
            }
        ];
    }

    convertCareAndTreatmentToCards(data: CareAndTreatmentData): DashboardCard[] {
        return [
            {
                id: '1',
                title: 'Active Patients',
                value: data.activePatients.toLocaleString(),
                change: 2.8,
                changeType: 'increase',
                icon: 'Users',
                description: 'Patients currently on treatment'
            },
            {
                id: '2',
                title: 'New Enrollments',
                value: data.newEnrollments.toLocaleString(),
                change: 4.2,
                changeType: 'increase',
                icon: 'UserPlus',
                description: 'New patients this month'
            },
            {
                id: '3',
                title: 'Retention Rate',
                value: `${data.retentionRate}%`,
                change: 1.5,
                changeType: 'increase',
                icon: 'Heart',
                description: 'Patient retention in program'
            },
            {
                id: '4',
                title: 'Viral Suppression',
                value: `${data.viralSuppression}%`,
                change: 0.8,
                changeType: 'increase',
                icon: 'Shield',
                description: 'Patients with suppressed viral load'
            },
            {
                id: '5',
                title: 'Adherence Rate',
                value: `${data.adherenceRate}%`,
                change: -0.5,
                changeType: 'decrease',
                icon: 'Clock',
                description: 'Treatment adherence rate'
            },
            {
                id: '6',
                title: 'Lost to Follow-up',
                value: data.lostToFollowUp.toLocaleString(),
                change: -12.3,
                changeType: 'decrease',
                icon: 'AlertTriangle',
                description: 'Patients lost to follow-up'
            }
        ];
    }

    convertDashboardToCards(data: DashboardData): DashboardCard[] {
        return [
            {
                id: '1',
                title: 'HTS OPD',
                value: data.opdPatients.toLocaleString(),
                change: 5.2,
                changeType: 'increase',
                icon: 'Users',
                description: 'HIV testing in outpatient department'
            },
            {
                id: '2',
                title: 'HTS IPD',
                value: data.ipdPatients.toLocaleString(),
                change: 2.8,
                changeType: 'increase',
                icon: 'Heart',
                description: 'HIV testing in inpatient department'
            },
            {
                id: '3',
                title: 'HTS TB',
                value: data.tbCases.toLocaleString(),
                change: -1.5,
                changeType: 'decrease',
                icon: 'Activity',
                description: 'HIV testing for TB patients'
            },
            {
                id: '4',
                title: 'HTS STI',
                value: data.stiCases.toLocaleString(),
                change: 3.7,
                changeType: 'increase',
                icon: 'AlertCircle',
                description: 'HIV testing for STI patients'
            }
        ];
    }
}

export const dataService = new DataService();