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

function CampaignMenu({ match, location }: RouteComponentProps<routes.CampaignKeyParam>) {
    const dataService = DataServiceContainer.useContainer();
    const { campaignKey } = match.params;
    const campaign = dataService.campaigns.lens.state[campaignKey];
    const { pathname } = location;
    return campaign ? <>
        <MenuTitle>
            campaign > {campaign.data.name}
        </MenuTitle>
        <NavigationLink current={pathname} to={routes.campaignSelectionRoute}>
            campaign selection
        </NavigationLink>
    </> : null
}

function CharacterMenu({ match, location }: RouteComponentProps<routes.CampaignKeyParam & routes.CharacterKeyParam>) {
    const dataService = DataServiceContainer.useContainer();
    const { campaignKey, characterKey } = match.params;
    const character = dataService.characters.lens.state[characterKey];
    const { pathname } = location;
    return <div className="flex flex-col">
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
    </div>
}

function Credits() {
    return <>
        <h1 className="text-xl font-bold">Ironsworn online companion</h1>
        <p>Ironsworn is an rpg by <span className="font-semibold whitespace-no-wrap">Shaw Tomkin</span></p>
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
            <img
                style={{width: "6em"}}
                src="https://static.wixstatic.com/media/4db827_0676c4f610b540fa886a79dd36f4d801~mv2.png/v1/fill/w_250,h_95,al_c,q_80/4db827_0676c4f610b540fa886a79dd36f4d801~mv2.webp" />
        </a>
        <a className="text-gray-600 hover:text-red-600" href="https://www.ironswornrpg.com">
            www.ironswornrpg.com
        </a>
    </>
}

export function Menu() {
    return <nav className="w-full bg-gray-300 p-3" style={{maxWidth: "15rem"}}>
        <Credits />
        <Route path={routes.campaignRoute.template} component={CampaignMenu} />
        <Route path="/campaign/:campaignKey/character/:characterKey" component={CharacterMenu} />
    </nav>
}
