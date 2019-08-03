import * as React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom"

import * as routes from "./services/routes";
import { Menu } from "./menu";
import { CampaignSelection, CharacterSelection, CharacterSheetPage, LogPage, RootPage } from "./pages";


export function Layout() {
    return <Router>
        <div className="min-h-screen flex">
            <Menu />
            <Switch>
                <Route exact path={routes.campaignSelectionRoute} component={CampaignSelection} />
                <Route exact path={routes.campaignRouteTemplate} component={RootPage} />
                <Route exact path={routes.characterSelectionRouteTemplate} component={CharacterSelection} />
                <Route exact path={routes.logRouteTemplate} component={LogPage} />
                <Route exact path={routes.characterSheetRouteTemplate} component={CharacterSheetPage} />
                <Route exact path="" component={RootPage} />
            </Switch>
        </div>
    </Router>
}