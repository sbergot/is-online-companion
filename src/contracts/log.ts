export interface LogBlock<K, T> {
    characterKey: string;
    type: K;
    payload: T;
}

export type LogType = "UserInput" | "DiceRoll";

export type UserInputLog = LogBlock<"UserInput", { text: string }>;
export type DiceRollLog = LogBlock<"DiceRoll", { roll: number }>;

export interface LogTypeMap {
    UserInput: UserInputLog;
    DiceRoll: DiceRollLog
}

export type AnyLogBlock = UserInputLog | DiceRollLog;