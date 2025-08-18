import { useEffect } from 'react';

export function useFrameworkReady() {
    useEffect(() => {
        // React Native doesn't have a window object
        // Add any framework initialization logic here if needed
        console.log('Framework ready');
    }, []); // Don't forget the dependency array
}