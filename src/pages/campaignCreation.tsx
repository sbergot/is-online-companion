import * as React from "react";
import { MainContainer, Section } from "../components/layout";
import { CampaignServiceContainer } from "../containers/campaign";
import { withRouter } from "react-router-dom";
import { History } from "history";
import { TextInput, Button, Label } from "../components/controls";

function CampaignCreationInner({history} : { history: History }) {
    const campaignService = CampaignServiceContainer.useContainer();
    const [ name, setName ] = React.useState("");

    function onClick() {
        const campaign = campaignService.createCampaign(name);
        history.push(campaignService.routeTo(campaign));
    }

    return <MainContainer>
        <Section title="Campaign creation">
            <div className="mb-4">
                <Label>Name</Label>
                <TextInput value={name} onChange={setName} />
            </div>
            <Button onClick={onClick}>Ok</Button>
        </Section>
    </MainContainer>;
}

export const CampaignCreation = withRouter(CampaignCreationInner);