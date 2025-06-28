import React, { useEffect, useState } from 'react';

function AgentStatus() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetch('/api/agents')
      .then(res => res.json())
      .then(data => setAgents(data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Agent Status</h2>
      <ul>
        {agents.map(agent => (
          <li key={agent.name}>
            {agent.name} - 
            <span className={agent.status === 'active' ? 'text-green-600' : 'text-red-600'}>
              {agent.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AgentStatus;
