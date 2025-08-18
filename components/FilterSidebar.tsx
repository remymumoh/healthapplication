import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native"
import { MapPin, Building2, X, Search, ChevronRight, Calendar } from "lucide-react-native"
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MapPin size={24} color="#ffffff" />
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

      {/* Date Range Selector */}
      <View style={styles.dateSection}>
        <CalendarFilter />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={16} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search counties..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={16} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
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
                  <View style={styles.countyIcon}>
                    <MapPin size={20} color="#3b82f6" />
                  </View>
                  <View style={styles.countyContent}>
                    <Text style={styles.countyName}>{county.name}</Text>
                    <Text style={styles.facilityCount}>
                      {countyFacilities.length} facilities
                    </Text>
                  </View>
                  <ChevronRight 
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
                      countyFacilities.map((facility) => (
                        <TouchableOpacity
                          key={facility.id}
                          style={[
                            styles.facilityItem,
                            selectedFacility === facility.id && styles.facilityItemSelected
                          ]}
                          onPress={() => handleFacilitySelect(facility)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.facilityIcon}>
                            <Building2 size={16} color="#6b7280" />
                          </View>
                          <View style={styles.facilityContent}>
                            <Text style={[
                              styles.facilityName,
                              selectedFacility === facility.id && styles.facilityNameSelected
                            ]}>
                              {facility.name}
                            </Text>
                            <Text style={styles.facilityType}>{facility.type}</Text>
                          </View>
                          {selectedFacility === facility.id && (
                            <View style={styles.selectedIndicator} />
                          )}
                        </TouchableOpacity>
                      ))
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
    width: 320,
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
    backgroundColor: "#3b82f6",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#bfdbfe",
  },
  closeButton: {
    padding: 4,
  },
  dateSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "#ffffff",
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "#ffffff",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#374151",
    paddingVertical: 2,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  countiesList: {
    padding: 16,
  },
  countyContainer: {
    marginBottom: 8,
  },
  countyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
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
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  countyIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#eff6ff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  countyContent: {
    flex: 1,
  },
  countyName: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#111827",
    marginBottom: 2,
  },
  facilityCount: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "#6b7280",
  },
  chevron: {
    marginLeft: 8,
  },
  chevronExpanded: {
    transform: [{ rotate: "90deg" }],
  },
  facilitiesContainer: {
    marginTop: 8,
    marginLeft: 52,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    overflow: "hidden",
  },
  facilityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  facilityItemSelected: {
    backgroundColor: "#eff6ff",
  },
  facilityIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  facilityContent: {
    flex: 1,
  },
  facilityName: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#374151",
    marginBottom: 2,
  },
  facilityNameSelected: {
    color: "#3b82f6",
  },
  facilityType: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#9ca3af",
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    backgroundColor: "#3b82f6",
    borderRadius: 4,
    marginLeft: 8,
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