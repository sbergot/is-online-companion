import * as React from "react";

import { RouteComponentProps } from "react-router-dom";
import { Character } from "../contracts/character";
import { CharacterSheet } from "../components/character/characterSheet";
import { DataServiceContainer } from "../containers/dataService";
import { useLens } from "../services/functors";
import { CampaignCharacterRouteParams } from "../services/routes";
import { MainPanel } from "../components/layout";

export function CampaignCharacter({ match }: RouteComponentProps<CampaignCharacterRouteParams>) {
    const dataService = DataServiceContainer.useContainer();
    const { characterKey } = match.params;
    const initialCharacter = dataService.characters.values[characterKey];
    const lens = useLens<Character>(initialCharacter.data);

    return <MainPanel><CharacterSheet lens={lens} /></MainPanel>;
}