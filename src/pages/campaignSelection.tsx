import * as React from "react";
import { MainContainer, Section } from "../components/layout";
import { CampaignServiceContainer } from "../containers/campaign";
import { Link } from "react-router-dom";

export function CampaignSelection() {
    const campaignService = CampaignServiceContainer.useContainer();
    return <MainContainer>
        <Section title="Campaign selection">
            <span>Select a campaign or <Link to='/campaign/creation'>create one</Link></span>
            <ul>
                {Object.values(campaignService.campaigns).map((c) => {
                    const route = campaignService.routeTo(c);
                    return <Link to={route} key={c.key}>
                        {c.data.name}
                    </Link>
                })}
            </ul>
        </Section>
    </MainContainer>;
}