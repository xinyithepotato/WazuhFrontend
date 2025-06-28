from flask import Flask, jsonify
from flask_cors import CORS
import requests, urllib3, os

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

API  = os.getenv("WAZUH_API_URL", "https://wazuh.manager:55000")
USER = os.getenv("WAZUH_USER", "wazuh")
PASS = os.getenv("WAZUH_PASS", "wazuh")

app = Flask(__name__)
CORS(app, origins="*")

def token():
    r = requests.post(f"{API}/security/user/authenticate?raw=true",
                      auth=(USER, PASS), verify=False)
    r.raise_for_status()
    return r.text.strip()

def api_get(path):
    hdr = {"Authorization": f"Bearer {token()}"}
    r = requests.get(f"{API}{path}", headers=hdr, verify=False)
    if r.status_code == 404:        # empty index, etc.
        return {"data": {"affected_items": []}}
    r.raise_for_status()
    return r.json()

@app.route("/api/status")
def status():
    return jsonify(api_get("/manager/status"))

@app.route("/api/agents")
def agents():
    return jsonify(api_get("/agents"))

@app.route("/api/alerts")
def alerts():
    return jsonify(api_get("/alerts?limit=25&agent_id=all&sort=-timestamp"))

@app.route("/api/install")
def install():
    return jsonify({
        "linux": "curl -sO https://packages.wazuh.com/4.x/apt/wazuh-agent.deb && sudo dpkg -i wazuh-agent.deb",
        "windows": "Download MSI ➜ https://packages.wazuh.com/4.x/windows/wazuh-agent.msi"
    })

@app.route("/")
def health():
    return "API proxy running", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
