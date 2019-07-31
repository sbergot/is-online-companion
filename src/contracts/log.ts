interface LogTypeMap {
    UserInput: { text: string };
    DiceRoll: { roll: number };
}

export interface LogBlock<K, T> {
    type: K;
    payload: T;
}

export type UserInputLog = LogBlock<"UserInput", { text: string }>;
export type DiceRollLog = LogBlock<"DiceRoll", { roll: number }>;

export type AnyLogBlock = UserInputLog | DiceRollLog;