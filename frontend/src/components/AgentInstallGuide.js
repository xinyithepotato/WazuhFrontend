import React, { useEffect, useState } from 'react';

function AgentInstallGuide() {
  const [guide, setGuide] = useState({ linux: '', windows: '' });

  useEffect(() => {
    fetch('/api/install-guide')
      .then(res => res.json())
      .then(data => setGuide(data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Agent Installation</h2>
      <div className="mb-4">
        <h3 className="font-semibold">Linux:</h3>
        <code>{guide.linux}</code>
      </div>
      <div>
        <h3 className="font-semibold">Windows:</h3>
        <code>{guide.windows}</code>
      </div>
    </div>
  );
}

export default AgentInstallGuide;
