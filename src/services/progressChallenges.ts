import { Rank, ProgressChallenge } from "../contracts/challenge";

export const allRanks: Rank[] = ["troublesome", "dangerous", "formidable", "extreme", "epic"];

export function getProgressStepFromRank(rank: Rank): number {
    switch (rank) {
        case 'troublesome':
            return 12
        case 'dangerous':
            return 8
        case 'formidable':
            return 4
        case 'extreme':
            return 2
        case 'epic':
            return 1
        default:
            throw new Error("unknow rank: " + rank);
    }
}

export function getNextRank(rank: Rank): Rank {
    switch (rank) {
        case 'troublesome':
            return 'dangerous'
        case 'dangerous':
            return 'formidable'
        case 'formidable':
            return 'extreme'
        case 'extreme':
            return 'epic'
        case 'epic':
            return 'epic'
        default:
            throw new Error("unknow rank: " + rank);
    }
}


export function getExperienceFromRank(rank: Rank): number {
    switch (rank) {
        case 'troublesome':
            return 1
        case 'dangerous':
            return 2
        case 'formidable':
            return 3
        case 'extreme':
            return 4
        case 'epic':
            return 5
        default:
            throw new Error("unknow rank: " + rank);
    }
}

export function newChallenge(description: string, rank: Rank): ProgressChallenge {
    return { description, rank, track: 0, finished: false };
}

export function finishChallenge(challenge: ProgressChallenge): ProgressChallenge {
    return {...challenge, finished: true};
}

export function failChallenge(challenge: ProgressChallenge): ProgressChallenge {
    return {...challenge, track: Math.min(challenge.track, 4), rank: getNextRank(challenge.rank)};
}
