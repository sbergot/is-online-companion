import { StatusKey, StatKey } from "./character";
import { Variant } from "./variant";

export type LogType = "UserInput" | "DiceRoll";

interface BaseLog {
    characterKey: string;
}

interface UserInput extends BaseLog {
    text: string;
}
export type UserInputLog = Variant<"UserInput", UserInput>;

export type RollType = StatusKey | StatKey;
export interface ChallengeDice {
    actionDie: number;
    challengeDice: [number, number];
}
export interface ChallengeRoll extends BaseLog {
    rollType: RollType;
    rollTypeStat: number;
    bonus: number;
    roll: ChallengeDice;
}
export type DiceRollLog = Variant<"DiceRoll", ChallengeRoll>;

export type AnyLogBlock = UserInputLog | DiceRollLog;