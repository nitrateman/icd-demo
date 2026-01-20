"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// ---------------- Types ----------------
type Venue = {
  id: string;
  name: string;
  region: "Region A" | "Region B" | "Region C";
  city: string;
  lat: number;
  lng: number;
};

type IncidentMarker = {
  id: string;
  severity: "Critical" | "High" | "Medium" | string;
  type: string;
  venue: string; // venue.id or label
  lat: number;
  lng: number;
};

type TeamMarker = {
  name: string;
  role: string;
  cluster: string;
  status: "Green" | "Amber" | "Red" | string;
  lat: number;
  lng: number;
};

type Props = {
  incidents?: IncidentMarker[];
  teams?: TeamMarker[];
  selectedIncidentId?: string | null;
  selectedTeamName?: string | null;
  initialZoom?: number;
  initialCenter?: [number, number]; // [lng, lat]
  onVenueSelect?: (venue: Venue) => void;
  onIncidentSelect?: (incident: IncidentMarker) => void;
  onTeamSelect?: (team: TeamMarker) => void;
};

// ---------------- Demo sample data ----------------
const venues: Venue[] = [
  { id: "van", name: "Vancouver", region: "Region B", city: "Vancouver", lat: 49.2827, lng: -123.1207 },
  { id: "sea", name: "Seattle", region: "Region A", city: "Seattle", lat: 47.6062, lng: -122.3321 },
  { id: "sfbay", name: "San Francisco Bay Area", region: "Region A", city: "San Francisco Bay Area", lat: 37.7749, lng: -122.4194 },
  { id: "la", name: "Los Angeles", region: "Region A", city: "Los Angeles", lat: 34.0522, lng: -118.2437 },
  { id: "gdl", name: "Guadalajara", region: "Region C", city: "Guadalajara", lat: 20.6597, lng: -103.3496 },
  { id: "cdmx", name: "Mexico City", region: "Region C", city: "Mexico City", lat: 19.4326, lng: -99.1332 },
  { id: "mty", name: "Monterrey", region: "Region C", city: "Monterrey", lat: 25.6866, lng: -100.3161 },
  { id: "hou", name: "Houston", region: "Region A", city: "Houston", lat: 29.7604, lng: -95.3698 },
  { id: "dal", name: "Dallas", region: "Region A", city: "Dallas", lat: 32.7767, lng: -96.797 },
  { id: "kc", name: "Kansas City", region: "Region A", city: "Kansas City", lat: 39.0997, lng: -94.5786 },
  { id: "atl", name: "Atlanta", region: "Region A", city: "Atlanta", lat: 33.749, lng: -84.388 },
  { id: "mia", name: "Miami", region: "Region A", city: "Miami", lat: 25.7617, lng: -80.1918 },
  { id: "tor", name: "Toronto", region: "Region B", city: "Toronto", lat: 43.6532, lng: -79.3832 },
  { id: "bos", name: "Boston", region: "Region A", city: "Boston", lat: 42.3601, lng: -71.0589 },
  { id: "phi", name: "Philadelphia", region: "Region A", city: "Philadelphia", lat: 39.9526, lng: -75.1652 },
  { id: "nyc", name: "New York / New Jersey", region: "Region A", city: "New York / New Jersey", lat: 40.7128, lng: -74.006 },
];

const sampleIncidents: IncidentMarker[] = [
  { id: "inc-001", severity: "High", type: "Access Control Issue", venue: "nyc", lat: 40.7136, lng: -74.0059 },
  { id: "inc-002", severity: "Critical", type: "Medical Response Needed", venue: "mia", lat: 25.7622, lng: -80.1913 },
  { id: "inc-003", severity: "Medium", type: "Suspicious Activity", venue: "la", lat: 34.0527, lng: -118.2442 },
  { id: "inc-004", severity: "High", type: "Crowd Surge Risk", venue: "sea", lat: 47.6069, lng: -122.3317 },
];

