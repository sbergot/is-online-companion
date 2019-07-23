import * as React from "react";
import { MainContainer, Section } from "../components/layout";
import { CampaignServiceContainer } from "../containers/campaign";
import { Link, RouteComponentProps } from "react-router-dom";

export function Campaign({ match }: RouteComponentProps<{ uuid: string }>) {
    const campaignService = CampaignServiceContainer.useContainer();
    const { uuid } = match.params;
    return <MainContainer>
        <Section title="Campaign">
            {campaignService.campaigns[uuid].name}
        </Section>
    </MainContainer>;
}