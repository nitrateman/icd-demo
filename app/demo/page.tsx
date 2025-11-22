"use client";

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
  },
  {
    id: "INC-2037",
    severity: "High",
    type: "Crowd Density",
    venue: "Fan Zone 3",
    time: "19:52",
    status: "Monitoring",
  },
  {
    id: "INC-1999",
    severity: "Medium",
    type: "Transport Delay",
    venue: "Team Bus Route – Cluster West",
    time: "19:10",
    status: "Resolved",
  },
];

const teams = [
  {
    name: "Team Alpha",
    role: "Stadium Response",
    cluster: "Central",
    status: "Green",
  },
  {
    name: "Team Bravo",
    role: "Mobile K9 Sweep",
    cluster: "South",
    status: "Amber",
  },
  {
    name: "Team Charlie",
    role: "Fan Zone Detail",
    cluster: "East",
    status: "Green",
  },
  {
    name: "K9 Unit – Nero",
    role: "Explosives Detection",
    cluster: "Transit Hub",
    status: "Green",
  },
];

const statusColors: Record<string, string> = {
  Green: "bg-emerald-500",
  Amber: "bg-amber-500",
  Red: "bg-red-500",
};

export default function Demo() {
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
              Static sample data showing how Atlas brings together incidents,
              mapping, and personnel status for FIFA-scale events. In a live
              deployment, each module is powered by real-time feeds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
              Cluster: Example City
            </div>
            <div className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300">
              Local Time: 20:23
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
                  Prioritized, event-specific incident stream
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
                  className="rounded-xl border border-gray-800 bg-gray-900/70 p-3 text-sm"
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
                    <span className="text-[11px] text-gray-500">
                      {inc.time} local
                    </span>
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
          <section className="xl:col-span-1 rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900/80 to-black p-4">
            <header className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-200">
                  Operational Map
                </h2>
                <p className="text-xs text-gray-500">
                  Venue cities for FIFA 26, visualized on a live Mapbox canvas.
                </p>
              </div>
              <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-300">
                Demo View
              </span>
            </header>

             <FifaMap />
          </section>

          {/* Personnel / K9 status */}
          <section className="xl:col-span-1 rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900/80 to-black p-4">
            <header className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-200">
                  Teams & K9 Units
                </h2>
                <p className="text-xs text-gray-500">
                  Example roster view with quick-look status.
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
                  className="flex items-start justify-between rounded-xl border border-gray-800 bg-gray-900/70 p-3 text-sm"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-100">
                        {team.name}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {team.cluster}
                      </span>
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
                    <span className="text-[11px] text-gray-400">
                      {team.status}
                    </span>
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
