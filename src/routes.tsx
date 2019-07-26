import * as React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom"

import { CampaignSelection } from "./pages/campaignSelection";
import { Campaign } from "./pages/campaign";
import { Nav } from "./components/layout";
import { InlineLink } from "./components/controls";

export function Routes() {
    return <Router>
        <div className="max-w-4xl mx-auto">
            <Nav><InlineLink to="/campaign/selection">Campaign selection</InlineLink></Nav>
            <Switch>
                <Route exact path="/campaign/selection" component={CampaignSelection} />
                <Route exact path="/campaign/:uuid" component={Campaign} />
            </Switch>
        </div>
    </Router>
}