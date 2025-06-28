from flask import Flask, jsonify
import requests

app = Flask(__name__)

# Sample route for alerts
@app.route('/api/alerts')
def get_alerts():
    # Replace with actual query to Elasticsearch
    return jsonify([
        {"id": "1", "level": "high", "message": "Unauthorized login attempt"},
        {"id": "2", "level": "medium", "message": "Outdated software detected"},
    ])

@app.route('/api/agents')
def get_agents():
    return jsonify([
        {"name": "web-server-1", "status": "active"},
        {"name": "dev-machine", "status": "disconnected"},
    ])

@app.route('/api/install-guide')
def install_guide():
    return jsonify({
        "linux": "Run this command: `curl -s https://packages.wazuh.com/... | bash`",
        "windows": "Download the agent from [URL], then click Install.",
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
