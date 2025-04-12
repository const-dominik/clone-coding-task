import { z } from "zod";
import { RobotState } from "./types";

const ServerRobotSchema = z.object({
    temperature: z.string().regex(/^\d+(\.\d+)?$/),
    power_consumption: z.string().regex(/^\d+(\.\d+)?$/),
    fan_speed: z.number(),
    fan_mode: z.enum(["proportional", "static"]),
    started_at: z.number(),
    logs: z.array(z.string()),
    status: z.enum(["idle", "running", "offline", "error"]),
});

const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const paddedHours = String(hours).padStart(2, "0");
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
};

export const parseServerRobot = (input: unknown): RobotState | null => {
    try {
        const result = ServerRobotSchema.parse(input);
        const now = Date.now();

        const robotState: RobotState = {
            temperature: result.temperature,
            powerConsumption: result.power_consumption,
            fanSpeed: result.fan_speed,
            fanMode: result.fan_mode,
            uptime: formatTime(
                Math.max(0, Math.floor((now - result.started_at * 1000) / 1000))
            ),
            logs: result.logs.toReversed(),
            status: result.status,
        };

        return robotState;
    } catch {
        return null;
    }
};
