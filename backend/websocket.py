from fastapi import WebSocket, WebSocketDisconnect


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

        print(
            f"WebSocket connected. "
            f"Active connections: {len(self.active_connections)}"
        )

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

        print(
            f"WebSocket disconnected. "
            f"Active connections: {len(self.active_connections)}"
        )

    async def broadcast(self, message: dict):
        disconnected = []

        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"❌ Failed to send WebSocket message: {e}")
                disconnected.append(connection)

        for websocket in disconnected:
            self.disconnect(websocket)

manager = ConnectionManager()


async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)

    try:
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        manager.disconnect(websocket)

