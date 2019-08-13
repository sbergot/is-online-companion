import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { CampaignKeyParam, CharacterKeyParam } from '../contracts/routes';
import { CharacterSheetSelection } from '../contracts/variant';
import { DataServiceContainer } from '../containers/dataService';
import { MainPanel, ActionPanel } from '../components/layout';
import { useLens } from '../framework/functors';
import { nullVariant } from '../services/variantHelpers';
import { CharacterActions } from '../components/pages/character/characterActions';
import { CharacterSheet } from '../components/pages/character/characterSheet';

export function CharacterSheetPage({ match }: RouteComponentProps<CampaignKeyParam & CharacterKeyParam>) {
    const dataService = DataServiceContainer.useContainer();
    const { characterKey, campaignKey } = match.params;
    const charactersSource = dataService.characters;
    const charLens = charactersSource.getEntryLens(characterKey).zoom('data');
    const selectedLens = useLens<CharacterSheetSelection>(nullVariant);
    const logSource = dataService.logs(campaignKey);

    return (
        <>
            <MainPanel>
                <div className="pr-2">
                    <CharacterSheet lens={charLens} selectionLens={selectedLens} />
                </div>
            </MainPanel>
            <ActionPanel>
                <CharacterActions
                    logSource={logSource}
                    charLens={charLens}
                    selectedLens={selectedLens}
                    characterKey={characterKey}
                />
            </ActionPanel>
        </>
    );
}
