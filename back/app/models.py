import random
import decimal
import logging
import io
import datetime

from typing import List
from enum import Enum
from fastapi import WebSocket


min_temperature, max_temperature = 20, 90

log_stream = io.StringIO()
handler = logging.StreamHandler(log_stream)
formatter = logging.Formatter("[%(levelname)s][%(asctime)s] %(message)s")
handler.setFormatter(formatter)

logger = logging.getLogger("robot")
logger.setLevel(logging.INFO)
logger.addHandler(handler)

def random_decimal_range(min, max):
    return decimal.Decimal(random.uniform(min, max)).quantize(decimal.Decimal("0.01"))


class Status(Enum):
    IDLE = "idle"
    RUNNING = "running"
    OFFLINE = "offline"
    ERROR = "error"


class FanMode(Enum):
    STATIC = "static"
    PROPORTIONAL = "proportional"


class Robot:
    def __init__(self):
        self.temperature = decimal.Decimal(min_temperature)
        self.fan_mode = FanMode.PROPORTIONAL
        self.fan_speed = 0
        self.power_consumption = decimal.Decimal(0)
        self.started_at = datetime.datetime.now(datetime.timezone.utc)
        self.logs = []

        self.status = Status.RUNNING
        logger.info("Robot started.")

    def mock_tick(self):
        # 1/1000 chance of random error occuring
        if random.random() < 0.001:
            self.status = Status.ERROR
            logger.error("Unexpected error occured!")

        if self.status == Status.RUNNING:
            self.power_consumption = random_decimal_range(15, 20)
        elif self.status in [Status.IDLE, Status.ERROR]:
            self.power_consumption = random_decimal_range(7, 10)
        else:
            self.power_consumption = decimal.Decimal(0)

        if self.fan_mode == FanMode.PROPORTIONAL:
            self.fan_speed = int((self.power_consumption / decimal.Decimal(20)) * 100)

        modifier = (100 - self.fan_speed) / 100
        temp = (max_temperature - min_temperature) * modifier + min_temperature

        self.temperature = decimal.Decimal(temp).quantize(decimal.Decimal("0.01"))
        if self.temperature > 0.9 * max_temperature:
            logger.warning(f"Temperature is getting too high: {temp}\N{DEGREE SIGN}C.")

        self.logs = log_stream.getvalue().split("\n")[0:-1]

    def switch_status(self):
        if self.status == Status.IDLE:
            self.status = Status.RUNNING
            logger.info("Switched status to running.")
        elif self.status == Status.RUNNING:
            self.status = Status.IDLE
            logger.info("Switched status to idle.")
        self.mock_tick()

    def reset(self):
        if self.status in [Status.IDLE, Status.ERROR]:
            self.status = Status.IDLE
            self.started_at = datetime.datetime.now(datetime.timezone.utc)

            log_stream.truncate(0)
            log_stream.seek(0)

            logger.info("Reset the robot.")
        self.mock_tick()

    def switch_fan_mode(self):
        if self.fan_mode == FanMode.PROPORTIONAL:
            self.fan_mode = FanMode.STATIC
            logger.info("Fan mode changed to static.")
        if self.fan_mode == FanMode.STATIC:
            self.fan_mode = FanMode.PROPORTIONAL
            logger.info("Fan mode changed to proportional.")
        self.mock_tick()

    def set_fan_speed(self, speed: int):
        if self.fan_mode == FanMode.STATIC:
            if speed >= 0 and speed <= 100:
                self.fan_speed = speed
            logger.info(f"Fan speed set to {speed}%.")
        self.mock_tick()

    def serialize(self):
        return {
            "temperature": str(self.temperature),
            "fan_speed": self.fan_speed,
            "power_consumption": str(self.power_consumption),
            "started_at": self.started_at.timestamp(),
            "logs": self.logs,
            "status": self.status.value,
        }

    async def send_state(self, connections: List[WebSocket]):
        for connection in connections:
            await connection.send_json(self.serialize())

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    def get_connections(self) -> List[WebSocket]:
        return self.active_connections