// app/demo/page.tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const FifaMap = dynamic(() => import("../../components/FifaMap"), {
  ssr: false,
});

const incidents = [
  {
    id: "INC-2043",
    severity: "Critical",
    type: "Medical",
    venue: "Stadium A – North Gate",
    time: "20:17",
    status: "Active",
    // Assume this is in Los Angeles for demo
    lat: 34.0522,
    lng: -118.2437,
  },
  {
    id: "INC-2037",
    severity: "High",
    type: "Crowd Density",
    venue: "Fan Zone 3",
    time: "19:52",
    status: "Monitoring",
    // Put this one in New York / Jersey
    lat: 40.7128,
    lng: -74.006,
  },
  {
    id: "INC-1999",
    severity: "Medium",
    type: "Transport Delay",
    venue: "Team Bus Route – Cluster West",
    time: "19:10",
    status: "Resolved",
    // Put this near Dallas
    lat: 32.7767,
    lng: -96.797,
  },
];

const teams = [
  {
    name: "Team Alpha",
    role: "Stadium Response",
    cluster: "Central",
    status: "Green",
    // Near Los Angeles
    lat: 34.0522,
    lng: -118.2437,
  },
  {
    name: "Team Bravo",
    role: "Mobile K9 Sweep",
    cluster: "South",
    status: "Amber",
    // Near Houston
    lat: 29.7604,
    lng: -95.3698,
  },
  {
    name: "Team Charlie",
    role: "Fan Zone Detail",
    cluster: "East",
    status: "Green",
    // Near Miami
    lat: 25.7617,
    lng: -80.1918,
  },
  {
    name: "K9 Unit – Nero",
    role: "Explosives Detection",
    cluster: "Transit Hub",
    status: "Green",
    // Near Mexico City
    lat: 19.4326,
    lng: -99.1332,
  },
];

const statusColors: Record<string, string> = {
  Green: "bg-emerald-500",
  Amber: "bg-amber-500",
  Red: "bg-red-500",
};

