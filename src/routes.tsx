import * as React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom"

import { CampaignSelection } from "./pages/campaignSelection";
import { CampaignCharacter } from "./pages/campaignCharacter";
import { Nav } from "./components/layout";
import { InlineLink } from "./components/controls";
import { CampaignLog } from "./pages/campaignLog";

export function Routes() {
    return <Router>
        <div className="max-w-4xl mx-auto h-screen flex flex-col">
            <Nav><InlineLink to="/campaign/selection">Campaign selection</InlineLink></Nav>
            <div className="flex-grow">
            <Switch>
                <Route exact path="/campaign/selection" component={CampaignSelection} />
                <Route exact path="/campaign/:key/character" component={CampaignCharacter} />
                <Route exact path="/campaign/:key/log" component={CampaignLog} />
            </Switch>
            </div>
        </div>
    </Router>
}