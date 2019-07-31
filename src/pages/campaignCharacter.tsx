import * as React from "react";

import { MainContainer, Section } from "../components/layout";
import { CampaignServiceContainer } from "../containers/campaign";
import { RouteComponentProps } from "react-router-dom";
import { Character } from "../contracts/character";
import { CharacterSelection } from "../components/characterSelection";
import { CharacterSheet } from "../components/character";
import { DataServiceContainer } from "../containers/dataService";
import { KeyEntry } from "../contracts/persistence";
import { useLens, wrapFunctor, Lens } from "../services/functors";

export function CampaignCharacter({ match }: RouteComponentProps<{ key: string }>) {
    const campaignService = CampaignServiceContainer.useContainer();
    const dataService = DataServiceContainer.useContainer();
    const { key } = match.params;
    const { state: character, setState: setCharacter, promap } = useLens<KeyEntry<Character> | null>(null);
    const campaign = campaignService.campaigns[key].data;

    function onCharacterSelected(selectedChar: KeyEntry<Character>) {
        campaignService.addCharacter(key, selectedChar.key);
        setCharacter(() => selectedChar);
    }

    const subFunction: Lens<Character> = wrapFunctor(promap(
        (c: KeyEntry<Character> | null) => c ? c.data: null as any,
        (c: Character, e: KeyEntry<Character> | null) => {
            if (e) {
                const newEntry: KeyEntry<Character> = {...e, data: c};
                dataService.characters.save(newEntry);
                return newEntry;
            }
            return null;
        }
    ));

    return <MainContainer>
        <Section title="Campaign">
            {campaign.name}
        </Section>
        {character ?
            <CharacterSheet lens={subFunction} /> :
            <CharacterSelection
                onSelected={onCharacterSelected}
                characters={Array.from(campaign.characters).map((c) => dataService.characters.values[c])} />}
    </MainContainer>;
}