@echo off
echo [+] Building and starting Wazuh stack...
docker compose pull
docker compose up -d --build
echo [✓] Done
echo ➡ React dashboard : http://localhost:3000
echo ➡ API proxy       : http://localhost:5000
echo ➡ Wazuh dashboard : https://localhost
pause
