import { StatusKey, StatKey } from "./character";

export type ChallengeRollType = StatusKey | StatKey;

export type ChallengeDice = [number, number];

export interface ChallengeRollResult {
    stat: number;
    bonus: number;
    actionDie: number;
    challengeDice: ChallengeDice;
}

export interface ProgressRollResult {
    track: number;
    challengeDice: ChallengeDice;
}
