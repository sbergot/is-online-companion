import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { CampaignKeyParam, CharacterKeyParam } from "../services/routes";
import { DataServiceContainer } from "../containers/dataService";
import { Challenge } from "../components/character/progressChallenges";
import { MainPanel } from "../components/layout";

export function CombatAndTravel({ match }: RouteComponentProps<CampaignKeyParam & CharacterKeyParam>) {
    const dataService = DataServiceContainer.useContainer();
    const { campaignKey, characterKey } = match.params;

    return <MainPanel>
        <Challenge type="travel" lens={dataService.travels.lens} />
        <Challenge type="combat" lens={dataService.combats.lens} />
    </MainPanel>
}