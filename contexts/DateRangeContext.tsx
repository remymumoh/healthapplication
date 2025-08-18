import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DateRange {
    startDate: Date;
    endDate: Date;
    label: string;
}

interface DateRangeContextType {
    selectedDateRange: DateRange;
    setSelectedDateRange: (range: DateRange) => void;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

export function DateRangeProvider({ children }: { children: ReactNode }) {
    const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        label: `${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
    });

    return (
        <DateRangeContext.Provider value={{ selectedDateRange, setSelectedDateRange }}>
            {children}
        </DateRangeContext.Provider>
    );
}

export function useDateRange() {
    const context = useContext(DateRangeContext);
    if (context === undefined) {
        throw new Error('useDateRange must be used within a DateRangeProvider');
    }
    return context;
}