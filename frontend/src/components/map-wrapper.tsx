"use client"

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Define the LocationData interface
interface LocationData {
  id: string;
  name: string;
  subcentre: string;
  latitude: number;
  longitude: number;
  altitude: number;
  precision: number;
  details?: Record<string, unknown>;
}

// Dynamically import the MapComponent with SSR disabled
const MapComponent = dynamic(() => import('@/components/map-component'), {
  loading: () => (
    <div className="flex items-center justify-center h-[80vh] border rounded-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  ),
  ssr: false,
});

interface MapWrapperProps {
  csvUrl: string;
}

export default function MapWrapper({ csvUrl }: MapWrapperProps) {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<LocationData[]>([]);
  const [_selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [isFiltered, setIsFiltered] = useState(false);

  const handleLocationsLoaded = (loadedLocations: LocationData[]) => {
    setLocations(loadedLocations);
    if (!isFiltered) {
      setFilteredLocations(loadedLocations);
    }
  };

  const _handleSelectLocation = (location: LocationData) => {
    setSelectedLocation(location);
    // Add logic to center map on selected location if needed
  };

  const _handleFilterMap = (location: LocationData) => {
    setFilteredLocations([location]);
    setSelectedLocation(location);
    setIsFiltered(true);
  };

  const _handleResetFilter = () => {
    setFilteredLocations(locations);
    setIsFiltered(false);
  };

  return (
    <div className="relative h-full w-full">
      <MapComponent 
        csvUrl={csvUrl} 
        onLocationsLoaded={handleLocationsLoaded}
        filteredLocations={filteredLocations}
        isFiltered={isFiltered} 
      />
    </div>
  );
}
