import * as React from "react";
import { MainContainer, Section } from "../components/layout";
import { CampaignServiceContainer } from "../containers/campaign";
import { RouteComponentProps } from "react-router-dom";
import { Character } from "../contracts/character";
import { CharacterSelection } from "../components/characterSelection";
import { CharacterSheet } from "../components/character";
import { DataServiceContainer } from "../containers/dataService";
import { Entry } from "../contracts/persistence";

export function Campaign({ match }: RouteComponentProps<{ uuid: string }>) {
    const campaignService = CampaignServiceContainer.useContainer();
    const dataService = DataServiceContainer.useContainer();
    const { uuid } = match.params;
    const [character, setCharacter] = React.useState<Character | null>(null);
    const campaign = campaignService.campaigns[uuid].data;

    function onCharacterSelected(selectedChar: Entry<Character>) {
        campaignService.addCharacter(uuid, selectedChar.key);
        setCharacter(selectedChar.data);
    }

    return <MainContainer>
        <Section title="Campaign">
            {campaign.name}
        </Section>
        {character ?
            <CharacterSheet character={character} setCharacter={setCharacter} /> :
            <CharacterSelection
                onSelected={onCharacterSelected}
                characters={Array.from(campaign.characters).map((c) => dataService.characters.values[c])} />}
    </MainContainer>;
}