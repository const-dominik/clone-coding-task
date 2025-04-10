import { useState } from "react";
import Robot from "./components/Robot";
import { RobotState } from "./types";
import ControlPanel from "./components/ControlPanel";
import RobotData from "./components/RobotData";
import Logs from "./components/Logs";

const mockRobot: RobotState = {
    temperature: 35,
    powerConsumption: 20,
    status: "running",
    fanSpeed: 25,
    uptime: 284400,
    logs: [
        `[INFO][${new Date().toLocaleString()}] started`,
        `[INFO][${new Date().toLocaleString()}] is doing well`,
        `[INFO][${new Date().toLocaleString()}] feeling a bit under the weather :(`,
        `[INFO][${new Date().toLocaleString()}] please call me back`,
    ],
    fanMode: "proportional",
};

const statusToColor: Record<RobotState["status"], string> = {
    idle: "text-orange-600",
    error: "text-red-500",
    offline: "text-black",
    running: "text-green-500",
};

const App = () => {
    const [robotState, setRobotState] = useState(mockRobot);

    return (
        <div className="flex h-screen w-screen">
            <div className="w-1/3 flex flex-col justify-center items-center bg-[#D4A373]">
                <div className="flex items-center text-3xl font-semibold px-4 py-2">
                    <span className="text-gray-700">Robot status:</span>
                    <span
                        className={`px-3 py-1 font-medium ${
                            statusToColor[robotState.status]
                        }`}
                    >
                        {robotState.status}
                    </span>
                </div>
                <Robot status={robotState.status} />
            </div>
            <div className="w-1/3 flex flex-col justify-around items-center bg-[#FAEDCD]">
                <ControlPanel state={robotState} setState={setRobotState} />
                <RobotData state={robotState} />
            </div>
            <div className="w-1/3 flex justify-center items-center bg-[#FAEDCD]">
                <Logs logs={robotState.logs} />
            </div>
        </div>
    );
};

export default App;
