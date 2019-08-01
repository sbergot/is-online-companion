import * as React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom"

import { CampaignSelection } from "./pages/campaignSelection";
import { CampaignCharacter } from "./pages/campaignCharacter";
import { CampaignLog } from "./pages/campaignLog";
import { CampaignCharacterSelection } from "./pages/campaignCharacterSelection";
import { Campaign } from "./pages/campaign";
import * as routes from "./services/routes";
import { Menu } from "./menu";


export function Layout() {
    return <Router>
        <div className="min-h-screen flex items-stretch">
            <Menu />
            <div className="max-w-4xl pl-4 pb-4">
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