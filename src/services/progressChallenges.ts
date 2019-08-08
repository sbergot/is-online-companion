import { Rank, ProgressChallenge, ChallengeType } from "../contracts/challenge";

export const allRanks: Rank[] = ["troublesome", "dangerous", "formidable", "extreme", "epic"];

interface RankStats {
    progress: number;
    next: Rank;
    experience: number;
}

export const rankStats: Record<Rank, RankStats> = {
    troublesome: {
        progress: 12,
        next: "dangerous",
        experience: 1
    },
    dangerous: {
        progress: 8,
        next: "formidable",
        experience: 2
    },
    formidable: {
        progress: 4,
        next: "extreme",
        experience: 3
    },
    extreme: {
        progress: 2,
        next: "epic",
        experience: 4
    },
    epic: {
        progress: 1,
        next: "epic",
        experience: 5
    },
}

export function newChallenge<T extends ChallengeType>(description: string, rank: Rank, type: T): ProgressChallenge<T> {
    return { description, rank, track: 0, finished: false, deleted: false, type };
}

export function finishChallenge<T extends ChallengeType>(challenge: ProgressChallenge<T>): ProgressChallenge<T> {
    return {...challenge, finished: true};
}

export function failChallenge<T extends ChallengeType>(challenge: ProgressChallenge<T>): ProgressChallenge<T> {
    return {...challenge, track: Math.min(challenge.track, 4), rank: rankStats[challenge.rank].next};
}

export function deleteChallenge<T extends ChallengeType>(challenge: ProgressChallenge<T>): ProgressChallenge<T> {
    return {...challenge, deleted: true};
}

interface ChallengeResource {
    createAction: string;
}

export const challengeResources: Record<ChallengeType, ChallengeResource> = {
    combat: { createAction: "enter the fray" },
    travel: { createAction: "undertake a journey" },
    vow: { createAction: "swear a vow" },
}
