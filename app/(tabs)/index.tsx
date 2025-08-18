import React, { useState, useEffect } from "react"
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { TopBar } from "@/components/TopBar"
import { FilterSidebar } from "@/components/FilterSidebar"
import { MainContent } from "@/components/MainContent"
import { useDataStore } from "@/hooks/useDataStore"

const { width } = Dimensions.get("window")
const isLargeScreen = width > 1024

export default function DashboardScreen() {
    const { counties, facilities, dashboardCards, loading, filterState, selectCounty, selectFacility, setCategory } =
        useDataStore()

    const [showSidebar, setShowSidebar] = useState(false)

    useEffect(() => {
        if (filterState.category !== "dashboard") {
            setCategory("dashboard")
        }
    }, [filterState.category, setCategory])

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar)
    }

    const closeSidebar = () => {
        setShowSidebar(false)
    }

    const getActiveFiltersCount = () => {
        let count = 0
        if (filterState.selectedCounty) count++
        if (filterState.selectedFacility) count++
        return count
    }

    const getTopBarTitle = () => {
        if (filterState.selectedFacility) {
            const facility = facilities.find((f) => f.id === filterState.selectedFacility)
            return facility ? facility.name : "Healthcare Dashboard"
        }

        if (filterState.selectedCounty) {
            const county = counties.find((c) => c.id === filterState.selectedCounty)
            return county ? `${county.name} County` : "Healthcare Dashboard"
        }

        return "Healthcare Dashboard"
    }

    const getTopBarSubtitle = () => {
        return "OPD, IPD, TB & STI Services Overview"
    }

    return (
        <SafeAreaView style={styles.container}>
            <TopBar
                title={getTopBarTitle()}
                subtitle={getTopBarSubtitle()}
                onToggleSidebar={toggleSidebar}
                activeFiltersCount={getActiveFiltersCount()}
            />

            <View style={styles.content}>
                <FilterSidebar
                    counties={counties}
                    facilities={facilities}
                    selectedCounty={filterState.selectedCounty}
                    selectedFacility={filterState.selectedFacility}
                    selectedCategory={filterState.category}
                    onSelectCounty={selectCounty}
                    onSelectFacility={selectFacility}
                    onSelectCategory={setCategory}
                    loading={loading}
                    isVisible={showSidebar}
                    onClose={closeSidebar}
                />

                <MainContent
                    category={filterState.category}
                    selectedCounty={filterState.selectedCounty}
                    selectedFacility={filterState.selectedFacility}
                    counties={counties}
                    facilities={facilities}
                    dashboardCards={dashboardCards}
                    loading={loading}
                />
            </View>

            {/* Overlay for mobile when sidebar is open */}
            {showSidebar && (
                <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeSidebar} />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9fafb",
    },
    content: {
        flex: 1,
        flexDirection: "row",
        position: "relative",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 10,
    },
})