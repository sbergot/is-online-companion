import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { CampaignKeyParam, CharacterKeyParam } from '../services/routes';
import { DataServiceContainer } from '../containers/dataService';
import { Challenge } from '../components/progressChallenge/progressChallenges';
import { ChallengeActions } from '../components/progressChallenge/challengeActions';
import { MainPanel, ActionPanel } from '../components/layout';
import { KeyEntry } from '../contracts/persistence';
import { ProgressChallenge, ChallengeType } from '../contracts/challenge';
import { Lens, Zoom } from '../services/functors';

export function CombatAndTravel({ match }: RouteComponentProps<CampaignKeyParam & CharacterKeyParam>) {
    const dataService = DataServiceContainer.useContainer();
    const { campaignKey, characterKey } = match.params;
    const logSource = dataService.logs(campaignKey);
    const campaignLens = dataService.campaigns.getEntryLens(campaignKey).zoom('data');
    const [selected, setSelected] = React.useState<KeyEntry<ProgressChallenge<'combat' | 'travel'>> | null>(null);

    return (
        <>
            <MainPanel>
                <Challenge
                    type="travel"
                    lens={campaignLens.zoom('travels')}
                    onSelect={setSelected}
                    selectedKey={selected ? selected.key : undefined}
                />
                <Challenge
                    type="combat"
                    lens={campaignLens.zoom('combats')}
                    onSelect={setSelected}
                    selectedKey={selected ? selected.key : undefined}
                />
            </MainPanel>
            <ActionPanel>
                {selected != null ? (
                    <Zoom parentLens={campaignLens} zoomTo={selected.data.type == 'combat' ? 'combats' : 'travels'}>
                        {sublens => {
                            const selectedLens = sublens.zoom(selected.key).zoom('data') as Lens<
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
            </ActionPanel>
        </>
    );
}
