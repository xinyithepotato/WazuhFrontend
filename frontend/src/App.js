import React, { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch("http://35.193.130.15:5000/api/status")
      .then((res) => res.json())
      .then((data) => setStatus(data.data.affected_items[0]))
      .catch((err) => console.error("Error fetching status:", err));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Wazuh Manager Status</h1>
      {status ? (
        <ul>
          {Object.entries(status).map(([service, state]) => (
            <li key={service}>
              <strong>{service}</strong>: {state}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading status...</p>
      )}
    </div>
  );
}

export default App;
