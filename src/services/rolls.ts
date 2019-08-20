import { ChallengeRollResult, ProgressRollResult, ChallengeDice } from '../contracts/rolls';
import { SimpleOracle } from '../contracts/referential';

function rollDie(i: number) {
    return Math.floor(Math.random() * i) + 1;
}

export function challengeRoll(stat: number, momentum: number, bonus: number): ChallengeRollResult {
    let actionDie = rollDie(6);
    if (momentum < 0 && -momentum === actionDie) {
        actionDie = 0;
    }
    return {
        stat,
        bonus,
        actionDie,
        challengeDice: [rollDie(10), rollDie(10)],
    };
}

export function getActionScore(result: ChallengeRollResult): number {
    return result.actionDie + result.stat + result.bonus;
}

export function getResult(score: number, challengeDice: ChallengeDice): string {
    const success = challengeDice.filter(cd => cd < score).length;
    switch (success) {
        case 0:
            return 'miss';
        case 1:
            return 'weak hit';
        case 2:
            return 'strong hit';
        default:
            return 'impossible';
    }
}

export function burnMomentum(roll: ChallengeRollResult, momentum: number): ChallengeRollResult {
    const currentChallenges = roll.challengeDice;
    const newChallenges = currentChallenges.map(v => (v < momentum ? 0 : v)) as [number, number];
    return {
        ...roll,
        challengeDice: newChallenges,
    };
}

export function progressRoll(track: number): ProgressRollResult {
    return {
        track: Math.floor(track / 4),
        challengeDice: [rollDie(10), rollDie(10)],
    };
}

export function rollOracle(oracle: SimpleOracle): string {
    const table = oracle["random-event"];
    const die = rollDie(100);
    const limits = Object.keys(table).map(n => Number(n)).sort((a, b) => a-b);
    const match = limits.find(l => l >= die) || 100;
    return table[match.toString()];
}
