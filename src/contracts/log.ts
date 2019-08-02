import { StatusKey, StatKey } from "./character";

export interface LogBlock<K, T> {
    characterKey: string;
    type: K;
    payload: T;
}

export type LogType = "UserInput" | "DiceRoll";

export type UserInputLog = LogBlock<"UserInput", { text: string }>;

export type RollType = StatusKey | StatKey;
export interface ChallengeDice {
    actionDie: number;
    challengeDice: [number, number];
}
export interface ChallengeRoll {
    rollType: RollType;
    rollTypeStat: number;
    bonus: number;
    roll: ChallengeDice;
}
export type DiceRollLog = LogBlock<"DiceRoll", ChallengeRoll>;

export interface LogTypeMap {
    UserInput: UserInputLog;
    DiceRoll: DiceRollLog
}

export type AnyLogBlock = UserInputLog | DiceRollLog;