import * as React from "react";
import { MainContainer, Section } from "../components/layout";
import { CampaignServiceContainer } from "../containers/campaign";
import { RouteComponentProps } from "react-router-dom";
import { Character } from "../contracts/character";
import { CharacterSelection } from "../components/characterSelection";
import { Character as CharacterComp } from "../components/character";
import { DataServiceContainer } from "../containers/dataService";
import { Entry } from "../contracts/persistence";

export function Campaign({ match }: RouteComponentProps<{ uuid: string }>) {
    const campaignService = CampaignServiceContainer.useContainer();
    const dataService = DataServiceContainer.useContainer();
    const { uuid } = match.params;
    const [character, setCharacter] = React.useState<Character | null>(null);
    const campaign = campaignService.campaigns[uuid].data;

    function onCharacterSelected(selectedChar: Entry<Character>) {
        const oldCampaign = campaignService.campaigns[uuid];
        dataService.campaigns.save({
            ...oldCampaign,
            data: {
                ...oldCampaign.data,
                characters: [
                    ...oldCampaign.data.characters,
                    selectedChar.key]
            }
        });
        setCharacter(selectedChar.data);
    }

    return <MainContainer>
        <Section title="Campaign">
            {campaign.name}
        </Section>
        {character ?
            <CharacterComp character={character} /> :
            <CharacterSelection
                onSelected={onCharacterSelected}
                characters={campaign.characters.map((c) => dataService.characters.values[c])} />}
    </MainContainer>;
}