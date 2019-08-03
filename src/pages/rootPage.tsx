import * as React from "react";

import { Section, MainPanel } from "../components/layout";
import { CampaignServiceContainer } from "../containers/campaign";
import { RouteComponentProps } from "react-router-dom";
import { characterSheetRoute, characterSelectionRoute, CampaignKeyParam } from "../services/routes";

export function RootPage({ match, history }: RouteComponentProps<CampaignKeyParam>) {
    const campaignService = CampaignServiceContainer.useContainer();
    const { campaignKey } = match.params;
    const campaignEntry = campaignService.campaigns[campaignKey];
    const campaign = campaignEntry.data;
    const initialCharacter = campaign.lastUsedCharacter;

    if (initialCharacter) {
        history.push(characterSheetRoute.to({ campaignKey, characterKey: initialCharacter }))
    } else {
        history.push(characterSelectionRoute.to({ campaignKey }));
    }

    return <MainPanel>
        <Section title="Campaign">
            {campaign.name}
        </Section>
    </MainPanel>;
}