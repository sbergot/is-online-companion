import { Character } from '../contracts/character';

export function makeDefaultCharacter(): Character {
    return {
        name: "",
        experience: 0,
        stats: {
            edge: 0,
            heart: 0,
            iron: 0,
            shadow: 0,
            wits: 0
        },
        momentum: {
            level: 2,
            max: 10,
            reset: 2
        },
        status: {
            health: 5,
            spirit: 5,
            supply: 5
        },
        debilities: {
            banes: {
                corrupted: false,
                maimed: false
            },
            burdens: {
                cursed: false,
                tormented: false
            },
            conditions: {
                encumbered: false,
                shaken: false,
                unprepared: false,
                wounded: false
            }
        },
        assets: [],
        bonds: 3,
        vows: {}
    }
}
