import { RobotState } from "../types";
import Box from "./utils/Box";
import Pill from "./utils/Pill";

const RobotData = ({ state }: { state: RobotState }) => {
    return (
        <Box header="Robot data">
            <div className="grid grid-cols-2 gap-1">
                <InfoPill
                    measure="Temperature"
                    value={state.temperature}
                    unit="&deg;C"
                />
                <InfoPill
                    measure="Power"
                    value={state.powerConsumption}
                    unit="W"
                />
                <InfoPill measure="Fan speed" value={state.fanSpeed} unit="%" />
                <InfoPill measure="Uptime" value={state.uptime} unit="s" />
            </div>
        </Box>
    );
};

const InfoPill = ({
    measure,
    value,
    unit,
}: {
    measure: string;
    value: number | string;
    unit: string;
}) => (
    <Pill pointer={false}>
        <span className="text-gray-600 font-medium">{measure}:</span>
        <span className="ml-auto">
            {value}
            {unit}
        </span>
    </Pill>
);
export default RobotData;
