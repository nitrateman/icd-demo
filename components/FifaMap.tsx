"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

type Venue = {
  id: string;
  name: string;
  country: "USA" | "Canada" | "Mexico";
  city: string;
  lat: number;
  lng: number;
};

const venues: Venue[] = [
  { id: "van", name: "Vancouver", country: "Canada", city: "Vancouver", lat: 49.2827, lng: -123.1207 },
  { id: "sea", name: "Seattle", country: "USA", city: "Seattle", lat: 47.6062, lng: -122.3321 },
  { id: "sfbay", name: "San Francisco Bay Area", country: "USA", city: "San Fran Bay Area", lat: 37.7749, lng: -122.4194 },
  { id: "la", name: "Los Angeles", country: "USA", city: "Los Angeles", lat: 34.0522, lng: -118.2437 },
  { id: "gdl", name: "Guadalajara", country: "Mexico", city: "Guadalajara", lat: 20.6597, lng: -103.3496 },
  { id: "cdmx", name: "Mexico City", country: "Mexico", city: "Mexico City", lat: 19.4326, lng: -99.1332 },
  { id: "mty", name: "Monterrey", country: "Mexico", city: "Monterrey", lat: 25.6866, lng: -100.3161 },
  { id: "hou", name: "Houston", country: "USA", city: "Houston", lat: 29.7604, lng: -95.3698 },
  { id: "dal", name: "Dallas", country: "USA", city: "Dallas", lat: 32.7767, lng: -96.7970 },
  { id: "kc", name: "Kansas City", country: "USA", city: "Kansas City", lat: 39.0997, lng: -94.5786 },
  { id: "atl", name: "Atlanta", country: "USA", city: "Atlanta", lat: 33.7490, lng: -84.3880 },
  { id: "mia", name: "Miami", country: "USA", city: "Miami", lat: 25.7617, lng: -80.1918 },
  { id: "tor", name: "Toronto", country: "Canada", city: "Toronto", lat: 43.6532, lng: -79.3832 },
  { id: "bos", name: "Boston", country: "USA", city: "Boston", lat: 42.3601, lng: -71.0589 },
  { id: "phi", name: "Philly", country: "USA", city: "Philly", lat: 39.9526, lng: -75.1652 },
  { id: "nyc", name: "New York / New Jersey", country: "USA", city: "New York / Jersey", lat: 40.7128, lng: -74.0060 },
];

export default function FifaMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedVenueId, setSelectedVenueId] = useState<string>("nyc");

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    if (!mapboxgl.accessToken) {
      console.warn("Missing NEXT_PUBLIC_MAPBOX_TOKEN");
      return;
    }

    const initialVenue = venues.find((v) => v.id === selectedVenueId) ?? venues[0];

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [initialVenue.lng, initialVenue.lat],
      zoom: 3.2,
    });

    mapRef.current = map;

    // Add markers
    venues.forEach((venue) => {
      const el = document.createElement("div");
      el.className =
        "rounded-full bg-blue-500 border border-white/60 w-3 h-3 shadow-lg";

      new mapboxgl.Marker(el)
        .setLngLat([venue.lng, venue.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 12 }).setHTML(
            `<strong>${venue.name}</strong><br/>${venue.country}`
          )
        )
        .addTo(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Pan when selected venue changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const venue = venues.find((v) => v.id === selectedVenueId);
    if (!venue) return;

    map.flyTo({
      center: [venue.lng, venue.lat],
      zoom: 5,
      speed: 0.7,
      curve: 1.5,
      essential: true,
    });
  }, [selectedVenueId]);

  return (
    <div className="flex h-full flex-col gap-3">
      {/* City selector */}
      <div className="flex flex-wrap gap-2 text-xs">
        {venues.map((venue) => (
          <button
            key={venue.id}
            onClick={() => setSelectedVenueId(venue.id)}
            className={
              "rounded-full border px-3 py-1 transition " +
              (venue.id === selectedVenueId
                ? "border-blue-400 bg-blue-500/20 text-blue-100"
                : "border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-500")
            }
          >
            {venue.city}
          </button>
        ))}
      </div>

      {/* Map container */}
      <div
        ref={mapContainerRef}
        className="mt-1 min-h-[260px] flex-1 rounded-xl border border-gray-700 bg-slate-950"
      />
    </div>
  );
}
