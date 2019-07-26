import * as React from "react";
import { Link } from "react-router-dom";
import { History } from "history";

import { MainContainer, Section } from "../components/layout";
import { CampaignServiceContainer } from "../containers/campaign";
import { EntryItem, Label, TextInput, Button } from "../components/controls";
import { Campaign } from "../contracts/campaign";
import { Entry } from "../contracts/persistence";

export function CampaignSelection({ history }: { history: History }) {
    const campaignService = CampaignServiceContainer.useContainer();
    function onClick(c: Entry<Campaign>) {
        history.push(campaignService.routeTo(c));
    }

    return <MainContainer>
        <Section title="Campaign selection">
            <div className="flex">
                <div className="w-1/2 p-4">
                    Select a campaign...
                    {Object.values(campaignService.campaigns).map((c) => {
                        const route = campaignService.routeTo(c);
                        return <Link className="max-w-xs" to={route} key={c.key}>
                            <EntryItem entry={c} />
                        </Link>
                    })}
                </div>
                <div className="w-1/2 p-4">
                    ... or create a new one.
                    <CampaignForm onSubmit={(c) => onClick(c)} />
                </div>
            </div>
        </Section>
    </MainContainer>;
}

export function CampaignForm({ onSubmit }: { onSubmit: (c: Entry<Campaign>) => void }) {
    const campaignService = CampaignServiceContainer.useContainer();
    const [name, setName] = React.useState("");

    return <div>
        <div className="mb-4">
            <Label>Name</Label>
            <TextInput value={name} onChange={setName} />
        </div>
        <Button onClick={() => onSubmit(campaignService.createCampaign(name))}>Ok</Button>
    </div>
}