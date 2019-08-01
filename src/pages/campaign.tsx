import * as React from "react";

import { Section } from "../components/layout";
import { CampaignServiceContainer } from "../containers/campaign";
import { RouteComponentProps } from "react-router-dom";
import { routeToCampaignCharacter, routeToCampaignCharacterSelection } from "../services/routes";

export function Campaign({ match, history }: RouteComponentProps<{ campaignKey: string }>) {
    const campaignService = CampaignServiceContainer.useContainer();
    const { campaignKey } = match.params;
    const campaignEntry = campaignService.campaigns[campaignKey];
    const campaign = campaignEntry.data;
    const initialCharacter = campaign.lastUsedCharacter;

    if (initialCharacter) {
        history.push(routeToCampaignCharacter(
            campaignKey,
            initialCharacter))
    } else {
        history.push(routeToCampaignCharacterSelection(campaignKey));
    }

    return <Section title="Campaign">
            {campaign.name}
        </Section>;
}