export type RobotState = {
    temperature: string; // floats but just for display
    powerConsumption: string; // floats, same as above
    status: "idle" | "running" | "offline" | "error";
    fanSpeed: number;
    fanMode: "proportional" | "static";
    uptime: string;
    logs: string[];
};
