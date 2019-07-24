import * as React from "react";
import { MainContainer, Section } from "../components/layout";
import { CampaignServiceContainer } from "../containers/campaign";
import { withRouter } from "react-router-dom";
import { History } from "history";

function CampaignCreationInner({history} : { history: History }) {
    const campaignService = CampaignServiceContainer.useContainer();
    const [ name, setName ] = React.useState("");

    function onClick() {
        const campaign = campaignService.createCampaign(name);
        history.push(campaignService.routeTo(campaign));
    }

    return <MainContainer>
        <Section title="Campaign creation">
            <form>
                <label>
                    Name:
                    <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <input type="submit" onClick={onClick} />
            </form>
        </Section>
    </MainContainer>;
}

export const CampaignCreation = withRouter(CampaignCreationInner);