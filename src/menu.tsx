import * as React from "react";
import { RouteComponentProps, Route } from "react-router";
import { DataServiceContainer } from "./containers/dataService";
import { InlineLink } from "./components/controls";
import * as routes from "./services/routes";

function MenuTitle({ children }: { children: React.ReactText[] }) {
    return <p className="text-lg mt-2 mb-1">
        {children}
    </p>
}

function CampaignMenu({ match }: RouteComponentProps<routes.CampaignKeyParam>) {
    const dataService = DataServiceContainer.useContainer();
    const { campaignKey } = match.params;
    const campaign = dataService.campaigns.values[campaignKey];
    return campaign ? <>
        <MenuTitle>
            campaign > {campaign.data.name}
        </MenuTitle>
        <InlineLink to={routes.campaignSelectionRoute}>
            select another campaign
        </InlineLink>
    </> : null
}

function CharacterMenu({ match }: RouteComponentProps<routes.CampaignKeyParam & routes.CharacterKeyParam>) {
    const dataService = DataServiceContainer.useContainer();
    const { campaignKey, characterKey } = match.params;
    const character = dataService.characters.values[characterKey];
    return <>
        <MenuTitle>
            character > {character.data.name}
        </MenuTitle>
        <InlineLink to={routes.routeToCampaignCharacterSelection({ campaignKey })}>
            select another character
            </InlineLink>
        <InlineLink to={routes.routeToCampaignCharacter({ campaignKey, characterKey })}>
            go to character sheet
        </InlineLink>
        <InlineLink to={routes.routeToCampaignLog({ campaignKey, characterKey })}>
            go to log
        </InlineLink>
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
    return <nav className="bg-gray-300 p-3 flex flex-col">
        <Credits />
        <Route path={routes.campaignRouteTemplate} component={CampaignMenu} />
        <Route path="/campaign/:campaignKey/character/:characterKey" component={CharacterMenu} />
    </nav>
}
