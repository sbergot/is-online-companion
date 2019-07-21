import { createContainer } from "unstated-next"
import { Character } from '../contracts/character';
import { useState } from "react";

function makeDefaultCharacter(): Character {
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
        bonds: 0,
        vows: []
    }
}

function useCharacterState(inpCharacter?: Character) {
    const initialCharacter: Character = inpCharacter || makeDefaultCharacter();
    const [character, setCharacter] = useState(initialCharacter);
    return {character, setCharacter};
}

export const { Provider, useContainer } = createContainer(useCharacterState);