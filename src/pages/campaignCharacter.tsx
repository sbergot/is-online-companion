import * as React from "react";

import { RouteComponentProps } from "react-router-dom";
import { Character } from "../contracts/character";
import { CharacterSheet } from "../components/character/characterSheet";
import { DataServiceContainer } from "../containers/dataService";
import { useLens, wrapFunctor } from "../services/functors";
import { CampaignCharacterRouteParams } from "../services/routes";
import { MainPanel } from "../components/layout";
import { KeyEntry } from "../contracts/persistence";

export function CampaignCharacter({ match }: RouteComponentProps<CampaignCharacterRouteParams>) {
    const dataService = DataServiceContainer.useContainer();
    const { characterKey } = match.params;
    const charactersSource = dataService.characters;
    const initialCharacter = charactersSource.values[characterKey];
    const lens = useLens<KeyEntry<Character>>(initialCharacter);

    const savingLens = wrapFunctor(lens.promap(
        (c) => c.data,
        (newChar, entry) => {
            const newEntry = {...entry, data: newChar};
            charactersSource.save(newEntry)
            return newEntry;
        } 
    ))

    return <MainPanel><CharacterSheet lens={savingLens} /></MainPanel>;
}