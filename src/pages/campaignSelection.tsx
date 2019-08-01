import * as React from "react";
import { Link } from "react-router-dom";
import { History } from "history";

import { Section } from "../components/layout";
import { CampaignServiceContainer } from "../containers/campaign";
import { EntryItem, Label, TextInput, Button } from "../components/controls";
import { Campaign } from "../contracts/campaign";
import { KeyEntry } from "../contracts/persistence";
import { routeToCampaign } from "../services/routes";

export function CampaignSelection({ history }: { history: History }) {
    const campaignService = CampaignServiceContainer.useContainer();
    function onClick(c: KeyEntry<Campaign>) {
        history.push(routeToCampaign({campaignKey: c.key}));
    }

    return <>
        <Section title="Campaign selection">
            <div className="flex">
                <div className="flex-grow p-4">
                    Select a campaign...
                    {Object.values(campaignService.campaigns).map((c) => {
                        const route = routeToCampaign({campaignKey: c.key});
                        return <Link to={route} key={c.key}>
                            <EntryItem entry={c} />
                        </Link>
                    })}
                </div>
                <div className="flex-grow p-4">
                    ... or create a new one.
                    <CampaignForm onSubmit={(c) => onClick(c)} />
                </div>
            </div>
        </Section>
    </>;
}

function CampaignForm({ onSubmit }: { onSubmit: (c: KeyEntry<Campaign>) => void }) {
    const campaignService = CampaignServiceContainer.useContainer();
    const [name, setName] = React.useState("");

    return <div>
        <div className="mb-4">
            <Label>Name</Label>
            <TextInput value={name} onChange={setName} />
        </div>
        <div className="text-right">
            <Button onClick={() => onSubmit(campaignService.createCampaign(name))}>Ok</Button>
        </div>
    </div>
}