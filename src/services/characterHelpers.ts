import { Character, Debilities, MomentumMeta } from '../contracts/character';

export function makeDefaultCharacter(): Character {
    return {
        name: '',
        experience: 0,
        stats: {
            edge: 0,
            heart: 0,
            iron: 0,
            shadow: 0,
            wits: 0,
        },
        momentum: {
            level: 2,
        },
        status: {
            health: 5,
            spirit: 5,
            supply: 5,
        },
        debilities: {
            banes: {
                corrupted: false,
                maimed: false,
            },
            burdens: {
                cursed: false,
                tormented: false,
            },
            conditions: {
                encumbered: false,
                shaken: false,
                unprepared: false,
                wounded: false,
            },
        },
        assets: [],
        bonds: 3,
        vows: {},
    };
}

function countTrueMembers(obj: object): number {
    return Object.values(obj).filter(b => b).length;
}

function countDebilities(deb: Debilities): number {
    return countTrueMembers(deb.banes) + countTrueMembers(deb.burdens) + countTrueMembers(deb.conditions);
}

export function getMomentumMeta(character: Character): MomentumMeta {
    const debilitiesCount = countDebilities(character.debilities);
    return {
        max: 10 - debilitiesCount,
        reset: 2 - Math.min(debilitiesCount, 2),
    };
}
