import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { CampaignKeyParam, CharacterKeyParam } from "../services/routes";
import { DataServiceContainer } from "../containers/dataService";
import { Challenge, ChallengeActions } from "../components/character/progressChallenges";
import { MainPanel, ActionPanel } from "../components/layout";
import { KeyEntry } from "../contracts/persistence";
import { ProgressChallenge, ChallengeType } from "../contracts/challenge";
import { Lens } from "../services/functors";
import { Campaign } from "../contracts/campaign";

export function CombatAndTravel({ match }: RouteComponentProps<CampaignKeyParam & CharacterKeyParam>) {
    const dataService = DataServiceContainer.useContainer();
    const { campaignKey } = match.params;
    const campaignLens = dataService.campaigns.getEntryLens(campaignKey).zoom("data");
    const [selected, setSelected] = React.useState<KeyEntry<ProgressChallenge<"combat" | "travel">> | null>(null);

    return <>
        <MainPanel>
            <Challenge
                type="travel"
                lens={campaignLens.zoom("travels")}
                onSelect={setSelected}
                selectedKey={selected ? selected.key : undefined}/>
            <Challenge
                type="combat"
                lens={campaignLens.zoom("combats")}
                onSelect={setSelected}
                selectedKey={selected ? selected.key : undefined}/>
        </MainPanel>
        <ActionPanel>
            {selected != null ? <ChallengeActionsSelector lens={campaignLens} selected={selected} /> : null}
        </ActionPanel>
    </>
}

interface ChallengeActionsSelectorProps {
    lens: Lens<Campaign>;
    selected: KeyEntry<ProgressChallenge<"combat" | "travel">>;
}

function ChallengeActionsSelector({ lens, selected }: ChallengeActionsSelectorProps) {
    const selectedLens = lens
            .zoom(selected.data.type == "combat" ? "combats" : "travels")
            .zoom(selected.key) as Lens<KeyEntry<ProgressChallenge<ChallengeType>>>;

    return <ChallengeActions key="challengeActions" lens={selectedLens.zoom("data")} />
}