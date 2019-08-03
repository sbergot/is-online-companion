import * as React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom"

import * as routes from "./services/routes";
import { Menu } from "./menu";
import { CampaignSelection, CharacterSelection, CharacterSheetPage, LogPage, RootPage } from "./pages";
import { CombatAndTravel } from "./pages/combatAndTravel";


export function Layout() {
    return <Router>
        <div className="min-h-screen flex">
            <Menu />
            <Switch>
                <Route exact path={routes.campaignSelectionRoute} component={CampaignSelection} />
                <Route exact path={routes.campaignRoute.template} component={RootPage} />
                <Route exact path={routes.characterSelectionRoute.template} component={CharacterSelection} />
                <Route exact path={routes.logRoute.template} component={LogPage} />
                <Route exact path={routes.characterSheetRoute.template} component={CharacterSheetPage} />
                <Route exact path={routes.tracksRoute.template} component={CombatAndTravel} />
                <Route exact path="" component={RootPage} />
            </Switch>
        </div>
    </Router>
}