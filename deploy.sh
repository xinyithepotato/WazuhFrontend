#!/bin/bash

echo "[+] Cloning and deploying full Wazuh + frontend stack..."
docker compose down
docker compose build
docker compose up -d

echo "[✓] Deployment complete!"
echo "➡ Frontend: http://localhost:3000"
echo "➡ API Proxy: http://localhost:5000"
echo "➡ Wazuh Dashboard: http://localhost:5601"
