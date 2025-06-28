import React, { useEffect, useState } from 'react';

function AlertsList() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch('/api/alerts')
      .then(res => res.json())
      .then(data => setAlerts(data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Alerts</h2>
      <ul>
        {alerts.map(alert => (
          <li key={alert.id} className="mb-2 border p-2 rounded shadow">
            <strong className="capitalize">{alert.level}:</strong> {alert.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AlertsList;
