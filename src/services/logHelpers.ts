import { LogType } from "../contracts/log";

export function getLogTypeDescription(logType: LogType): string {
    switch(logType) {
        case "DiceRoll":
            return "Challenge roll";
        case "UserInput":
            return "User prompt";
    }
}