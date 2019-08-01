import * as React from "react";
import { HashRouter as Router, Route, Switch, RouteComponentProps, withRouter } from "react-router-dom"

import { CampaignSelection } from "./pages/campaignSelection";
import { CampaignCharacter } from "./pages/campaignCharacter";
import { InlineLink } from "./components/controls";
import { CampaignLog } from "./pages/campaignLog";
import { CampaignCharacterSelection } from "./pages/campaignCharacterSelection";
import { Campaign } from "./pages/campaign";
import { routeToCampaignCharacter, routeToCampaignLog, routeToCampaignCharacterSelection } from "./services/routes";
import { DataServiceContainer } from "./containers/dataService";

function CampaignMenu({ match }: RouteComponentProps<{ campaignKey: string }>) {
    const dataService = DataServiceContainer.useContainer();
    const { campaignKey } = match.params;
    const campaign = dataService.campaigns.values[campaignKey];
    return campaign ? <>
        <p>
            campaign: {campaign.data.name}
        </p>
        <InlineLink to="/campaign/selection">
            select another campaign
        </InlineLink>
    </> : null
}

function CharacterMenu({ match }: RouteComponentProps<{ campaignKey: string; characterKey: string }>) {
    const dataService = DataServiceContainer.useContainer();
    const { campaignKey, characterKey } = match.params;
    const character = dataService.characters.values[characterKey];
    return <>
        <p>
            character: {character.data.name}
        </p>
        <InlineLink to={routeToCampaignCharacterSelection(campaignKey)}>
            select another character
            </InlineLink>
        <InlineLink to={routeToCampaignCharacter(campaignKey, characterKey)}>
            go to character sheet
        </InlineLink>
        <InlineLink to={routeToCampaignLog(campaignKey, characterKey)}>
            go to log
        </InlineLink>
    </>
}

function Menu() {
    return <nav className="bg-gray-300 p-3 flex flex-col">
        <h1>Ironsworn online companion</h1>
        <Route path="/campaign/:campaignKey" component={CampaignMenu} />
        <Route path="/campaign/:campaignKey/character/:characterKey" component={CharacterMenu} />
    </nav>
}

export function Layout() {
    return <Router>
        <div className="min-h-screen flex items-stretch">
            <Menu />
            <div className="max-w-4xl p-4">
                <Switch>
                    <Route exact path="/campaign/selection" component={CampaignSelection} />
                    <Route exact path="/campaign/:campaignKey" component={Campaign} />
                    <Route exact path="/campaign/:campaignKey/character-selection" component={CampaignCharacterSelection} />
                    <Route exact path="/campaign/:campaignKey/character/:characterKey/log" component={CampaignLog} />
                    <Route exact path="/campaign/:campaignKey/character/:characterKey/character" component={CampaignCharacter} />
                </Switch>
            </div>
        </div>
    </Router>
}