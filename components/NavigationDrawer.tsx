import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Facility, County } from '@/types';

interface Props {
    isOpen: boolean;
    onToggle: () => void;
    onFacilitySelect: (facility: Facility, county: County) => void;
    selectedFacility: Facility | null;
    children: React.ReactNode;
}

export default function NavigationDrawer({
                                             isOpen,
                                             onToggle,
                                             onFacilitySelect,
                                             selectedFacility,
                                             children
                                         }: Props) {
    return (
        <View style={styles.container}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});