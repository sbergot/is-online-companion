import * as React from "react";

import { MainContainer, Section } from "../components/layout";
import { CampaignServiceContainer } from "../containers/campaign";
import { RouteComponentProps } from "react-router-dom";
import { Character } from "../contracts/character";
import { CharacterSelection } from "../components/characterSelection";
import { CharacterSheet } from "../components/character";
import { DataServiceContainer } from "../containers/dataService";
import { Entry } from "../contracts/persistence";
import { useLens, wrapFunctor, Lens } from "../services/functors";

export function Campaign({ match }: RouteComponentProps<{ uuid: string }>) {
    const campaignService = CampaignServiceContainer.useContainer();
    const dataService = DataServiceContainer.useContainer();
    const { uuid } = match.params;
    const { state: character, setState: setCharacter, promap } = useLens<Entry<Character> | null>(null);
    const campaign = campaignService.campaigns[uuid].data;

    function onCharacterSelected(selectedChar: Entry<Character>) {
        campaignService.addCharacter(uuid, selectedChar.key);
        setCharacter(() => selectedChar);
    }

    const subFunction: Lens<Character> = wrapFunctor(promap(
        (c: Entry<Character> | null) => c ? c.data: null as any,
        (c: Character, e: Entry<Character> | null) => {
            if (e) {
                const newEntry: Entry<Character> = {...e, data: c};
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