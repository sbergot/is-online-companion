import * as React from "react";

import { Section, MainPanel } from "../components/layout";
import { CampaignServiceContainer } from "../containers/campaign";
import { RouteComponentProps } from "react-router-dom";
import { routeToCampaignCharacter, routeToCampaignCharacterSelection, CampaignRouteParams } from "../services/routes";

export function Campaign({ match, history }: RouteComponentProps<CampaignRouteParams>) {
    const campaignService = CampaignServiceContainer.useContainer();
    const { campaignKey } = match.params;
    const campaignEntry = campaignService.campaigns[campaignKey];
    const campaign = campaignEntry.data;
    const initialCharacter = campaign.lastUsedCharacter;

    if (initialCharacter) {
        history.push(routeToCampaignCharacter({ campaignKey, characterKey: initialCharacter }))
    } else {
        history.push(routeToCampaignCharacterSelection({ campaignKey }));
    }

    return <MainPanel>
        <Section title="Campaign">
            {campaign.name}
        </Section>
    </MainPanel>;
}