export default function Demo() {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    null
  );
  const [selectedTeamName, setSelectedTeamName] = useState<string | null>(null);
  const [roleMode, setRoleMode] = useState<"Ops" | "Executive" | "Analyst">(
    "Ops"
  );
  
  return (
    <main className="min-h-screen bg-black text-white px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        {/* Top bar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Demo Environment · Read-Only
            </p>
            <h1 className="text-2xl font-semibold md:text-3xl">
              Atlas Suite – Live Operations Demo
            </h1>
            <p className="max-w-2xl text-sm text-gray-400">
              {roleMode === "Ops" &&
                "Static sample data showing how Atlas brings together incidents, mapping, and personnel status for FIFA-scale events. In a live deployment, each module is powered by real-time feeds."}
              {roleMode === "Executive" &&
                "Executive view: quick assessment of risk, readiness, and resource posture across FIFA venue clusters, designed for command-level decision support."}
              {roleMode === "Analyst" &&
                "Analyst view: focuses on patterns across incidents, deployments, and geography to surface emerging risks across FIFA venue clusters."}
            </p>

          </div>

          <div className="flex flex-col items-stretch gap-3 md:items-end">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                Cluster: Example City
              </div>
              <div className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300">
                Local Time: 20:23
              </div>
            </div>

            {/* Role toggle */}
            <div className="inline-flex rounded-full bg-gray-900 p-1 text-xs">
              {(["Ops", "Executive", "Analyst"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleMode(role)}
                  className={
                    "px-3 py-1 rounded-full transition " +
                    (roleMode === role
                      ? "bg-blue-600 text-white shadow-[0_0_0_1px_rgba(37,99,235,0.7)]"
                      : "text-gray-300 hover:bg-gray-800")
                  }
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid layout */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {/* Incidents feed */}
          <section className="xl:col-span-1 rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900/80 to-black p-4">
            <header className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-200">
                  Incidents
                </h2>
                <p className="text-xs text-gray-500">
                  {roleMode === "Ops" &&
                    "Prioritized, event-specific incident stream."}
                  {roleMode === "Executive" &&
                    "Roll-up of critical and high-priority items impacting operations."}
                  {roleMode === "Analyst" &&
                    "Current incident set for trend and correlation analysis."}
                </p>
              </div>
              <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-medium text-red-300">
                1 Critical · 1 High
              </span>
            </header>

            <div className="space-y-3">
              {incidents.map((inc) => (
                <article
                  key={inc.id}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={
                    "rounded-xl border bg-gray-900/70 p-3 text-sm cursor-pointer transition " +
                     (selectedIncidentId === inc.id
                      ? "border-blue-400 shadow-[0_0_0_1px_rgba(59,130,246,0.7)]"
                      : "border-gray-800 hover:border-gray-500")
                  }
                >
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-gray-500">
                        {inc.id}
                      </span>
                      <span
                        className={
                          "rounded-full px-2 py-0.5 text-[11px] font-medium " +
                          (inc.severity === "Critical"
                            ? "bg-red-500/20 text-red-300"
                            : inc.severity === "High"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-sky-500/20 text-sky-300")
                        }
                      >
                        {inc.severity}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-500">{inc.time} local</span>
                  </div>
                  <p className="font-medium text-gray-100">{inc.type}</p>
                  <p className="text-xs text-gray-400">{inc.venue}</p>
                  <p className="mt-1 text-[11px] text-emerald-300">
                    Status: {inc.status}
                  </p>
                </article>
              ))}

            </div>
          </section>

          {/* Map placeholder */}
          <section className="xl:col-span-1 flex h-full flex-col rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900/80 to-black p-4">
            <header className="mb-2 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-200">
                  Operational Map
                </h2>
                <p className="text-xs text-gray-500">
                  {roleMode === "Ops" &&
                    "Venue cities for FIFA 26, visualized on a live Mapbox canvas."}
                  {roleMode === "Executive" &&
                    "High-level geographic view of venue exposure and resource posture."}
                  {roleMode === "Analyst" &&
                    "Spatial context for incident density, movement, and cross-cluster effects."}
                </p>
              </div>
              <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-300">
                Demo View
              </span>
            </header>
            <div className="flex-1">
              <FifaMap
                incidents={incidents}
                selectedIncidentId={selectedIncidentId}
                teams={teams}
                selectedTeamName={selectedTeamName}
              />
            </div>
          </section>

          {/* Personnel / K9 status */}
          <section className="xl:col-span-1 rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900/80 to-black p-4">
            <header className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-200">
                  Teams & K9 Units
                </h2>
                <p className="text-xs text-gray-500">
                  {roleMode === "Ops" &&
                    "Example roster view with quick-look status."}
                  {roleMode === "Executive" &&
                    "Summary of deployment posture across key response elements."}
                  {roleMode === "Analyst" &&
                    "Live unit positions supporting incident response and coverage analysis."}
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                3 Teams · 1 K9
              </span>
            </header>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
              {teams.map((team) => (
                <div
                  key={team.name}
                  onClick={() => setSelectedTeamName(team.name)}
                  className={
                    "flex cursor-pointer items-start justify-between rounded-xl border bg-gray-900/70 p-3 text-sm transition " +
                    (selectedTeamName === team.name
                      ? "border-blue-400 shadow-[0_0_0_1px_rgba(59,130,246,0.7)]"
                      : "border-gray-800 hover:border-gray-500")
                  }
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-100">{team.name}</span>
                      <span className="text-[11px] text-gray-500">{team.cluster}</span>
                    </div>
                    <p className="text-xs text-gray-400">{team.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        "h-2.5 w-2.5 rounded-full " +
                        (statusColors[team.status] ?? "bg-gray-500")
                      }
                    />
                    <span className="text-[11px] text-gray-400">{team.status}</span>
                  </div>
                </div>
              ))}

            </div>
          </section>
        </div>

        {/* Footer hint */}
        <p className="mt-2 text-center text-[11px] text-gray-500">
          All data on this page is simulated for demonstration purposes — in a
          live deployment, this view is wired to Atlas Suite, Atlas Engine, and
          the Incident Command Dashboard.
        </p>
      </div>
    </main>
  );
}
