import * as React from "react";

import { RouteComponentProps } from "react-router-dom";
import { CharacterSheet } from "../components/character/characterSheet";
import { DataServiceContainer } from "../containers/dataService";
import { CampaignKeyParam, CharacterKeyParam } from "../services/routes";
import { MainPanel, ActionPanel } from "../components/layout";
import { KeyEntry } from "../contracts/persistence";
import { ProgressChallenge, ChallengeType } from "../contracts/challenge";
import { useLens, Zoom, Lens } from "../services/functors";
import { ChallengeActions } from "../components/character/progressChallenges";

export function CharacterSheetPage({ match }: RouteComponentProps<CampaignKeyParam & CharacterKeyParam>) {
    const dataService = DataServiceContainer.useContainer();
    const { characterKey } = match.params;
    const charactersSource = dataService.characters;
    const charLens = charactersSource.getEntryLens(characterKey).zoom("data");
    const selectedVowLens = useLens<KeyEntry<ProgressChallenge<"vow">> | null>(null);
    const selectedVow = selectedVowLens.state;

    return <>
        <MainPanel>
            <div className="pr-2">
                <CharacterSheet lens={charLens} selectedVowLens={selectedVowLens}/>
            </div>
        </MainPanel>
        <ActionPanel>
        {selectedVow != null ? <Zoom
                parentLens={charLens}
                zoomTo="vows">
                {sublens  => {
                    const selectedLens = sublens.zoom(selectedVow.key).zoom("data") as Lens<ProgressChallenge<ChallengeType>>;
                    return <ChallengeActions key="challengeActions" lens={selectedLens} />
                }}
            </Zoom>  : null}

        </ActionPanel>
    </>;
}