import * as React from "react";


import { RouteComponentProps } from "react-router-dom";
import { Character } from "../contracts/character";
import { CharacterSheet } from "../components/character/characterSheet";
import { DataServiceContainer } from "../containers/dataService";
import { wrapFunctor } from "../services/functors";
import { CampaignCharacterRouteParams } from "../services/routes";
import { MainPanel } from "../components/layout";
import { KeyEntry } from "../contracts/persistence";
import { ProfunctorState } from "@staltz/use-profunctor-state";

export function CampaignCharacter({ match }: RouteComponentProps<CampaignCharacterRouteParams>) {
    const dataService = DataServiceContainer.useContainer();
    const { characterKey } = match.params;
    const charactersSource = dataService.characters;
    const charLens = charactersSource.getEntryLens(characterKey).zoom("data");

    return <MainPanel><CharacterSheet lens={charLens} /></MainPanel>;
}