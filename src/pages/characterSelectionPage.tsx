import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { KeyEntry } from '../framework/contracts';
import { Character } from '../contracts/character';
import { CampaignKeyParam } from '../contracts/routes';
import { Section, MainPanel } from '../components/layout';
import { CampaignServiceContainer } from '../containers/campaign';
import { DataServiceContainer } from '../containers/dataService';
import { characterSheetRoute } from '../services/routes';
import { CharacterPicker, CharacterForm } from '../components/pages/characterSelection/characterSelection';

export function CharacterSelection({ match, history }: RouteComponentProps<CampaignKeyParam>) {
    const campaignService = CampaignServiceContainer.useContainer();
    const dataService = DataServiceContainer.useContainer();
    const { campaignKey } = match.params;
    const campaignEntry = campaignService.campaigns[campaignKey];
    const campaign = campaignEntry.data;

    function onCharacterSelected(selectedChar: KeyEntry<Character>) {
        campaignService.addCharacter(campaignKey, selectedChar.key);
        history.push(characterSheetRoute.to({ campaignKey, characterKey: selectedChar.key }));
    }
    const characterSource = dataService.characters;
    const characters = Array.from(campaign.characters).map(c => characterSource.lens.state[c]);

    return (
        <MainPanel>
            <Section title="Character selection">
                <div className="flex">
                    <div className="w-1/2 p-2">
                        Select a character...
                        <CharacterPicker characters={characters} onSelected={onCharacterSelected} />
                    </div>
                    <div className="w-1/2 p-2">
                        ... or create a new one.
                        <CharacterForm onCreated={onCharacterSelected} />
                    </div>
                </div>
            </Section>
        </MainPanel>
    );
}
