import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native"
import { MapPin, Building2, X, Search, ChevronRight, Calendar, Users, Activity, ChevronDown } from "lucide-react-native"
import { useState, useMemo } from "react"
import type { County, Facility, CategoryType } from "@/types"
import CalendarFilter from "./CalendarFilter"

interface Props {
  counties: County[]
  facilities: Facility[]
  selectedCounty: string | null
  selectedFacility: string | null
  selectedCategory: CategoryType
  onSelectCounty: (countyId: string | null) => void
  onSelectFacility: (facilityId: string | null) => void
  onSelectCategory: (category: CategoryType) => void
  loading: boolean
  isVisible: boolean
  onClose: () => void
}

export function FilterSidebar({
  counties,
  facilities,
  selectedCounty,
  selectedFacility,
  onSelectCounty,
  onSelectFacility,
  loading,
  isVisible,
  onClose,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCounty, setExpandedCounty] = useState<string | null>(null)

  // Filter counties based on search query
  const filteredCounties = useMemo(() => {
    if (!searchQuery.trim()) return counties
    return counties.filter(county => 
      county.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [counties, searchQuery])

  // Get facilities for a specific county
  const getFacilitiesForCounty = (countyId: string) => {
    return facilities.filter(facility => facility.county === countyId)
  }

  if (!isVisible) return null

  const handleCountySelect = (county: County) => {
    if (expandedCounty === county.id) {
      // If clicking on already expanded county, collapse it
      setExpandedCounty(null)
      onSelectCounty(null)
    } else {
      // Expand the county and load its facilities
      setExpandedCounty(county.id)
      onSelectCounty(county.id)
    }
  }

  const handleFacilitySelect = (facility: Facility) => {
    onSelectFacility(facility.id)
    onClose() // Close drawer after facility selection
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  const getFacilityIcon = (type: string) => {
    if (type.toLowerCase().includes('kp')) {
      return { icon: Building2, color: '#a855f7', bgColor: '#f3e8ff' }
    }
    return { icon: Building2, color: '#f97316', bgColor: '#fed7aa' }
  }

  const generateMockStats = () => {
    return {
      patients: Math.floor(Math.random() * 2000) + 500,
      tests: Math.floor(Math.random() * 1000) + 200
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <MapPin size={24} color="#ffffff" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Healthcare Facilities</Text>
            <Text style={styles.headerSubtitle}>Browse by location</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Counties List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.countiesList}>
          {filteredCounties.map((county) => {
            const countyFacilities = getFacilitiesForCounty(county.id)
            const isExpanded = expandedCounty === county.id

            return (
              <View key={county.id} style={styles.countyContainer}>
                {/* County Item */}
                <TouchableOpacity
                  style={[
                    styles.countyItem,
                    isExpanded && styles.countyItemExpanded
                  ]}
                  onPress={() => handleCountySelect(county)}
                  activeOpacity={0.7}
                >
                  <View style={styles.countyIconContainer}>
                    <MapPin size={20} color="#4f46e5" />
                  </View>
                  <View style={styles.countyContent}>
                    <Text style={styles.countyName}>{county.name}</Text>
                    <Text style={styles.facilityCount}>
                      {county.facilityCount || countyFacilities.length} facilities
                    </Text>
                  </View>
                  <ChevronDown 
                    size={20} 
                    color="#9ca3af" 
                    style={[
                      styles.chevron,
                      isExpanded && styles.chevronExpanded
                    ]} 
                  />
                </TouchableOpacity>

                {/* Facilities List */}
                {isExpanded && (
                  <View style={styles.facilitiesContainer}>
                    {loading ? (
                      <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading facilities...</Text>
                      </View>
                    ) : countyFacilities.length > 0 ? (
                      countyFacilities.map((facility) => {
                        const facilityIcon = getFacilityIcon(facility.type)
                        const stats = generateMockStats()
                        
                        return (
                          <TouchableOpacity
                            key={facility.id}
                            style={[
                              styles.facilityCard,
                              selectedFacility === facility.id && styles.facilityCardSelected
                            ]}
                            onPress={() => handleFacilitySelect(facility)}
                            activeOpacity={0.7}
                          >
                            <View style={styles.facilityHeader}>
                              <View style={[styles.facilityIconContainer, { backgroundColor: facilityIcon.bgColor }]}>
                                <facilityIcon.icon size={20} color={facilityIcon.color} />
                              </View>
                              <View style={styles.facilityInfo}>
                                <Text style={styles.facilityName} numberOfLines={2}>
                                  {facility.name}
                                </Text>
                                <View style={styles.facilityMeta}>
                                  <Text style={styles.facilityType}>
                                    {facility.type}
                                  </Text>
                                  <Text style={styles.facilityProgram}>
                                    • {facility.program || 'N/A'}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            
                            <View style={styles.facilityStats}>
                              <View style={styles.statItem}>
                                <Users size={14} color="#6b7280" />
                                <Text style={styles.statValue}>{stats.patients.toLocaleString()}</Text>
                              </View>
                              <View style={styles.statItem}>
                                <Activity size={14} color="#6b7280" />
                                <Text style={styles.statValue}>{stats.tests.toLocaleString()}</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        )
                      })
                    ) : (
                      <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No facilities found</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            )
          })}

          {/* Show empty state when no results found */}
          {searchQuery.length > 0 && filteredCounties.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No counties found for "{searchQuery}"</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 380,
    backgroundColor: "#ffffff",
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 24,
    backgroundColor: "#4f46e5",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerIcon: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "rgba(255, 255, 255, 0.8)",
  },
  closeButton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  countiesList: {
    padding: 16,
  },
  countyContainer: {
    marginBottom: 12,
  },
  countyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  countyItemExpanded: {
    borderColor: "#4f46e5",
    backgroundColor: "#f8faff",
  },
  countyIconContainer: {
    width: 44,
    height: 44,
    backgroundColor: "#eef2ff",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  countyContent: {
    flex: 1,
  },
  countyName: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: "#1e293b",
    marginBottom: 2,
  },
  facilityCount: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#64748b",
  },
  chevron: {
    marginLeft: 8,
    transform: [{ rotate: "0deg" }],
  },
  chevronExpanded: {
    transform: [{ rotate: "180deg" }],
  },
  facilitiesContainer: {
    marginTop: 8,
    paddingLeft: 8,
    gap: 8,
  },
  facilityCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  facilityCardSelected: {
    borderColor: "#4f46e5",
    backgroundColor: "#f8faff",
  },
  facilityHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  facilityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  facilityInfo: {
    flex: 1,
  },
  facilityName: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#1e293b",
    marginBottom: 4,
    lineHeight: 20,
  },
  facilityMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  facilityType: {
    fontSize: 13,
    fontFamily: "Inter-Medium",
    color: "#f97316",
  },
  facilityProgram: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "#64748b",
    marginLeft: 4,
  },
  facilityStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: "center",
  },
  statValue: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#374151",
    marginLeft: 6,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#6b7280",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#6b7280",
    textAlign: "center",
  },
})