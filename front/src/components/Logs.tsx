import { RobotState } from "../types";
import Box from "./utils/Box";

const Logs = ({ logs }: { logs: RobotState["logs"] }) => {
    return (
        <Box header="Robot logs">
            <div className="h-100 overflow-y-auto px-4 py-2 space-y-2">
                {logs.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                        No logs available.
                    </p>
                ) : (
                    logs.map((log, index) => (
                        <div
                            key={index}
                            className="bg-white/40 rounded-md px-3 py-2 text-sm font-mono text-gray-800 shadow-sm text-left"
                        >
                            {log}
                        </div>
                    ))
                )}
            </div>
        </Box>
    );
};

export default Logs;
