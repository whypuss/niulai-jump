#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=8765

# 檢查是否已在運行
PID=$(lsof -ti :$PORT)
if [ -n "$PID" ]; then
  echo "Server already running on port $PORT (PID: $PID)"
  exit 0
fi

# 啟動背景伺服器
nohup python3 -m http.server $PORT --directory "$DIR" > "$DIR/server.log" 2>&1 &
NEW_PID=$!
sleep 1

# 取得當前真實局域網 IP
LAN_IP=$(ipconfig getifaddr en0 2>/dev/null || ifconfig | grep "inet 192\." | awk '{print $2}' | head -n 1)
[ -z "$LAN_IP" ] && LAN_IP="127.0.0.1"

# 驗證運行
if ps -p $NEW_PID > /dev/null; then
  echo "Niulai Jump server started successfully on PID $NEW_PID"
  echo "Local URL: http://localhost:$PORT"
  echo "LAN URL:   http://$LAN_IP:$PORT"
else
  echo "Failed to start server"
  cat "$DIR/server.log"
  exit 1
fi
