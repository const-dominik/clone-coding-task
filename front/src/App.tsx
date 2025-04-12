import { useEffect, useState } from "react";
import Robot from "./components/Robot";
import { RobotState } from "./types";
import ControlPanel from "./components/ControlPanel";
import RobotData from "./components/RobotData";
import Logs from "./components/Logs";
import useWebSocket from "react-use-websocket";
import { parseServerRobot } from "./schemas";

const statusToColor: Record<RobotState["status"], string> = {
    idle: "text-orange-600",
    error: "text-red-500",
    offline: "text-black",
    running: "text-green-500",
};

const App = () => {
    const [robotState, setRobotState] = useState<null | RobotState>(null);

    const WS_URL = "ws://localhost:5487/ws";
    const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
        share: false,
        shouldReconnect: () => true,
    });

    useEffect(() => {
        try {
            setRobotState(parseServerRobot(lastJsonMessage));
        } catch (e) {
            console.log(e);
        }
    }, [lastJsonMessage]);

    if (!robotState) {
        return (
            <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#D4A373] text-white">
                <div className="flex items-center gap-4 text-xl font-medium">
                    <div className="w-1/2">
                        <Robot status="offline" />
                    </div>
                    <div>
                        <span className="text-gray-700">
                            I'm connecting with my inner self. Give me a second,
                            please.
                        </span>
                        <p className="mt-2 text-sm text-gray-500">
                            If this takes more than a second, my inner self is
                            probably dead and needs to be restarted. :(
                        </p>
                    </div>
                </div>
            </div>
        );
    }

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
                <ControlPanel
                    state={robotState}
                    sendWsMessage={sendJsonMessage}
                />
                <RobotData state={robotState} />
            </div>
            <div className="w-1/3 flex justify-center items-center bg-[#FAEDCD]">
                <Logs logs={robotState.logs} />
            </div>
        </div>
    );
};

export default App;
