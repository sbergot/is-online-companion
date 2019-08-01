import * as React from "react";
import { HashRouter as Router, Route, Switch, RouteComponentProps, withRouter } from "react-router-dom"

import { CampaignSelection } from "./pages/campaignSelection";
import { CampaignCharacter } from "./pages/campaignCharacter";
import { InlineLink } from "./components/controls";
import { CampaignLog } from "./pages/campaignLog";
import { CampaignCharacterSelection } from "./pages/campaignCharacterSelection";
import { Campaign } from "./pages/campaign";
import * as routes from "./services/routes";
import { DataServiceContainer } from "./containers/dataService";

function CampaignMenu({ match }: RouteComponentProps<routes.CampaignKeyParam>) {
    const dataService = DataServiceContainer.useContainer();
    const { campaignKey } = match.params;
    const campaign = dataService.campaigns.values[campaignKey];
    return campaign ? <>
        <p>
            campaign: {campaign.data.name}
        </p>
        <InlineLink to={routes.campaignSelectionRoute}>
            select another campaign
        </InlineLink>
    </> : null
}

function CharacterMenu({ match }: RouteComponentProps<routes.CampaignKeyParam & routes.CharacterKeyParam>) {
    const dataService = DataServiceContainer.useContainer();
    const { campaignKey, characterKey } = match.params;
    const character = dataService.characters.values[characterKey];
    return <>
        <p>
            character: {character.data.name}
        </p>
        <InlineLink to={routes.routeToCampaignCharacterSelection({campaignKey})}>
            select another character
            </InlineLink>
        <InlineLink to={routes.routeToCampaignCharacter({campaignKey, characterKey})}>
            go to character sheet
        </InlineLink>
        <InlineLink to={routes.routeToCampaignLog({campaignKey, characterKey})}>
            go to log
        </InlineLink>
    </>
}

function Menu() {
    return <nav className="bg-gray-300 p-3 flex flex-col">
        <h1>Ironsworn online companion</h1>
        <Route path={routes.campaignRouteTemplate} component={CampaignMenu} />
        <Route path="/campaign/:campaignKey/character/:characterKey" component={CharacterMenu} />
    </nav>
}

export function Layout() {
    return <Router>
        <div className="min-h-screen flex items-stretch">
            <Menu />
            <div className="max-w-4xl p-4">
                <Switch>
                    <Route exact path={routes.campaignSelectionRoute} component={CampaignSelection} />
                    <Route exact path={routes.campaignRouteTemplate} component={Campaign} />
                    <Route exact path={routes.campaignCharacterSelectionRouteTemplate} component={CampaignCharacterSelection} />
                    <Route exact path={routes.campaignLogRouteTemplate} component={CampaignLog} />
                    <Route exact path={routes.campaignCharacterRouteTemplate} component={CampaignCharacter} />
                </Switch>
            </div>
        </div>
    </Router>
}