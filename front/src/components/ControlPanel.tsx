import { useState, useEffect } from "react";
import { RobotState } from "../types";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import Pill from "./utils/Pill";
import Box from "./utils/Box";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

const ControlPanel = ({
    state,
    sendWsMessage,
}: {
    state: RobotState;
    sendWsMessage: SendJsonMessage;
}) => {
    const [localFanSpeed, setLocalFanSpeed] = useState(state.fanSpeed);
    const [debounceTimeout, setDebounceTimeout] =
        useState<NodeJS.Timeout | null>(null);

    // Debouncing the input so it doesn't send message to websocket
    // for each value we go through while using slider input
    const setFanValue = (value: number) => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(() => {
            sendWsMessage({
                type: "set_fan_speed",
                fan_speed: value,
            });
        }, 100);

        setDebounceTimeout(timeout);
    };

    useEffect(() => {
        setFanValue(localFanSpeed);
    }, [localFanSpeed]);

    useEffect(() => {
        setLocalFanSpeed(state.fanSpeed);
    }, [state.fanSpeed]);

    const switchStatus = () => {
        sendWsMessage({
            type: "switch_status",
        });
    };

    const resetRobot = () => {
        sendWsMessage({
            type: "reset",
        });
    };

    const switchFanMode = () => {
        sendWsMessage({
            type: "switch_fan_mode",
        });
    };

    return (
        <Box header="Robot control">
            {["idle", "running"].includes(state.status) && (
                <Pill onClick={() => switchStatus()}>
                    <span
                        className={`rounded-full h-4 w-4 ${
                            state.status === "running"
                                ? "bg-green-500"
                                : "bg-orange-500"
                        }`}
                    />
                    <span className="text-lg font-medium">
                        Turn {state.status === "running" ? "off" : "on"}
                    </span>
                </Pill>
            )}
            {["idle", "error"].includes(state.status) && (
                <Pill onClick={() => resetRobot()}>
                    <ArrowPathIcon className="size-5" />
                    <span className="text-lg font-medium">Reset</span>
                </Pill>
            )}
            <Pill pointer={false}>
                <div className="flex flex-col">
                    <span className="text-lg font-medium mb-1">Fan mode:</span>
                    <div className="flex m-auto rounded-full bg-white/40 p-1">
                        <div
                            onClick={() => switchFanMode()}
                            className={`px-3 py-1 rounded-full transition-colors duration-200 text-sm font-medium cursor-pointer ${
                                state.fanMode === "proportional"
                                    ? "bg-white text-black"
                                    : "text-gray-700"
                            }`}
                        >
                            Proportional
                        </div>
                        <div
                            onClick={() => switchFanMode()}
                            className={`px-3 py-1 rounded-full transition-colors duration-200 text-sm font-medium cursor-pointer ${
                                state.fanMode === "static"
                                    ? "bg-white text-black"
                                    : "text-gray-700"
                            }`}
                        >
                            Static
                        </div>
                    </div>
                    {state.fanMode === "static" && (
                        <div className="flex items-center gap-4 mx-4 my-3">
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={localFanSpeed}
                                onChange={(e) =>
                                    setLocalFanSpeed(Number(e.target.value))
                                }
                                className="w-40 accent-green-500"
                            />
                            <input
                                type="number"
                                min={0}
                                max={100}
                                value={localFanSpeed}
                                onChange={(e) => {
                                    const val = Math.min(
                                        100,
                                        Math.max(0, Number(e.target.value))
                                    );
                                    setLocalFanSpeed(val);
                                }}
                                className="w-16 p-1 border border-gray-300 rounded-md text-center outline-none"
                            />
                        </div>
                    )}
                </div>
            </Pill>
        </Box>
    );
};

export default ControlPanel;
