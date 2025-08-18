import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native"
import { MapPin, Building2, X, ChartBar as BarChart3, Activity, Heart, Settings, User, FileText, Shield, CircleHelp as HelpCircle, Info, LogOut, ChevronRight, Search, ChevronDown, ChevronUp } from "lucide-react-native"
import { useState, useMemo } from "react"
import type { County, Facility, CategoryType } from "@/types"

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
  selectedCategory,
  onSelectCounty,
  onSelectFacility,
  onSelectCategory,
  loading,
  isVisible,
  onClose,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCounties, setExpandedCounties] = useState<Set<string>>(new Set())

  if (!isVisible) return null

  const handleCategorySelect = (category: CategoryType) => {
    onSelectCategory(category)
    // Auto-close sidebar on mobile after selection
    onClose()
  }

  const handleCountySelect = (countyId: string | null) => {
    onSelectCounty(countyId)
    // Clear search when selecting a county
    setSearchQuery("")
    // Don't auto-close when selecting county, user might want to select facility
  }

  const handleFacilitySelect = (facilityId: string | null) => {
    onSelectFacility(facilityId)
    // Auto-close sidebar after facility selection
    onClose()
  }

  const toggleCountyExpansion = (countyId: string) => {
    const newExpanded = new Set(expandedCounties)
    if (newExpanded.has(countyId)) {
      newExpanded.delete(countyId)
    } else {
      newExpanded.add(countyId)
    }
    setExpandedCounties(newExpanded)
  }

  // Filter counties and facilities based on search query
  const filteredCounties = useMemo(() => {
    if (!searchQuery.trim()) return counties
    return counties.filter(county => 
      county.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      county.code.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [counties, searchQuery])

  const filteredFacilities = useMemo(() => {
    if (!searchQuery.trim()) return facilities
    return facilities.filter(facility => 
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [facilities, searchQuery])

  // Get facilities for a specific county
  const getFacilitiesForCounty = (countyId: string) => {
    return filteredFacilities.filter(facility => facility.county === countyId)
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Healthcare Dashboard</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={16} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search counties or facilities..."
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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Main Navigation */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleCategorySelect("hts")}>
            <Activity size={20} color="#374151" style={styles.menuIcon} />
            <Text style={[styles.menuText, selectedCategory === "hts" && styles.activeMenuText]}>HTS Services</Text>
            {selectedCategory === "hts" && <View style={styles.activeDot} />}
            <ChevronRight size={16} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => handleCategorySelect("care-treatment")}>
            <Heart size={20} color="#374151" style={styles.menuIcon} />
            <Text style={[styles.menuText, selectedCategory === "care-treatment" && styles.activeMenuText]}>
              Care & Treatment
            </Text>
            {selectedCategory === "care-treatment" && <View style={styles.activeDot} />}
            <ChevronRight size={16} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <BarChart3 size={20} color="#374151" style={styles.menuIcon} />
            <Text style={styles.menuText}>Dashboard Overview</Text>
            <ChevronRight size={16} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <FileText size={20} color="#374151" style={styles.menuIcon} />
            <Text style={styles.menuText}>Reports</Text>
            <ChevronRight size={16} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>

          <TouchableOpacity style={styles.menuItem} onPress={() => handleCountySelect(null)}>
            <MapPin size={20} color="#374151" style={styles.menuIcon} />
            <Text style={[styles.menuText, !selectedCounty && styles.activeMenuText]}>All Counties</Text>
            {!selectedCounty && <View style={styles.activeDot} />}
          </TouchableOpacity>

          {filteredCounties.map((county) => {
            const countyFacilities = getFacilitiesForCounty(county.id)
            const isExpanded = expandedCounties.has(county.id)
            const isSelected = selectedCounty === county.id

            return (
              <View key={county.id}>
                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={() => {
                    handleCountySelect(county.id)
                    if (countyFacilities.length > 0) {
                      toggleCountyExpansion(county.id)
                    }
                  }}
                >
                  <MapPin size={20} color="#374151" style={styles.menuIcon} />
                  <View style={styles.menuContent}>
                    <Text style={[styles.menuText, isSelected && styles.activeMenuText]}>
                      {county.name}
                    </Text>
                    <Text style={styles.countyCode}>
                      {county.code} • {countyFacilities.length} facilities
                    </Text>
                  </View>
                  {isSelected && <View style={styles.activeDot} />}
                  {countyFacilities.length > 0 && (
                    <TouchableOpacity 
                      onPress={() => toggleCountyExpansion(county.id)}
                      style={styles.expandButton}
                    >
                      {isExpanded ? (
                        <ChevronUp size={16} color="#9ca3af" />
                      ) : (
                        <ChevronDown size={16} color="#9ca3af" />
                      )}
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>

                {/* Facilities for this county */}
                {isExpanded && countyFacilities.length > 0 && (
                  <View style={styles.facilitiesContainer}>
                    <TouchableOpacity 
                      style={styles.facilityItem} 
                      onPress={() => handleFacilitySelect(null)}
                    >
                      <Building2 size={18} color="#6b7280" style={styles.facilityIcon} />
                      <Text style={[styles.facilityText, !selectedFacility && styles.activeFacilityText]}>
                        All Facilities
                      </Text>
                      {!selectedFacility && <View style={styles.activeDot} />}
                    </TouchableOpacity>

                    {countyFacilities.map((facility) => (
                      <TouchableOpacity
                        key={facility.id}
                        style={styles.facilityItem}
                        onPress={() => handleFacilitySelect(facility.id)}
                      >
                        <Building2 size={18} color="#6b7280" style={styles.facilityIcon} />
                        <View style={styles.facilityContent}>
                          <Text style={[
                            styles.facilityText, 
                            selectedFacility === facility.id && styles.activeFacilityText
                          ]}>
                            {facility.name}
                          </Text>
                          <Text style={styles.facilityType}>{facility.type}</Text>
                        </View>
                        {selectedFacility === facility.id && <View style={styles.activeDot} />}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )
          })}

          {/* Show loading state for facilities */}
          {loading && selectedCounty && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading facilities...</Text>
            </View>
          )}

          {/* Show empty state when no results found */}
          {searchQuery.length > 0 && filteredCounties.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No counties found for "{searchQuery}"</Text>
            </View>
          )}
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.menuItem}>
            <User size={20} color="#374151" style={styles.menuIcon} />
            <Text style={styles.menuText}>Profile</Text>
            <ChevronRight size={16} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <FileText size={20} color="#374151" style={styles.menuIcon} />
            <Text style={styles.menuText}>Export Data</Text>
            <ChevronRight size={16} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Settings size={20} color="#374151" style={styles.menuIcon} />
            <Text style={styles.menuText}>Preferences</Text>
            <ChevronRight size={16} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Shield size={20} color="#374151" style={styles.menuIcon} />
            <Text style={styles.menuText}>Privacy Policy</Text>
            <ChevronRight size={16} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Shield size={20} color="#374151" style={styles.menuIcon} />
            <Text style={styles.menuText}>Data Protection</Text>
            <ChevronRight size={16} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* More Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More</Text>

          <TouchableOpacity style={styles.menuItem}>
            <HelpCircle size={20} color="#374151" style={styles.menuIcon} />
            <Text style={styles.menuText}>Help & Support</Text>
            <ChevronRight size={16} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Info size={20} color="#374151" style={styles.menuIcon} />
            <Text style={styles.menuText}>About</Text>
            <ChevronRight size={16} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <LogOut size={20} color="#374151" style={styles.menuIcon} />
            <Text style={styles.menuText}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    backgroundColor: "#ffffff",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
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
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "#ffffff",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#374151",
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#111827",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#f9fafb",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    position: "relative",
  },
  menuIcon: {
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#374151",
    flex: 1,
  },
  activeMenuText: {
    color: "#3b82f6",
    fontFamily: "Inter-Medium",
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3b82f6",
    marginRight: 8,
  },
  countyCode: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#9ca3af",
    marginTop: 2,
  },
  expandButton: {
    padding: 4,
    marginLeft: 8,
  },
  facilitiesContainer: {
    backgroundColor: "#f9fafb",
    marginLeft: 20,
    borderLeftWidth: 2,
    borderLeftColor: "#e5e7eb",
  },
  facilityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingLeft: 20,
    position: "relative",
  },
  facilityIcon: {
    marginRight: 12,
  },
  facilityContent: {
    flex: 1,
  },
  facilityText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#6b7280",
  },
  activeFacilityText: {
    color: "#3b82f6",
    fontFamily: "Inter-Medium",
  },
  facilityType: {
    fontSize: 11,
    fontFamily: "Inter-Regular",
    color: "#9ca3af",
    marginTop: 2,
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