const sampleTeams: TeamMarker[] = [
  { name: "Team Alpha", role: "Mobile Patrol", cluster: "Cluster 1", status: "Green", lat: 40.715, lng: -74.003 },
  { name: "Team Bravo", role: "Perimeter", cluster: "Cluster 1", status: "Amber", lat: 25.7634, lng: -80.1901 },
  { name: "Team Charlie", role: "Response", cluster: "Cluster 2", status: "Red", lat: 34.051, lng: -118.245 },
  { name: "Team Delta", role: "Supervisor", cluster: "Cluster 2", status: "Green", lat: 47.6074, lng: -122.333 },
];

// ---------------- Helpers ----------------
function getIncidentColor(severity: string) {
  if (severity === "Critical") return "#ef4444";
  if (severity === "High") return "#f59e0b";
  return "#38bdf8";
}

function getTeamColor(status: string) {
  if (status === "Green") return "#22c55e";
  if (status === "Amber") return "#f59e0b";
  return "#ef4444";
}

function applySelectedStyle(el: HTMLElement) {
  el.style.outline = "3px solid rgba(59,130,246,0.95)";
  el.style.outlineOffset = "2px";
  el.style.transform = "scale(1.15)";
  el.style.zIndex = "10";
}

function clearSelectedStyle(el: HTMLElement) {
  el.style.outline = "";
  el.style.outlineOffset = "";
  el.style.transform = "";
  el.style.zIndex = "";
}

