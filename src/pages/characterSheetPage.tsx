import * as React from 'react';

import { RouteComponentProps } from 'react-router-dom';
import { CharacterSheet } from '../components/character/characterSheet';
import { DataServiceContainer } from '../containers/dataService';
import { CampaignKeyParam, CharacterKeyParam } from '../contracts/routes';
import { MainPanel, ActionPanel } from '../components/layout';
import { ProgressChallenge, ChallengeType } from '../contracts/challenge';
import { useLens, Zoom } from '../framework/functors';
import { Lens } from '../framework/contracts/functors';
import { CharacterSheetSelection } from '../contracts/variant';
import { nullVariant } from '../services/variantHelpers';
import { Select, Label } from '../components/controls';
import { ChallengeActions } from '../components/progressChallenge/challengeActions';

export function CharacterSheetPage({ match }: RouteComponentProps<CampaignKeyParam & CharacterKeyParam>) {
    const dataService = DataServiceContainer.useContainer();
    const { characterKey, campaignKey } = match.params;
    const logSource = dataService.logs(campaignKey);
    const charactersSource = dataService.characters;
    const charLens = charactersSource.getEntryLens(characterKey).zoom('data');
    const statsLens = charLens.zoom('stats');
    const selectedLens = useLens<CharacterSheetSelection>(nullVariant);
    const selectedObj = selectedLens.state;
    const selectedVow = selectedObj.key != 'vow' ? null : selectedObj.value;
    const selectedStat = selectedObj.key != 'stat' ? null : selectedObj.value;

    return (
        <>
            <MainPanel>
                <div className="pr-2">
                    <CharacterSheet lens={charLens} selectionLens={selectedLens} />
                </div>
            </MainPanel>
            <ActionPanel>
                {selectedVow != null ? (
                    <Zoom parentLens={charLens} zoomTo="vows">
                        {sublens => {
                            const selectedLens = sublens.zoom(selectedVow.key).zoom('data') as Lens<
                                ProgressChallenge<ChallengeType>
                            >;
                            return (
                                <ChallengeActions
                                    key="challengeActions"
                                    lens={selectedLens}
                                    characterKey={characterKey}
                                    logSource={logSource}
                                />
                            );
                        }}
                    </Zoom>
                ) : null}
                {selectedStat != null ? (
                    <Zoom parentLens={statsLens} zoomTo={selectedStat.stat}>
                        {sublens => {
                            const statOptions = [0, 1, 2, 3, 4, 5].map(i => ({ name: i.toString(), value: i }));
                            return (
                                <>
                                    <Label>{selectedStat.stat}</Label>
                                    <Select
                                        options={statOptions}
                                        value={sublens.state}
                                        onSelect={v => sublens.setState(() => v)}
                                    />
                                </>
                            );
                        }}
                    </Zoom>
                ) : null}
            </ActionPanel>
        </>
    );
}
