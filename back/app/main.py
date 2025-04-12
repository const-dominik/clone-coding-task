import argparse
import uvicorn
import asyncio


from models import Robot, ConnectionManager
from fastapi import FastAPI, WebSocket
from fastapi.websockets import WebSocketDisconnect
from contextlib import asynccontextmanager

manager = ConnectionManager()
robot = Robot()


def create_app(args) -> FastAPI:
    @asynccontextmanager
    async def lifespan(app: FastAPI):
        app.state.rate = args.rate
        asyncio.create_task(periodic_state_update(app.state.rate))
        yield

    app = FastAPI(lifespan=lifespan)

    @app.websocket("/ws")
    async def websocket_endpoint(websocket: WebSocket):
        await manager.connect(websocket)
        try:
            while True:
                data = await websocket.receive_json()
                if data["type"] == "switch_status":
                    robot.switch_status()
                elif data["type"] == "reset":
                    robot.reset()
                elif data["type"] == "switch_fan_mode":
                    robot.switch_fan_mode()
                elif data["type"] == "set_fan_speed":
                    robot.set_fan_speed(data["fan_speed"])
        except WebSocketDisconnect:
            manager.disconnect(websocket)

    return app


async def periodic_state_update(rate: int):
    while True:
        robot.mock_tick()
        try:
            await robot.send_state(manager.get_connections())
        except WebSocketDisconnect:
            pass
        await asyncio.sleep(1 / rate)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--host",
        type=str,
        default="localhost",
        help="Sets server's host. Defaults to localhost.",
    )
    parser.add_argument(
        "--port", type=int, default=5487, help="Sets server's port. Defaults to 5487."
    )
    parser.add_argument(
        "--log-level",
        type=str,
        default="info",
        choices=["critical", "error", "warning", "info", "debug", "trace"],
        help="Sets the log level for the server.",
    )
    parser.add_argument(
        "--rate",
        type=int,
        default=10,
        help="Controls how often new state is available. Defaults to 10Hz.",
    )

    args = parser.parse_args()
    app = create_app(args)

    uvicorn.run(
        app,
        host=args.host,
        port=args.port,
        log_level=args.log_level,
    )
