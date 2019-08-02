export type TrackProgress = number;
export type Rank = "troublesome" | "dangerous" | "formidable" | "extreme" | "epic";

export interface ProgressChallenge {
    description: string;
    rank: Rank;
    track: TrackProgress;
    finished: boolean;
}
