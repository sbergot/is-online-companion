import * as React from "react";
import { HashRouter as Router, Route } from "react-router-dom"

import { Character } from "./pages/character";
import { CampaignSelection } from "./pages/campaignSelection";
import { CharacterContainer } from "./containers/character";
import { CampaignServiceContainer } from "./containers/campaign";
import { CampaignCreation } from "./pages/campaignCreation";
import { Campaign } from "./pages/campaign";

export function App() {
    return <CharacterContainer.Provider>
        <CampaignServiceContainer.Provider>
            <Router>
                <Route exact path="/campaign/uuid/:uuid" component={Campaign} />
                <Route exact path="/campaign/selection" component={CampaignSelection} />
                <Route exact path="/campaign/creation" component={CampaignCreation} />
                <Route exact path="/character" component={Character} />
            </Router>
        </CampaignServiceContainer.Provider>
    </CharacterContainer.Provider>
}