from fastapi import WebSocket, WebSocketDisconnect


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()

        if user_id not in self.active_connections:
            self.active_connections[user_id] = []

        self.active_connections[user_id].append(websocket)


        print(
            f"WebSocket connected for user {user_id}. "
            f"Active connections: {len(self.active_connections[user_id])}"
        )

    def disconnect(self, websocket: WebSocket, user_id: int):
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)

            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

        print(
            f"WebSocket disconnected. "
            f"Active connections: {len(self.active_connections)}"
        )

    async def send_to_user(self, user_id: int, message: dict):
        if user_id not in self.active_connections:
            return

        disconnected = []
    
        for connection in self.active_connections[user_id]:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Failed to send WebSocket message: {e}")
                disconnected.append(connection)

        for websocket in disconnected:
            self.disconnect(websocket, user_id)

manager = ConnectionManager()


async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)

    try:
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        manager.disconnect(websocket)

