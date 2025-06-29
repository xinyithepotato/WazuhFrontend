import React, { useEffect, useState } from "react";

// ---------- helpers ----------
const API = "http://localhost:5000"; 
const fetchJSON = (url) => fetch(url).then((r) => r.json());

// ---------- main ----------
export default function App() {
  // health‑overview
  const [proc, setProc] = useState(null);
  // alerts
  const [alerts, setAlerts] = useState([]);
  const [query, setQuery] = useState("");
  // agents
  const [agents, setAgents] = useState([]);
  // install guide
  const [guide, setGuide] = useState(null);

  useEffect(() => {
	fetchJSON(`${API}/api/status`).then((d) =>
		setProc(d.data.affected_items[0])
	);

	fetchJSON(`${API}/api/alerts`).then((d) =>
		setAlerts(d.data?.affected_items || [])
	);

	fetchJSON(`${API}/api/agents`).then((d) => {
		const list = Array.isArray(d?.data?.affected_items)
		? d.data.affected_items
		: [];
		setAgents(list);
	});

  	fetchJSON(`${API}/api/install`).then(setGuide);
	}, []);

  // derived
  const allGood =
    proc && Object.values(proc).every((s) => s === "running");
  const filteredAlerts = alerts.filter((a) =>
    (a.rule?.description || a.message || "")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-indigo-700 text-white px-6 py-3 flex items-center">
        <h1 className="text-2xl font-semibold flex-1">
          Lightweight SIEM Dashboard
        </h1>
        <input
          type="text"
          placeholder="Search alerts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-3 py-1 rounded text-black w-64"
        />
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-10">
        {/* 1. Zero‑jargon health overview */}
        <section>
          <div
            className={`rounded p-4 text-white text-center shadow ${
              proc
                ? allGood
                  ? "bg-green-600"
                  : "bg-red-600"
                : "bg-gray-400"
            }`}
          >
            {proc
              ? allGood
                ? "All Wazuh processes running"
                : "Some Wazuh daemons are stopped"
              : "Loading health…"}
          </div>

          {proc && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[
                ["Manager", proc["wazuh-analysisd"] === "running"],
                ["Indexer", proc["wazuh-db"] === "running"],
                ["Dashboard", proc["wazuh-apid"] === "running"],
              ].map(([name, up]) => (
                <div
                  key={name}
                  className="bg-white border rounded p-3 flex items-center shadow"
                >
                  <span
                    className={`h-3 w-3 rounded-full mr-3 ${
                      up ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {name} {up ? "UP" : "DOWN"}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 2. Plain‑English alert feed */}
        <section>
          <h2 className="text-xl font-bold mb-2">
            Recent Alerts ({filteredAlerts.length})
          </h2>
          {filteredAlerts.length === 0 ? (
            <p className="text-gray-500">No matching alerts</p>
          ) : (
            <ul className="space-y-2">
              {filteredAlerts.map((a, i) => (
                <details
                  key={i}
                  className="bg-white border rounded shadow p-3"
                >
                  <summary className="cursor-pointer">
                    <span
                      className={`font-bold mr-2 ${
                        a.rule?.level >= 10
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {a.rule?.level}
                    </span>
                    {a.rule?.description || a.message}
                  </summary>
                  <pre className="mt-2 bg-gray-100 p-2 overflow-x-auto text-xs rounded">
                    {JSON.stringify(a, null, 2)}
                  </pre>
                </details>
              ))}
            </ul>
          )}
        </section>

        {/* 3. Agent fleet health */}
        <section>
          <h2 className="text-xl font-bold mb-2">
            Agents ({agents.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead className="bg-indigo-100 text-left">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((ag, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2">{ag.name}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 text-white rounded ${
                          ag.status === "active"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {ag.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. One‑click install guidance */}
        <section>
          <h2 className="text-xl font-bold mb-2">Install Agent</h2>
          {guide ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-2">Linux</h3>
                <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-sm">
                  {guide.linux}
                </pre>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-2">Windows</h3>
                <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-sm">
                  {guide.windows}
                </pre>
              </div>
            </div>
          ) : (
            <p>Loading install guide…</p>
          )}
        </section>
      </main>
    </div>
  );
}