export default function OperationsMap({
  incidents = sampleIncidents,
  teams = sampleTeams,
  selectedIncidentId = null,
  selectedTeamName = null,
  initialZoom = 2.8,
  initialCenter = [-98.5795, 39.8283],
  onVenueSelect,
  onIncidentSelect,
  onTeamSelect,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const venueMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const incidentMarkersRef = useRef<
    Array<{ marker: mapboxgl.Marker; id: string; el: HTMLElement; lng: number; lat: number }>
  >([]);
  const teamMarkersRef = useRef<
    Array<{ marker: mapboxgl.Marker; name: string; el: HTMLElement; lng: number; lat: number }>
  >([]);

  const [ready, setReady] = useState(false);

  const hasToken = Boolean(process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

  // Freeze initial values to prevent map recreation loops (array refs)
  const initialCenterRef = useRef<[number, number]>(initialCenter);
  const initialZoomRef = useRef<number>(initialZoom);

  const selectedIncident = useMemo(
    () => (selectedIncidentId ? incidents.find((i) => i.id === selectedIncidentId) : undefined),
    [incidents, selectedIncidentId]
  );

  const selectedTeam = useMemo(
    () => (selectedTeamName ? teams.find((t) => t.name === selectedTeamName) : undefined),
    [teams, selectedTeamName]
  );

  // ---------------- Map init (RUN ONCE) ----------------
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    // Hard bail if token missing to prevent runtime crash loops
    if (!mapboxgl.accessToken || mapboxgl.accessToken.trim() === "") {
      console.warn("Mapbox token missing. Set NEXT_PUBLIC_MAPBOX_TOKEN.");
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: initialCenterRef.current,
      zoom: initialZoomRef.current,
      attributionControl: true,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

    const onLoad = () => setReady(true);
    map.on("load", onLoad);

    return () => {
      try {
        venueMarkersRef.current.forEach((m) => m.remove());
        incidentMarkersRef.current.forEach((m) => m.marker.remove());
        teamMarkersRef.current.forEach((m) => m.marker.remove());
      } catch {}

      venueMarkersRef.current = [];
      incidentMarkersRef.current = [];
      teamMarkersRef.current = [];

      map.off("load", onLoad);
      map.remove();
      mapRef.current = null;
      setReady(false);
    };
  }, []);

  // ---------------- Venue markers (rebuild only when map ready) ----------------
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    venueMarkersRef.current.forEach((m) => m.remove());
    venueMarkersRef.current = [];

    venues.forEach((v) => {
      const el = document.createElement("div");
      el.style.width = "12px";
      el.style.height = "12px";
      el.style.borderRadius = "999px";
      el.style.border = "2px solid rgba(255,255,255,0.6)";
      el.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.6)";
      el.style.cursor = "pointer";

      const regionColor =
        v.region === "Region A"
          ? "rgba(56,189,248,0.9)"
          : v.region === "Region B"
          ? "rgba(34,197,94,0.9)"
          : "rgba(245,158,11,0.9)";
      el.style.background = regionColor;

      const onClick = (e: MouseEvent) => {
        e.stopPropagation();
        onVenueSelect?.(v);
        map.flyTo({ center: [v.lng, v.lat], zoom: Math.max(map.getZoom(), 6), speed: 0.9 });
      };
      el.addEventListener("click", onClick);

      const popup = new mapboxgl.Popup({ offset: 12, closeButton: false }).setHTML(
        `<div style="font-family: ui-sans-serif; font-size:12px;">
           <div style="font-weight:600; margin-bottom:4px;">${v.name}</div>
           <div style="opacity:0.8;">${v.region} • ${v.city}</div>
         </div>`
      );

      const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat([v.lng, v.lat])
        .setPopup(popup)
        .addTo(map);

      venueMarkersRef.current.push(marker);
      marker.on("remove", () => el.removeEventListener("click", onClick));
    });
  }, [ready, onVenueSelect]);

  // ---------------- Incident markers (REBUILD ONLY when incidents change) ----------------
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    incidentMarkersRef.current.forEach((m) => m.marker.remove());
    incidentMarkersRef.current = [];

    incidents.forEach((inc) => {
      const el = document.createElement("div");
      el.style.width = "14px";
      el.style.height = "14px";
      el.style.borderRadius = "4px";
      el.style.background = getIncidentColor(inc.severity);
      el.style.border = "1px solid rgba(255,255,255,0.65)";
      el.style.boxShadow = "0 8px 18px rgba(0,0,0,0.45)";
      el.style.cursor = "pointer";

      // apply selection style at creation time (initial)
      if (selectedIncidentId && inc.id === selectedIncidentId) applySelectedStyle(el);

      const onClick = (e: MouseEvent) => {
        e.stopPropagation();
        onIncidentSelect?.(inc);
        map.flyTo({ center: [inc.lng, inc.lat], zoom: Math.max(map.getZoom(), 7), speed: 0.9 });
      };
      el.addEventListener("click", onClick);

      const popup = new mapboxgl.Popup({ offset: 12, closeButton: false }).setHTML(
        `<div style="font-family: ui-sans-serif; font-size:12px;">
           <div style="font-weight:700; margin-bottom:4px;">${inc.severity} • ${inc.type}</div>
           <div style="opacity:0.85;">Incident ID: ${inc.id}</div>
         </div>`
      );

      const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat([inc.lng, inc.lat])
        .setPopup(popup)
        .addTo(map);

      incidentMarkersRef.current.push({ marker, id: inc.id, el, lng: inc.lng, lat: inc.lat });
      marker.on("remove", () => el.removeEventListener("click", onClick));
    });

    // IMPORTANT: selection highlighting updates are handled in a separate effect below.
    // Do NOT rebuild markers on selectedIncidentId changes (prevents flashing).
  }, [ready, incidents, onIncidentSelect]); // <-- removed selectedIncidentId

  // ---------------- Team markers (REBUILD ONLY when teams change) ----------------
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    teamMarkersRef.current.forEach((m) => m.marker.remove());
    teamMarkersRef.current = [];

    teams.forEach((t) => {
      const el = document.createElement("div");
      el.style.width = "12px";
      el.style.height = "12px";
      el.style.borderRadius = "999px";
      el.style.background = getTeamColor(t.status);
      el.style.border = "2px solid rgba(255,255,255,0.75)";
      el.style.boxShadow = "0 8px 18px rgba(0,0,0,0.35)";
      el.style.cursor = "pointer";

      if (selectedTeamName && t.name === selectedTeamName) applySelectedStyle(el);

      const onClick = (e: MouseEvent) => {
        e.stopPropagation();
        onTeamSelect?.(t);
        map.flyTo({ center: [t.lng, t.lat], zoom: Math.max(map.getZoom(), 8), speed: 0.9 });
      };
      el.addEventListener("click", onClick);

      const popup = new mapboxgl.Popup({ offset: 12, closeButton: false }).setHTML(
        `<div style="font-family: ui-sans-serif; font-size:12px;">
           <div style="font-weight:700; margin-bottom:4px;">${t.name}</div>
           <div style="opacity:0.9;">${t.role} • ${t.cluster}</div>
           <div style="opacity:0.85;">Status: <span style="font-weight:700;">${t.status}</span></div>
         </div>`
      );

      const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat([t.lng, t.lat])
        .setPopup(popup)
        .addTo(map);

      teamMarkersRef.current.push({ marker, name: t.name, el, lng: t.lng, lat: t.lat });
      marker.on("remove", () => el.removeEventListener("click", onClick));
    });

    // IMPORTANT: selection highlighting updates are handled in a separate effect below.
    // Do NOT rebuild markers on selectedTeamName changes (prevents flashing).
  }, [ready, teams, onTeamSelect]); // <-- removed selectedTeamName

  // ---------------- Selection updates (style only, NO marker rebuild) ----------------
  useEffect(() => {
    incidentMarkersRef.current.forEach((m) => {
      if (selectedIncidentId && m.id === selectedIncidentId) applySelectedStyle(m.el);
      else clearSelectedStyle(m.el);
    });
  }, [selectedIncidentId]);

  useEffect(() => {
    teamMarkersRef.current.forEach((m) => {
      if (selectedTeamName && m.name === selectedTeamName) applySelectedStyle(m.el);
      else clearSelectedStyle(m.el);
    });
  }, [selectedTeamName]);

  // ---------------- Auto-focus on selection ----------------
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    if (selectedIncident) {
      map.flyTo({
        center: [selectedIncident.lng, selectedIncident.lat],
        zoom: Math.max(map.getZoom(), 7),
        speed: 0.9,
      });
      return;
    }

    if (selectedTeam) {
      map.flyTo({
        center: [selectedTeam.lng, selectedTeam.lat],
        zoom: Math.max(map.getZoom(), 8),
        speed: 0.9,
      });
    }
  }, [ready, selectedIncident, selectedTeam]);

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden border border-white/10">
      {!hasToken && (
        <div className="absolute z-20 inset-0 flex items-center justify-center bg-black/70 text-white text-sm p-6 text-center">
          Missing Mapbox token. Set <span className="mx-1 font-mono">NEXT_PUBLIC_MAPBOX_TOKEN</span> in your environment.
        </div>
      )}

      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Legend */}
      <div className="absolute z-10 bottom-3 left-3 bg-black/60 backdrop-blur px-3 py-2 rounded-lg border border-white/10 text-xs text-white/90">
        <div className="font-semibold mb-1">Legend</div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: "#ef4444" }} /> Critical
          <span className="inline-block w-3 h-3 rounded-sm ml-2" style={{ background: "#f59e0b" }} /> High
          <span className="inline-block w-3 h-3 rounded-sm ml-2" style={{ background: "#38bdf8" }} /> Medium
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="inline-block w-3 h-3 rounded-full" style={{ background: "#22c55e" }} /> Green
          <span className="inline-block w-3 h-3 rounded-full ml-2" style={{ background: "#f59e0b" }} /> Amber
          <span className="inline-block w-3 h-3 rounded-full ml-2" style={{ background: "#ef4444" }} /> Red
        </div>
      </div>
    </div>
  );
}
