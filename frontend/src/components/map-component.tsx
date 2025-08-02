"use client"

import { useEffect, useState, useRef, useCallback } from "react";
import Papa from "papaparse";
import dynamic from "next/dynamic";

// Dynamically import Leaflet components with ES module syntax
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const ZoomControl = dynamic(
  () => import("react-leaflet").then((mod) => mod.ZoomControl),
  { ssr: false }
);

// Define the type for our location data
interface LocationData {
  id: string;
  name: string;
  subcentre: string;
  latitude: number;
  longitude: number;
  altitude: number;
  precision: number;
  details?: Record<string, unknown>;
  selected?: boolean;
}

// Props for the MapComponent
interface MapComponentProps {
  csvUrl: string;
  onLocationsLoaded?: (locations: LocationData[]) => void;
  filteredLocations?: LocationData[];
  isFiltered?: boolean;
}

import { Icon } from "leaflet";
import type { Map as LeafletMap } from "leaflet";

export default function MapComponent({ csvUrl, onLocationsLoaded, filteredLocations, isFiltered }: MapComponentProps) {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [customIcon, setCustomIcon] = useState<Icon | null>(null);
  const mapRef = useRef<LeafletMap>(null);
  const LRef = useRef<typeof import("leaflet") | null>(null);
  // Update center coordinates to focus on Kotra region, Rajasthan, India
  const [center] = useState<[number, number]>([24.6339, 73.2496]);
  // Add a ref to track if data has been loaded
  const dataLoadedRef = useRef(false);

  // Load Leaflet and create custom icon
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Add Leaflet CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
      document.head.appendChild(link);
      
      // Import Leaflet using ES module syntax
      import("leaflet").then((L) => {
        LRef.current = L;
        // Create a custom marker icon for better visibility
        const defaultIcon = L.icon({
          iconUrl: "/marker-icon.png", // Using the marker icon from public directory
          iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
          iconSize: [30, 45], // Slightly larger for better visibility
          iconAnchor: [15, 45],
          popupAnchor: [0, -45],
          shadowSize: [41, 41],
        });
        setCustomIcon(defaultIcon);
        setMapReady(true);
      });
    }
  }, []);

  // Helper function to parse numbers from CSV strings
  const parseNumber = (str: string): number => {
    const cleaned = String(str).replace(/\s+/g, "");
    return Number.parseFloat(cleaned);
  };

  // Process CSV data to extract location information
  const processCSVData = useCallback((data: Array<Record<string, string>>): LocationData[] => {
    return data
      .map((item): LocationData | null => {
        // Skip header rows or invalid entries
        if (!item["SubCentr e Name_"] || item["SubCentr e Name_"] === "SubCentr e Name_") {
          return null;
        }
        
        console.log("Processing CSV row:", item);
        
        // First, handle the raw coordinate strings, which may contain line breaks or other issues
        const extractCleanCoordinate = (str: string): number => {
          if (!str) return 0;
          
          // Split by line breaks, commas, or spaces
          const parts = str.split(/[\n,\s]+/).filter(p => p.trim().length > 0);
          
          // Try to find a part that looks like a valid decimal coordinate
          for (const part of parts) {
            const num = parseFloat(part.trim());
            if (!isNaN(num) && num > 0) {
              return num;
            }
          }
          return 0;
        };
        
        // Get all possible coordinate sources
        const latSources = [
          item["_Geotag of SC_latitu de"] || "", 
          // Sometimes the second column contains both lat and long
          item["Geotag of SC"] || ""
        ];
        
        const lngSources = [
          item["_Geotag of SC_longitu de"] || "",
          // Sometimes the second column contains both lat and long
          item["Geotag of SC"] || ""
        ];
        
        // Extract possible lat/lng values from different fields
        const possibleLats: number[] = [];
        const possibleLngs: number[] = [];
        
        // Process each source for potential coordinates
        latSources.forEach(source => {
          const parts = source.split(/[\n,\s]+/).filter(p => p.trim().length > 0);
          parts.forEach(part => {
            const num = parseFloat(part.trim());
            if (!isNaN(num) && num > 0) {
              // Categorize by likely type (latitudes for India are ~20-30, longitudes ~70-80)
              if (num > 20 && num < 30) {
                possibleLats.push(num);
              } else if (num > 70 && num < 80) {
                possibleLngs.push(num);
              } else if (num > 0 && num < 10) {
                // Could be partial coordinates - ignore for now
              }
            }
          });
        });
        
        lngSources.forEach(source => {
          const parts = source.split(/[\n,\s]+/).filter(p => p.trim().length > 0);
          parts.forEach(part => {
            const num = parseFloat(part.trim());
            if (!isNaN(num) && num > 0) {
              // Categorize by likely type
              if (num > 70 && num < 80) {
                possibleLngs.push(num);
              } else if (num > 20 && num < 30) {
                possibleLats.push(num);
              }
            }
          });
        });
        
        // Try to determine the best lat/lng pair
        let lat = 0, lng = 0;
        
        // If we have possible values, use them
        if (possibleLats.length > 0) {
          lat = possibleLats[0]; // Use the first valid latitude
        }
        
        if (possibleLngs.length > 0) {
          lng = possibleLngs[0]; // Use the first valid longitude
        }
        
        // If we don't have good values yet, try a more direct approach
        if (lat === 0 || lng === 0) {
          // Direct parsing as fallback
          const rawLat = extractCleanCoordinate(item["_Geotag of SC_latitu de"] || "");
          const rawLng = extractCleanCoordinate(item["_Geotag of SC_longitu de"] || "");
          
          // If both are valid
          if (rawLat > 0 && rawLng > 0) {
            // Check if they're in reasonable ranges for India
            if (rawLat > 20 && rawLat < 30 && rawLng > 70 && rawLng < 80) {
              lat = rawLat;
              lng = rawLng;
            } 
            // Check if they're swapped
            else if (rawLat > 70 && rawLat < 80 && rawLng > 20 && rawLng < 30) {
              lat = rawLng;
              lng = rawLat;
            }
          }
        }
        
        // Ensure they're in the Kotra region range (Rajasthan, India)
        const isValidIndiaCoordinate = (lat: number, lng: number): boolean => {
          return lat >= 20 && lat <= 30 && lng >= 70 && lng <= 80;
        };
        
        if (!isValidIndiaCoordinate(lat, lng)) {
          console.warn(`Invalid coordinates outside India range: lat=${lat}, lng=${lng}`);
          
          // If we have one valid coordinate but not the other, try to estimate
          if (isValidIndiaCoordinate(lat, 73) && (lng < 70 || lng > 80)) {
            console.log(`Fixing longitude to Kotra region value for ${item["SubCentr e Name_"]}`);
            lng = 73.2; // Use a reasonable longitude for Kotra region
          } else if (isValidIndiaCoordinate(24, lng) && (lat < 20 || lat > 30)) {
            console.log(`Fixing latitude to Kotra region value for ${item["SubCentr e Name_"]}`);
            lat = 24.6; // Use a reasonable latitude for Kotra region
          } else if (lat === 0 || lng === 0 || !isValidIndiaCoordinate(lat, lng)) {
            // Last resort fallback - use coordinates for the Kotra region
            console.log(`Using fallback coordinates for ${item["SubCentr e Name_"]}`);
            lat = 24.6339; // Default Kotra region latitude
            lng = 73.2496; // Default Kotra region longitude
          }
        }
        
        console.log(`Final coordinates for ${item["SubCentr e Name_"]}: lat=${lat}, lng=${lng}`);
        
        // Skip if we still couldn't get valid coordinates
        if (lat === 0 || lng === 0) {
          console.error("Failed to get valid coordinates for", item["SubCentr e Name_"]);
          return null;
        }

        const altitude = parseNumber(item["_Geotag of SC_altitud e"] || "0");
        const precision = parseNumber(item["_Geotag of SC_precisi on"] || "0");

        return {
          id: `location-${Math.random().toString(36).slice(2)}`,
          name: item["Geotag of SC"] || "",
          subcentre: item["SubCentr e Name_"] || "",
          latitude: lat,
          longitude: lng,
          altitude: altitude,
          precision: precision,
          details: item as Record<string, unknown>
        };
      })
      .filter((location): location is LocationData => location !== null);
  }, []);

  // Fetch and parse CSV data
  useEffect(() => {
    // Skip if data has already been loaded
    if (typeof window !== "undefined" && !dataLoadedRef.current) {
      const fetchData = async () => {
        try {
          setLoading(true);
          // Make sure we're using the correct path format
          const url = csvUrl.startsWith('/') ? csvUrl : `/${csvUrl}`;
          console.log("Fetching CSV from:", url);
          
          // Fetch CSV data
          const response = await fetch(url);
          const csvText = await response.text();
          Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              console.log("CSV parsed successfully, first row:", results.data[0]);
              const parsedData = results.data as Array<Record<string, string>>;
              const locationData = processCSVData(parsedData);
              setLocations(locationData);
              if (onLocationsLoaded) {
                onLocationsLoaded(locationData);
              }
              setLoading(false);
              // Mark data as loaded
              dataLoadedRef.current = true;
            },
            error: (error: Error) => {
              console.error("Error parsing CSV:", error);
              setError("Failed to parse CSV data");
              setLoading(false);
            },
          });
        } catch (err) {
          console.error("Error fetching CSV:", err);
          setError(`Failed to fetch CSV data: ${err instanceof Error ? err.message : String(err)}`);
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [csvUrl, onLocationsLoaded, processCSVData]);

  // Adjust map view to fit all markers
  useEffect(() => {
    if (mapRef.current && LRef.current && locations.length > 0) {
      const locationsToFit = isFiltered && filteredLocations && filteredLocations.length > 0 
        ? filteredLocations 
        : locations;
        
      if (locationsToFit.length === 1) {
        // If there's only one location (filtered view), center and zoom to it
        const loc = locationsToFit[0];
        mapRef.current.setView([loc.latitude, loc.longitude], 13);
      } else {
        // Fit bounds to show all markers
        const bounds = LRef.current.latLngBounds(
          locationsToFit.map((loc) => LRef.current!.latLng(loc.latitude, loc.longitude))
        );
        mapRef.current.fitBounds(bounds);
      }
    }
  }, [locations, filteredLocations, isFiltered]);

  if (!mapReady) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-amber-500">No valid location data found in the CSV file.</div>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={9}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      {(isFiltered && filteredLocations ? filteredLocations : locations).map((location) => (
        <Marker 
          key={location.id} 
          position={[location.latitude, location.longitude]} 
          icon={customIcon || undefined}
          eventHandlers={{
            click: () => {
              if (onLocationsLoaded) {
                // This will highlight the location in the side panel when marker is clicked
                onLocationsLoaded(locations.map(loc => 
                  loc.id === location.id 
                    ? { ...loc, selected: true } 
                    : { ...loc, selected: false }
                ));
              }
            }
          }}
        >
          <Popup>
            <div className="p-2 max-w-xs">
              <h3 className="text-lg font-bold text-blue-700">{location.name}</h3>
              <h4 className="text-md font-semibold text-gray-700 mb-2">{location.subcentre}</h4>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <p className="col-span-2 bg-gray-100 p-1 rounded">
                  <strong>Coordinates:</strong> {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </p>
                <p className="bg-gray-100 p-1 rounded">
                  <strong>Altitude:</strong> {location.altitude.toFixed(1)} m
                </p>
                <p className="bg-gray-100 p-1 rounded">
                  <strong>Precision:</strong> {location.precision.toFixed(1)} m
                </p>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Click on this marker to highlight in the side panel
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
