import * as React from 'react';
import { Link } from 'react-router-dom';
import { History } from 'history';

import { Section, MainPanel } from '../components/layout';
import { CampaignServiceContainer } from '../containers/campaign';
import { EntryItem, Label, TextInput } from '../components/controls';
import { Campaign } from '../contracts/campaign';
import { KeyEntry } from '../framework/contracts';
import { campaignRoute } from '../services/routes';
import { PrimaryButton } from '../components/buttons';

export function CampaignSelection({ history }: { history: History }) {
    const campaignService = CampaignServiceContainer.useContainer();
    const campaigns = Object.values(campaignService.campaigns);
    function onClick(c: KeyEntry<Campaign>) {
        history.push(campaignRoute.to({ campaignKey: c.key }));
    }

    return (
        <MainPanel>
            <Section title="Campaign selection">
                <div className="flex">
                    <div className="w-1/2 p-2">
                        Select a campaign...
                        {campaigns.length > 0 ? (
                            campaigns.map(c => {
                                const route = campaignRoute.to({ campaignKey: c.key });
                                return (
                                    <Link to={route} key={c.key}>
                                        <EntryItem entry={c} />
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="w-full p-8 border-dashed border-2 text-center text-gray-500 border-gray-500">
                                Nothing to select
                            </div>
                        )}
                    </div>
                    <div className="w-1/2 p-2">
                        ... or create a new one.
                        <CampaignForm onSubmit={c => onClick(c)} />
                    </div>
                </div>
            </Section>
        </MainPanel>
    );
}

function CampaignForm({ onSubmit }: { onSubmit: (c: KeyEntry<Campaign>) => void }) {
    const campaignService = CampaignServiceContainer.useContainer();
    const [name, setName] = React.useState('');

    return (
        <div>
            <div className="mb-4">
                <Label>Name</Label>
                <TextInput value={name} onChange={setName} />
            </div>
            <div className="text-right">
                <PrimaryButton onClick={() => onSubmit(campaignService.createCampaign(name))}>Ok</PrimaryButton>
            </div>
        </div>
    );
}
