"use client"

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Navigation, Search, X } from 'lucide-react';

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

interface LocationMapPickerProps {
    latitude: number;
    longitude: number;
    onLocationSelect: (lat: number, lng: number, address?: string) => void;
    height?: string;
    showNearbyIssues?: boolean;
    nearbyIssues?: Array<{
        id: string;
        title: string;
        latitude: number;
        longitude: number;
        status?: string;
    }>;
}

export default function LocationMapPicker({
    latitude,
    longitude,
    onLocationSelect,
    height = "400px",
    showNearbyIssues = false,
    nearbyIssues = []
}: LocationMapPickerProps) {
    const [mapReady, setMapReady] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(
        latitude && longitude ? [latitude, longitude] : null
    );
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [currentAddress, setCurrentAddress] = useState('');
    const mapRef = useRef<any>(null);
    const LRef = useRef<typeof import("leaflet") | null>(null);

    // Default center - you can adjust this to your preferred location
    const defaultCenter: [number, number] = [24.6339, 73.2496]; // Kotra, Rajasthan

    // Load Leaflet and create custom icon
    useEffect(() => {
        if (typeof window !== "undefined") {
            // Add Leaflet CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
            if (!document.querySelector(`link[href="${link.href}"]`)) {
                document.head.appendChild(link);
            }

            // Import Leaflet
            import("leaflet").then((L) => {
                LRef.current = L;
                setMapReady(true);
            });
        }
    }, []);

    // Update selected position when props change
    useEffect(() => {
        if (latitude && longitude) {
            setSelectedPosition([latitude, longitude]);
        }
    }, [latitude, longitude]);

    // Reverse geocoding function
    const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
            );
            const data = await response.json();
            const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            setCurrentAddress(address);
            return address;
        } catch (error) {
            console.error('Reverse geocoding failed:', error);
            const fallbackAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            setCurrentAddress(fallbackAddress);
            return fallbackAddress;
        }
    };

    // Forward geocoding (search) function
    const searchLocation = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
            );
            const data = await response.json();
            setSearchResults(data);
            setShowSearchResults(data.length > 0);
        } catch (error) {
            console.error('Location search failed:', error);
            setSearchResults([]);
            setShowSearchResults(false);
        } finally {
            setIsSearching(false);
        }
    };

    // Handle search result selection
    const handleSearchResultSelect = (result: any) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        setSelectedPosition([lat, lng]);
        setCurrentAddress(result.display_name);
        setSearchQuery(result.display_name);
        setShowSearchResults(false);

        // Center map on selected location
        if (mapRef.current) {
            mapRef.current.setView([lat, lng], 16);
        }

        onLocationSelect(lat, lng, result.display_name);
    };

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery && searchQuery !== currentAddress) {
                searchLocation(searchQuery);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, currentAddress]);

    // Get current location
    const getCurrentLocation = () => {
        setIsGettingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude: lat, longitude: lng } = position.coords;
                    setSelectedPosition([lat, lng]);

                    // Center map on current location
                    if (mapRef.current) {
                        mapRef.current.setView([lat, lng], 16);
                    }

                    // Reverse geocode and notify parent
                    reverseGeocode(lat, lng).then((address) => {
                        onLocationSelect(lat, lng, address);
                    });

                    setIsGettingLocation(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to get your current location. Please click on the map to select a location.');
                    setIsGettingLocation(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
            setIsGettingLocation(false);
        }
    };

    // Map event handler effect
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const handleMapClick = (e: any) => {
            const { lat, lng } = e.latlng;
            setSelectedPosition([lat, lng]);

            // Reverse geocode to get address
            reverseGeocode(lat, lng).then((address) => {
                onLocationSelect(lat, lng, address);
            });
        };

        map.on('click', handleMapClick);

        return () => {
            map.off('click', handleMapClick);
        };
    }, [onLocationSelect]);

    if (!mapReady) {
        return (
            <div className="flex items-center justify-center bg-gray-100 rounded-xl" style={{ height }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mx-auto mb-2"></div>
                    <p className="text-text-secondary text-sm">Loading map...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search bar for location */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search for a location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-10 border border-glass-border rounded-xl focus:ring-2 focus:ring-accent-primary focus:border-accent-primary"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Search className="h-5 w-5 text-text-secondary" />
                </div>
                {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-primary"></div>
                    </div>
                )}

                {/* Search results dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-glass-border rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                        {searchResults.map((result, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleSearchResultSelect(result)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                            >
                                <div className="font-medium text-text-primary">{result.display_name}</div>
                                <div className="text-sm text-text-secondary">{result.lat}, {result.lon}</div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Map controls */}
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-text-secondary">
                        Click on the map to select a location or search above
                    </p>
                    {selectedPosition && (
                        <p className="text-xs text-text-secondary mt-1">
                            💡 Click anywhere to change the location
                        </p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Navigation className="h-4 w-4" />
                    {isGettingLocation ? 'Getting location...' : 'Use my location'}
                </button>
            </div>

            {/* Map container */}
            <div className="relative rounded-xl overflow-hidden border border-glass-border">
                <div style={{ height }}>
                    <MapContainer
                        center={selectedPosition || defaultCenter}
                        zoom={selectedPosition ? 16 : 13}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={true}
                        ref={mapRef}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {selectedPosition && (
                            <Marker
                                position={selectedPosition}
                                icon={LRef.current?.divIcon({
                                    className: 'selected-location-icon',
                                    html: `
                                        <div style="
                                            background: linear-gradient(135deg, #3b82f6, #10b981);
                                            width: 32px;
                                            height: 32px;
                                            border-radius: 50%;
                                            border: 3px solid white;
                                            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            animation: selectedLocationPulse 2s infinite;
                                        ">
                                            <div style="
                                                color: white;
                                                font-size: 14px;
                                                font-weight: bold;
                                            ">📍</div>
                                        </div>
                                        <style>
                                            @keyframes selectedLocationPulse {
                                                0%, 100% { transform: scale(1); }
                                                50% { transform: scale(1.1); }
                                            }
                                        </style>
                                    `,
                                    iconSize: [32, 32],
                                    iconAnchor: [16, 16],
                                    popupAnchor: [0, -16],
                                }) || undefined}
                            >
                                <Popup>
                                    <div className="text-center min-w-[200px]">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <MapPin className="h-4 w-4 text-accent-primary" />
                                            <p className="font-semibold text-gray-800">Selected Location</p>
                                        </div>
                                        {currentAddress && (
                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{currentAddress}</p>
                                        )}
                                        <p className="text-xs text-gray-500 font-mono bg-gray-100 rounded px-2 py-1">
                                            {selectedPosition[0].toFixed(6)}, {selectedPosition[1].toFixed(6)}
                                        </p>
                                        <div className="mt-2 text-xs text-green-600 font-medium">
                                            ✓ Location confirmed for issue report
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        )}

                        {/* Show nearby issues if enabled */}
                        {showNearbyIssues && nearbyIssues.map((issue) => (
                            <Marker
                                key={`nearby-${issue.id}`}
                                position={[issue.latitude, issue.longitude]}
                                icon={LRef.current?.divIcon({
                                    className: 'nearby-issue-icon',
                                    html: `
                                        <div style="
                                            background-color: #f59e0b;
                                            width: 20px;
                                            height: 20px;
                                            border-radius: 50%;
                                            border: 2px solid white;
                                            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                                            opacity: 0.7;
                                        "></div>
                                    `,
                                    iconSize: [20, 20],
                                    iconAnchor: [10, 10],
                                    popupAnchor: [0, -10],
                                }) || undefined}
                            >
                                <Popup>
                                    <div className="min-w-[180px]">
                                        <p className="font-medium text-gray-800 text-sm mb-1">Existing Issue Nearby</p>
                                        <p className="text-xs text-gray-600 mb-2">{issue.title}</p>
                                        <p className="text-xs text-orange-600">
                                            Similar issue already reported in this area
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>

            {/* Selected location info */}
            {selectedPosition && (
                <div className="p-4 bg-glass-bg border border-glass-border rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-accent-primary" />
                        <span className="font-medium text-text-primary">Selected Location</span>
                    </div>

                    {currentAddress && (
                        <div className="mb-3 p-3 bg-white/50 rounded-lg">
                            <p className="text-sm font-medium text-text-primary">Address:</p>
                            <p className="text-sm text-text-secondary">{currentAddress}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div className="p-2 bg-white/30 rounded">
                            <p className="font-medium text-text-primary">Latitude:</p>
                            <p className="text-text-secondary font-mono">{selectedPosition[0].toFixed(6)}</p>
                        </div>
                        <div className="p-2 bg-white/30 rounded">
                            <p className="font-medium text-text-primary">Longitude:</p>
                            <p className="text-text-secondary font-mono">{selectedPosition[1].toFixed(6)}</p>
                        </div>
                    </div>

                    {/* Nearby issues warning */}
                    {showNearbyIssues && nearbyIssues.length > 0 && (
                        <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                                <p className="text-sm font-medium text-orange-700">
                                    {nearbyIssues.length} existing issue{nearbyIssues.length > 1 ? 's' : ''} nearby
                                </p>
                            </div>
                            <p className="text-xs text-orange-600">
                                Check if your issue is already reported before submitting
                            </p>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600 font-medium">Location confirmed</span>
                    </div>
                </div>
            )}
        </div>
    );
}
