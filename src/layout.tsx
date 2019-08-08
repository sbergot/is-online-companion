import * as React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom"

import * as routes from "./services/routes";
import { Menu } from "./menu";
import { CampaignSelection, CharacterSelection, CharacterSheetPage, LogPage, CharacterAutoSelection } from "./pages";
import { CombatAndTravel } from "./pages/combatAndTravel";
import { AboutPage } from "./pages/aboutPage";
import { ErrorBoundary } from "./ErrorPage";
import { setCurrentVersion, useMetadata } from "./services/applicationMetadata";


export function Layout() {
    const metaDataLens = useMetadata();
    React.useEffect(() => {
        metaDataLens.setState(setCurrentVersion);
    }, []);
    return <ErrorBoundary>
        <Router>
            <div className="min-h-screen min-w-screen flex text-gray-700">
                <Menu />
                <Switch>
                    <Route exact path={routes.campaignSelectionRoute} component={CampaignSelection} />
                    <Route exact path={routes.campaignRoute.template} component={CharacterAutoSelection} />
                    <Route exact path={routes.characterSelectionRoute.template} component={CharacterSelection} />
                    <Route exact path={routes.logRoute.template} component={LogPage} />
                    <Route exact path={routes.characterSheetRoute.template} component={CharacterSheetPage} />
                    <Route exact path={routes.tracksRoute.template} component={CombatAndTravel} />
                    <Route exact path={routes.aboutRoute} component={AboutPage} />
                    <Route exact path="" component={CampaignSelection} />
                </Switch>
            </div>
        </Router>
    </ErrorBoundary>
}