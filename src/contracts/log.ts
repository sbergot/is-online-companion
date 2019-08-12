import { Variant } from './variant';
import { ChallengeRollResult, ChallengeRollType, ProgressRollResult } from './rolls';
import { ChallengeType, ProgressChallenge } from './challenge';

export type LogType = 'UserInput' | 'ChallengeRoll' | 'ProgressRoll';

interface BaseLog {
    characterKey: string;
}

export interface UserInput extends BaseLog {
    text: string;
}
export type UserInputLog = Variant<'UserInput', UserInput>;

export interface ChallengeRoll extends BaseLog {
    type: ChallengeRollType;
    result: ChallengeRollResult;
}
export type ChallengeRollLog = Variant<'ChallengeRoll', ChallengeRoll>;

export interface ProgressRoll extends BaseLog {
    challenge: ProgressChallenge<ChallengeType>;
    result: ProgressRollResult;
}
export type ProgressRollLog = Variant<'ProgressRoll', ProgressRoll>;

export type AnyLogBlock = UserInputLog | ChallengeRollLog | ProgressRollLog;
