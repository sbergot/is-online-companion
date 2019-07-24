import * as React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom"

import { Character } from "./pages/character";
import { CampaignSelection } from "./pages/campaignSelection";
import { CampaignCreation } from "./pages/campaignCreation";
import { Campaign } from "./pages/campaign";

export function Routes() {
    return <Router>
    <Switch>
        <Route exact path="/campaign/selection" component={CampaignSelection} />
        <Route exact path="/campaign/creation" component={CampaignCreation} />
        <Route exact path="/campaign/:uuid" component={Campaign} />
        <Route exact path="/character" component={Character} />
    </Switch>
</Router>
}