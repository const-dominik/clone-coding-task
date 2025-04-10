import { RobotState } from "../types";

// Robots images from https://www.svgrepo.com/collection/doodle-library-hand-drawn-vectors/

const statusToSvg: Record<RobotState["status"], string> = {
    idle: "robot-idle.svg",
    error: "robot-error.svg",
    offline: "robot-off.svg",
    running: "robot-running.svg",
};

const Robot = ({ status }: { status: RobotState["status"] }) => {
    const src = statusToSvg[status];
    return <img src={src} alt="Robot image"></img>;
};

export default Robot;
