import * as React from "react";
import { RouteComponentProps, Route } from "react-router";
import { DataServiceContainer } from "./containers/dataService";
import { InlineLink, NavigationLink } from "./components/controls";
import * as routes from "./services/routes";

function MenuTitle({ children }: { children: React.ReactText[] }) {
    return <p className="text-lg mt-2 mb-1">
        {children}
    </p>
}

function CampaignMenu({ match }: RouteComponentProps<routes.CampaignKeyParam>) {
    const dataService = DataServiceContainer.useContainer();
    const { campaignKey } = match.params;
    const campaign = dataService.campaigns.lens.state[campaignKey];
    return campaign ? <>
        <MenuTitle>
            campaign > {campaign.data.name}
        </MenuTitle>
        <InlineLink to={routes.campaignSelectionRoute}>
            campaign selection
        </InlineLink>
    </> : null
}

function CharacterMenu({ match, location }: RouteComponentProps<routes.CampaignKeyParam & routes.CharacterKeyParam>) {
    const dataService = DataServiceContainer.useContainer();
    const { campaignKey, characterKey } = match.params;
    const character = dataService.characters.lens.state[characterKey];
    const { pathname } = location;
    const currentClass = "text-red-600";
    return <>
        <MenuTitle>
            character > {character.data.name}
        </MenuTitle>
        <NavigationLink current={pathname} to={routes.characterSelectionRoute.to({ campaignKey })}>
            character selection
        </NavigationLink>
        <NavigationLink current={pathname} to={routes.characterSheetRoute.to({ campaignKey, characterKey })}>
            character sheet
        </NavigationLink>
        <NavigationLink current={pathname} to={routes.logRoute.to({ campaignKey, characterKey })}>
            log
        </NavigationLink>
        <NavigationLink current={pathname} to={routes.tracksRoute.to({ campaignKey, characterKey })}>
            tracks
        </NavigationLink>
    </>
}

function Credits() {
    return <>
        <h1 className="text-xl font-bold">Ironsworn online companion</h1>
        <p>a game by <span className="font-semibold">Shawn Tomkin</span></p>
        <a className="text-gray-600 hover:text-red-600" href="https://www.ironswornrpg.com">
            www.ironswornrpg.com
        </a>
    </>
}

export function Menu() {
    return <nav className="bg-gray-300 p-3 flex flex-col w-full max-w-xs">
        <Credits />
        <Route path={routes.campaignRoute.template} component={CampaignMenu} />
        <Route path="/campaign/:campaignKey/character/:characterKey" component={CharacterMenu} />
    </nav>
}
