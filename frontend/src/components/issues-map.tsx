"use client"

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Issue } from "../types/database";

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

import { Icon, DivIcon } from "leaflet";
import type { Map as LeafletMap } from "leaflet";

interface IssuesMapProps {
    issues: Issue[];
    onIssueSelect?: (issue: Issue) => void;
}

export default function IssuesMap({ issues, onIssueSelect }: IssuesMapProps) {
    const [mapReady, setMapReady] = useState(false);
    const [customIcons, setCustomIcons] = useState<{ [key: string]: DivIcon }>({});
    const mapRef = useRef<LeafletMap>(null);
    const LRef = useRef<typeof import("leaflet") | null>(null);

    // Default center (can be adjusted based on your location)
    const [center] = useState<[number, number]>([24.6339, 73.2496]);

    // Load Leaflet and create custom icons
    useEffect(() => {
        if (typeof window !== "undefined") {
            // Add Leaflet CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
            if (!document.querySelector(`link[href="${link.href}"]`)) {
                document.head.appendChild(link);
            }

            // Import Leaflet using ES module syntax
            import("leaflet").then((L) => {
                LRef.current = L;

                // Create custom icons for different issue statuses
                const createIcon = (color: string, emoji: string) => L.divIcon({
                    className: 'custom-div-icon',
                    html: `
            <div style="
              background-color: ${color};
              width: 30px;
              height: 30px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
            ">
              ${emoji}
            </div>
          `,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15],
                    popupAnchor: [0, -15],
                });

                const icons = {
                    open: createIcon('#ef4444', '🚨'), // Red for open issues
                    'in-progress': createIcon('#f59e0b', '🔧'), // Orange for in-progress
                    resolved: createIcon('#10b981', '✅'), // Green for resolved
                    flagged: createIcon('#8b5cf6', '🚩'), // Purple for flagged
                    default: createIcon('#6b7280', '📍'), // Gray for default
                };

                setCustomIcons(icons);
                setMapReady(true);
            });
        }
    }, []);

    // Adjust map view to fit all markers
    useEffect(() => {
        if (mapRef.current && LRef.current && issues.length > 0 && mapReady) {
            const validIssues = issues.filter(issue => {
                const lat = Number(issue.latitude);
                const lng = Number(issue.longitude);
                return issue.latitude && issue.longitude &&
                    !isNaN(lat) && !isNaN(lng) &&
                    lat !== 0 && lng !== 0;
            });

            if (validIssues.length === 1) {
                // If there's only one issue, center and zoom to it
                const issue = validIssues[0];
                mapRef.current.setView([Number(issue.latitude), Number(issue.longitude)], 14);
            } else if (validIssues.length > 1) {
                // Fit bounds to show all markers
                const bounds = LRef.current.latLngBounds(
                    validIssues.map((issue) => LRef.current!.latLng(Number(issue.latitude), Number(issue.longitude)))
                );
                mapRef.current.fitBounds(bounds, { padding: [20, 20] });
            }
        }
    }, [issues, mapReady]);

    const getIssueIcon = (issue: Issue) => {
        if (issue.is_flagged) return customIcons.flagged;
        if (issue.is_resolved) return customIcons.resolved;
        // You can add more logic here based on status_id or other properties
        return customIcons.open;
    };

    const getStatusText = (issue: Issue) => {
        if (issue.is_resolved) return "Resolved";
        if (issue.is_flagged) return "Flagged";
        return "Open";
    };

    const getStatusColor = (issue: Issue) => {
        if (issue.is_resolved) return "text-green-600";
        if (issue.is_flagged) return "text-purple-600";
        return "text-red-600";
    };

    // Filter issues with valid coordinates
    const validIssues = issues.filter(issue => {
        const lat = Number(issue.latitude);
        const lng = Number(issue.longitude);
        return issue.latitude && issue.longitude &&
            !isNaN(lat) && !isNaN(lng) &&
            lat !== 0 && lng !== 0;
    });

    if (!mapReady) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary"></div>
            </div>
        );
    }

    if (validIssues.length === 0) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-xl">
                <div className="text-center">
                    <div className="text-6xl mb-4">🗺️</div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                        No Issues with Location Data
                    </h3>
                    <p className="text-text-secondary">
                        No issues found with valid location coordinates to display on the map.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full rounded-xl overflow-hidden">
            <MapContainer
                center={center}
                zoom={10}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
                ref={mapRef}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ZoomControl position="bottomright" />

                {validIssues.map((issue) => (
                    <Marker
                        key={issue.id}
                        position={[Number(issue.latitude), Number(issue.longitude)]}
                        icon={getIssueIcon(issue)}
                        eventHandlers={{
                            click: () => {
                                if (onIssueSelect) {
                                    onIssueSelect(issue);
                                }
                            }
                        }}
                    >
                        <Popup>
                            <div className="p-3 max-w-sm">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{issue.title}</h3>

                                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${getStatusColor(issue)} bg-gray-100`}>
                                    {getStatusText(issue)}
                                </div>

                                <p className="text-gray-700 text-sm mb-3 line-clamp-3">{issue.description}</p>

                                <div className="space-y-2 text-sm">
                                    {issue.address && (
                                        <p className="text-gray-600">
                                            <strong>Address:</strong> {issue.address}
                                        </p>
                                    )}

                                    {issue.location_description && (
                                        <p className="text-gray-600">
                                            <strong>Location:</strong> {issue.location_description}
                                        </p>
                                    )}

                                    <p className="text-gray-500 text-xs">
                                        <strong>Coordinates:</strong> {Number(issue.latitude).toFixed(6)}, {Number(issue.longitude).toFixed(6)}
                                    </p>                                    <p className="text-gray-500 text-xs">
                                        <strong>Reported:</strong> {new Date(issue.created_at).toLocaleDateString()}
                                    </p>

                                    {issue.category && (
                                        <p className="text-gray-600">
                                            <strong>Category:</strong> {issue.category.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
