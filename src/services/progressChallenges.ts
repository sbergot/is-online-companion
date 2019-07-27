import { Rank } from "../contracts/character";

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
