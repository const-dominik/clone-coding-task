export type RobotState = {
    temperature: number;
    powerConsumption: number;
    status: "idle" | "running" | "offline" | "error";
    fanSpeed: number;
    fanMode: "proportional" | "static";
    uptime: number;
    logs: string[];
}