import * as React from "react";

import { RouteComponentProps } from "react-router-dom";
import { CharacterSheet } from "../components/character/characterSheet";
import { DataServiceContainer } from "../containers/dataService";
import { CampaignKeyParam, CharacterKeyParam } from "../services/routes";
import { MainPanel } from "../components/layout";

export function CharacterSheetPage({ match }: RouteComponentProps<CampaignKeyParam & CharacterKeyParam>) {
    const dataService = DataServiceContainer.useContainer();
    const { characterKey } = match.params;
    const charactersSource = dataService.characters;
    const charLens = charactersSource.getEntryLens(characterKey).zoom("data");

    return <MainPanel><CharacterSheet lens={charLens} /></MainPanel>;
}