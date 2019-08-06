import { Variant } from "./variant";
import { ChallengeRollResult, ChallengeRollType } from "./rolls";

export type LogType = "UserInput" | "DiceRoll";

interface BaseLog {
    characterKey: string;
}

interface UserInput extends BaseLog {
    text: string;
}
export type UserInputLog = Variant<"UserInput", UserInput>;

export interface ChallengeRoll extends BaseLog {
    type: ChallengeRollType;
    result: ChallengeRollResult;
}
export type DiceRollLog = Variant<"DiceRoll", ChallengeRoll>;

export type AnyLogBlock = UserInputLog | DiceRollLog;