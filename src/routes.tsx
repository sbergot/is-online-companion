import * as React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom"

import { CampaignSelection } from "./pages/campaignSelection";
import { CampaignCreation } from "./pages/campaignCreation";
import { Campaign } from "./pages/campaign";
import { Nav } from "./components/layout";
import { Link } from "./components/controls";

export function Routes() {
    return <Router>
        <Nav><Link to="/campaign/selection">Campaign selection</Link></Nav>
    <Switch>
        <Route exact path="/campaign/selection" component={CampaignSelection} />
        <Route exact path="/campaign/creation" component={CampaignCreation} />
        <Route exact path="/campaign/:uuid" component={Campaign} />
    </Switch>
</Router>
}