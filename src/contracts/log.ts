import { StatusKey, StatKey } from "./character";
import { Variant } from "./variant";

export type LogType = "UserInput" | "DiceRoll";

export type UserInputLog = Variant<"UserInput", { text: string; characterKey: string; }>;

export type RollType = StatusKey | StatKey;

export interface ChallengeDice {
    actionDie: number;
    challengeDice: [number, number];
}
export interface ChallengeRoll {
    characterKey: string;
    rollType: RollType;
    rollTypeStat: number;
    bonus: number;
    roll: ChallengeDice;
}
export type DiceRollLog = Variant<"DiceRoll", ChallengeRoll>;

export interface LogTypeMap {
    UserInput: UserInputLog;
    DiceRoll: DiceRollLog
}

export type AnyLogBlock = UserInputLog | DiceRollLog;