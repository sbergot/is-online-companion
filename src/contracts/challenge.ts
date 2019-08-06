export type TrackProgress = number;

export type Rank = "troublesome" | "dangerous" | "formidable" | "extreme" | "epic";

export type ChallengeType = "vow" | "combat" | "travel"

export interface ProgressChallenge<T extends ChallengeType> {
    type: T
    description: string;
    rank: Rank;
    track: TrackProgress;
    finished: boolean;
}
