import * as React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import * as routes from '../services/routes';
import { Menu } from './menu';
import * as pages from '../pages';
import { ErrorBoundary } from './ErrorPage';
import { setCurrentVersion, useMetadata } from '../services/applicationMetadata';

export function Layout() {
    const metaDataLens = useMetadata();
    React.useEffect(() => {
        metaDataLens.setState(setCurrentVersion);
    }, []);
    return (
        <ErrorBoundary>
            <Router>
                <div className="min-h-screen min-w-screen flex text-gray-700 text-xs font-body">
                    <Menu />
                    <Switch>
                        <Route exact path={routes.campaignSelectionRoute} component={pages.CampaignSelection} />
                        <Route exact path={routes.campaignRoute.template} component={pages.CharacterAutoSelection} />
                        <Route exact path={routes.characterSelectionRoute.template} component={pages.CharacterSelection} />
                        <Route exact path={routes.notesRoute.template} component={pages.NotesPage} />
                        <Route exact path={routes.logRoute.template} component={pages.LogPage} />
                        <Route exact path={routes.characterSheetRoute.template} component={pages.CharacterSheetPage} />
                        <Route exact path={routes.tracksRoute.template} component={pages.CombatAndTravel} />
                        <Route exact path={routes.aboutRoute} component={pages.AboutPage} />
                        <Route exact path={routes.oraclesRoute} component={pages.OraclesPage} />
                        <Route exact path={routes.assetsRoute} component={pages.AssetsPage} />
                        <Route exact path="" component={pages.CampaignSelection} />
                    </Switch>
                </div>
            </Router>
        </ErrorBoundary>
    );
}
