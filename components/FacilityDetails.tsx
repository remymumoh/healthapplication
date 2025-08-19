import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Building2, Users, Activity, Heart, Shield, Clock, MapPin, Calendar, TrendingUp, CircleAlert as AlertCircle, CircleCheck as CheckCircle, ChartBar as BarChart3, User, UserCheck } from 'lucide-react-native';
import { Facility, County, fetchFacilitySummary, FacilitySummaryData, getDateRangeForAPI } from '../services/facilityService';
import { useState, useEffect } from 'react';
import { useDateRange } from '../contexts/DateRangeContext';

interface FacilityDetailsProps {
  facility: Facility;
  county: County;
}

export default function FacilityDetails({ facility, county }: FacilityDetailsProps) {
  const { selectedDateRange } = useDateRange();
  const [summaryData, setSummaryData] = useState<FacilitySummaryData | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    const loadSummaryData = async () => {
      setLoadingSummary(true);
      try {
        const { startDate, endDate } = getDateRangeForAPI(
          selectedDateRange.startDate,
          selectedDateRange.endDate
        );
        
        const data = await fetchFacilitySummary(
          facility.mflCode,
          'HTS_UPTAKE',
          'NEW_TESTING',
          startDate,
          endDate
        );
        
        setSummaryData(data);
      } catch (error) {
        console.error('Error loading summary data:', error);
      } finally {
        setLoadingSummary(false);
      }
    };

    loadSummaryData();
  }, [facility.mflCode, selectedDateRange]);

  const getFacilityTypeLabel = (type: Facility['type']) => {
    switch (type) {
      case 'hospital':
        return 'Hospital';
      case 'clinic':
        return 'Clinic';
      case 'health_center':
        return 'Health Center';
      case 'kp_site':
        return 'KP Site';
      default:
        return 'Facility';
    }
  };

  const getFacilityIcon = (type: Facility['type']) => {
    switch (type) {
      case 'hospital':
        return <Building2 size={32} color="#3b82f6" />;
      case 'clinic':
        return <Building2 size={32} color="#10b981" />;
      case 'health_center':
        return <Building2 size={32} color="#f59e0b" />;
      case 'kp_site':
        return <Building2 size={32} color="#9c27b0" />;
      default:
        return <Building2 size={32} color="#6b7280" />;
    }
  };

  const facilityStats = [
    {
      title: 'Total Patients',
      value: facility.patients.toLocaleString(),
      change: '+2.8%',
      icon: Users,
      color: '#3b82f6'
    },
    {
      title: 'HTS Tests',
      value: facility.htsTests.toLocaleString(),
      change: '+4.2%',
      icon: Activity,
      color: '#10b981'
    },
    {
      title: 'Care Enrollments',
      value: facility.careEnrollments.toLocaleString(),
      change: '+1.5%',
      icon: Heart,
      color: '#ef4444'
    },
    {
      title: 'Viral Suppression',
      value: `${facility.viralSuppression}%`,
      change: '+0.8%',
      icon: Shield,
      color: '#8b5cf6'
    },
    {
      title: 'Retention Rate',
      value: `${facility.retentionRate}%`,
      change: '+1.2%',
      icon: Clock,
      color: '#f59e0b'
    }
  ];

  // Mock detailed data for tables
  const monthlyData = [
    { month: 'January 2024', htsTests: 234, newEnrollments: 45, viralSuppression: 92.1, retention: 88.5 },
    { month: 'February 2024', htsTests: 267, newEnrollments: 52, viralSuppression: 93.2, retention: 89.1 },
    { month: 'March 2024', htsTests: 298, newEnrollments: 48, viralSuppression: 94.0, retention: 89.8 },
    { month: 'April 2024', htsTests: 312, newEnrollments: 56, viralSuppression: 94.2, retention: 89.5 },
    { month: 'May 2024', htsTests: 289, newEnrollments: 41, viralSuppression: 93.8, retention: 88.9 },
    { month: 'June 2024', htsTests: 334, newEnrollments: 63, viralSuppression: 94.5, retention: 90.2 }
  ];

  const departmentData = [
    { department: 'Outpatient Department', patients: 1245, tests: 456, enrollments: 234, status: 'Active' },
    { department: 'Inpatient Ward', patients: 567, tests: 189, enrollments: 123, status: 'Active' },
    { department: 'Maternity Ward', patients: 234, tests: 98, enrollments: 67, status: 'Active' },
    { department: 'Pediatric Unit', patients: 345, tests: 134, enrollments: 89, status: 'Active' },
    { department: 'Emergency Department', patients: 456, tests: 167, enrollments: 78, status: 'Active' }
  ];

  const staffData = [
    { role: 'Medical Officers', count: 12, target: 15, percentage: 80 },
    { role: 'Nurses', count: 45, target: 50, percentage: 90 },
    { role: 'Lab Technicians', count: 8, target: 10, percentage: 80 },
    { role: 'Counselors', count: 6, target: 8, percentage: 75 },
    { role: 'Data Clerks', count: 4, target: 5, percentage: 80 }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#10b981';
      case 'inactive':
        return '#ef4444';
      case 'pending':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return '#10b981';
    if (percentage >= 75) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.facilityHeader}>
            {getFacilityIcon(facility.type)}
            <View style={styles.facilityInfo}>
              <Text style={styles.facilityName}>{facility.name}</Text>
              <View style={styles.facilityMeta}>
                <Text style={styles.facilityType}>{getFacilityTypeLabel(facility.type)}</Text>
                <Text style={styles.mflCode}>MFL: {facility.mflCode}</Text>
                <View style={styles.locationContainer}>
                  <MapPin size={14} color="#6b7280" />
                  <Text style={styles.countyName}>{county.name}</Text>
                </View>
              </View>
              <View style={styles.additionalInfo}>
                <Text style={styles.subcountyText}>📍 {facility.subcounty} • {facility.ward}</Text>
                <Text style={styles.programText}>🏥 {facility.program}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Real-time API Data Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Activity size={20} color="#3b82f6" />
            <Text style={styles.sectionTitle}>Live Data - {selectedDateRange.label}</Text>
          </View>
          
          {loadingSummary ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.loadingText}>Loading real-time data...</Text>
            </View>
          ) : summaryData ? (
            <View style={styles.liveDataContainer}>
              <View style={styles.liveDataGrid}>
                <View style={styles.liveDataCard}>
                  <View style={styles.liveDataHeader}>
                    <Activity size={24} color="#3b82f6" />
                    <Text style={styles.liveDataTitle}>Total Tests</Text>
                  </View>
                  <Text style={styles.liveDataValue}>{summaryData.totalTests.toLocaleString()}</Text>
                  <Text style={styles.liveDataSubtext}>HTS tests conducted</Text>
                </View>

                <View style={styles.liveDataCard}>
                  <View style={styles.liveDataHeader}>
                    <User size={24} color="#10b981" />
                    <Text style={styles.liveDataTitle}>Male Tests</Text>
                  </View>
                  <Text style={styles.liveDataValue}>{summaryData.maleTests.toLocaleString()}</Text>
                  <Text style={styles.liveDataSubtext}>{summaryData.malePercentage}% of total</Text>
                </View>

                <View style={styles.liveDataCard}>
                  <View style={styles.liveDataHeader}>
                    <UserCheck size={24} color="#ef4444" />
                    <Text style={styles.liveDataTitle}>Female Tests</Text>
                  </View>
                  <Text style={styles.liveDataValue}>{summaryData.femaleTests.toLocaleString()}</Text>
                  <Text style={styles.liveDataSubtext}>{summaryData.femalePercentage}% of total</Text>
                </View>

                <View style={styles.liveDataCard}>
                  <View style={styles.liveDataHeader}>
                    <TrendingUp size={24} color="#f59e0b" />
                    <Text style={styles.liveDataTitle}>Top Age Group</Text>
                  </View>
                  <Text style={styles.liveDataValue}>{summaryData.topAgeGroup.ageGroup}</Text>
                  <Text style={styles.liveDataSubtext}>{summaryData.topAgeGroup.count} tests</Text>
                </View>
              </View>

              {/* Gender Breakdown Chart */}
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Gender Distribution</Text>
                <View style={styles.genderChart}>
                  <View style={styles.genderBar}>
                    <View style={[styles.genderSegment, { 
                      width: `${summaryData.malePercentage}%`, 
                      backgroundColor: '#3b82f6' 
                    }]} />
                    <View style={[styles.genderSegment, { 
                      width: `${summaryData.femalePercentage}%`, 
                      backgroundColor: '#ef4444' 
                    }]} />
                  </View>
                  <View style={styles.genderLegend}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
                      <Text style={styles.legendText}>Male ({summaryData.malePercentage}%)</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
                      <Text style={styles.legendText}>Female ({summaryData.femalePercentage}%)</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Age Groups Breakdown */}
              <View style={styles.ageGroupsContainer}>
                <Text style={styles.chartTitle}>Age Group Distribution</Text>
                <View style={styles.ageGroupsList}>
                  {Object.entries(summaryData.ageGroups)
                    .filter(([_, count]) => count > 0)
                    .sort(([_, a], [__, b]) => b - a)
                    .slice(0, 6)
                    .map(([ageGroup, count]) => (
                      <View key={ageGroup} style={styles.ageGroupItem}>
                        <Text style={styles.ageGroupLabel}>{ageGroup}</Text>
                        <View style={styles.ageGroupBar}>
                          <View 
                            style={[
                              styles.ageGroupFill, 
                              { 
                                width: `${(count / summaryData.totalTests) * 100}%`,
                                backgroundColor: '#8b5cf6'
                              }
                            ]} 
                          />
                        </View>
                        <Text style={styles.ageGroupCount}>{count}</Text>
                      </View>
                    ))}
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.errorContainer}>
              <AlertCircle size={24} color="#ef4444" />
              <Text style={styles.errorText}>Unable to load real-time data</Text>
            </View>
          )}
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.statsGrid}>
            {facilityStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <View key={index} style={styles.statCard}>
                  <View style={styles.statContent}>
                    <View style={[styles.iconContainer, { backgroundColor: `${stat.color}20` }]}>
                      <IconComponent size={20} color={stat.color} />
                    </View>
                    <View style={styles.statInfo}>
                      <Text style={styles.statTitle}>{stat.title}</Text>
                      <Text style={styles.statValue}>{stat.value}</Text>
                      <Text style={[styles.statChange, { color: '#10b981' }]}>{stat.change}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Monthly Performance Table */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color="#3b82f6" />
            <Text style={styles.sectionTitle}>Monthly Performance Trends</Text>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.monthColumn]}>Month</Text>
              <Text style={[styles.tableHeaderCell, styles.dataColumn]}>HTS Tests</Text>
              <Text style={[styles.tableHeaderCell, styles.dataColumn]}>Enrollments</Text>
              <Text style={[styles.tableHeaderCell, styles.dataColumn]}>Viral Supp.</Text>
              <Text style={[styles.tableHeaderCell, styles.dataColumn]}>Retention</Text>
            </View>
            {monthlyData.map((row, index) => (
              <View key={index} style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
                <Text style={[styles.tableCell, styles.monthColumn]}>{row.month}</Text>
                <Text style={[styles.tableCell, styles.dataColumn]}>{row.htsTests}</Text>
                <Text style={[styles.tableCell, styles.dataColumn]}>{row.newEnrollments}</Text>
                <Text style={[styles.tableCell, styles.dataColumn, { color: getPerformanceColor(row.viralSuppression) }]}>
                  {row.viralSuppression}%
                </Text>
                <Text style={[styles.tableCell, styles.dataColumn, { color: getPerformanceColor(row.retention) }]}>
                  {row.retention}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Department Breakdown Table */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Building2 size={20} color="#10b981" />
            <Text style={styles.sectionTitle}>Department Breakdown</Text>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.departmentColumn]}>Department</Text>
              <Text style={[styles.tableHeaderCell, styles.smallDataColumn]}>Patients</Text>
              <Text style={[styles.tableHeaderCell, styles.smallDataColumn]}>Tests</Text>
              <Text style={[styles.tableHeaderCell, styles.smallDataColumn]}>Enrolled</Text>
              <Text style={[styles.tableHeaderCell, styles.statusColumn]}>Status</Text>
            </View>
            {departmentData.map((row, index) => (
              <View key={index} style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
                <Text style={[styles.tableCell, styles.departmentColumn]} numberOfLines={2}>
                  {row.department}
                </Text>
                <Text style={[styles.tableCell, styles.smallDataColumn]}>{row.patients}</Text>
                <Text style={[styles.tableCell, styles.smallDataColumn]}>{row.tests}</Text>
                <Text style={[styles.tableCell, styles.smallDataColumn]}>{row.enrollments}</Text>
                <View style={[styles.tableCell, styles.statusColumn, styles.statusContainer]}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(row.status) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(row.status) }]}>
                    {row.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Staff Capacity Table */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={20} color="#8b5cf6" />
            <Text style={styles.sectionTitle}>Staff Capacity Analysis</Text>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.roleColumn]}>Role</Text>
              <Text style={[styles.tableHeaderCell, styles.smallDataColumn]}>Current</Text>
              <Text style={[styles.tableHeaderCell, styles.smallDataColumn]}>Target</Text>
              <Text style={[styles.tableHeaderCell, styles.capacityColumn]}>Capacity</Text>
              <Text style={[styles.tableHeaderCell, styles.statusColumn]}>Status</Text>
            </View>
            {staffData.map((row, index) => (
              <View key={index} style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
                <Text style={[styles.tableCell, styles.roleColumn]}>{row.role}</Text>
                <Text style={[styles.tableCell, styles.smallDataColumn]}>{row.count}</Text>
                <Text style={[styles.tableCell, styles.smallDataColumn]}>{row.target}</Text>
                <View style={[styles.tableCell, styles.capacityColumn]}>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${row.percentage}%`, 
                            backgroundColor: getPerformanceColor(row.percentage) 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.progressText, { color: getPerformanceColor(row.percentage) }]}>
                      {row.percentage}%
                    </Text>
                  </View>
                </View>
                <View style={[styles.tableCell, styles.statusColumn, styles.statusContainer]}>
                  {row.percentage >= 90 ? (
                    <CheckCircle size={16} color="#10b981" />
                  ) : (
                    <AlertCircle size={16} color={row.percentage >= 75 ? "#f59e0b" : "#ef4444"} />
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          <View style={styles.performanceCard}>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Testing Coverage</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '78%', backgroundColor: '#10b981' }]} />
              </View>
              <Text style={styles.performanceValue}>78%</Text>
            </View>
            
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Treatment Adherence</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '85%', backgroundColor: '#3b82f6' }]} />
              </View>
              <Text style={styles.performanceValue}>85%</Text>
            </View>
            
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Follow-up Rate</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '92%', backgroundColor: '#8b5cf6' }]} />
              </View>
              <Text style={styles.performanceValue}>92%</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#10b981' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New patient enrollments increased</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#3b82f6' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>HTS testing targets met for the month</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#f59e0b' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Quarterly report submitted</Text>
                <Text style={styles.activityTime}>3 days ago</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  facilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  facilityInfo: {
    marginLeft: 16,
    flex: 1,
  },
  facilityName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  facilityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  facilityType: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginRight: 16,
  },
  mflCode: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  countyName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginLeft: 4,
  },
  additionalInfo: {
    marginTop: 8,
  },
  subcountyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 4,
  },
  programText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3b82f6',
  },
  statsSection: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  section: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginTop: 12,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ef4444',
    marginTop: 12,
  },
  liveDataContainer: {
    marginTop: 8,
  },
  liveDataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  liveDataCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  liveDataHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveDataTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#475569',
    marginLeft: 8,
  },
  liveDataValue: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  liveDataSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  chartContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#334155',
    marginBottom: 12,
  },
  genderChart: {
    marginTop: 8,
  },
  genderBar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
    marginBottom: 12,
  },
  genderSegment: {
    height: '100%',
  },
  genderLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#475569',
  },
  ageGroupsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  ageGroupsList: {
    marginTop: 8,
  },
  ageGroupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ageGroupLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#475569',
    width: 60,
  },
  ageGroupBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginHorizontal: 12,
  },
  ageGroupFill: {
    height: '100%',
    borderRadius: 4,
  },
  ageGroupCount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#334155',
    width: 40,
    textAlign: 'right',
  },
  tableContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableHeaderCell: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    alignItems: 'center',
  },
  tableRowEven: {
    backgroundColor: '#ffffff',
  },
  tableCell: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  monthColumn: {
    flex: 2,
  },
  dataColumn: {
    flex: 1,
    textAlign: 'center',
  },
  departmentColumn: {
    flex: 2.5,
  },
  smallDataColumn: {
    flex: 1,
    textAlign: 'center',
  },
  roleColumn: {
    flex: 2,
  },
  capacityColumn: {
    flex: 1.5,
  },
  statusColumn: {
    flex: 1,
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    minWidth: 35,
  },
  performanceCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  performanceItem: {
    marginBottom: 16,
  },
  performanceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  performanceValue: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    textAlign: 'right',
  },
  activityList: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
});