import * as React from "react";
import { StreamEntry } from "../../contracts/persistence";
import { AnyLogBlock, DiceRollLog } from "../../contracts/log";
import { StreamHook } from "../../contracts/dataservice";
import { InnerLogBlock } from "./logContent";
import { SmallPrimaryButton, SmallDangerButton } from "../buttons";
import { Character } from "../../contracts/character";
import { Lens } from "../../services/functors";
import { getMomentumMeta } from "../../services/characterHelpers";

function isDiceRollEntry(entry: StreamEntry<AnyLogBlock>): entry is StreamEntry<DiceRollLog> {
    return entry.data.key === "DiceRoll";
}

interface LogBlockActionsProps {
    selected: StreamEntry<AnyLogBlock>
    onRemove(entry: StreamEntry<AnyLogBlock>): void;
    onEdit(entry: StreamEntry<AnyLogBlock>): void;
    logSource: StreamHook<AnyLogBlock>;
    characterLens: Lens<Character>;
}

export function LogBlockActions({ selected, logSource, onRemove, onEdit, characterLens }: LogBlockActionsProps) {
    const canDeleteSelected = logSource.canRemove(selected);
    const character = characterLens.state;
    const setMomentum = characterLens.zoom("momentum").zoom("level").setState;
    const currentMomentum = character.momentum.level;

    function burnMomentum(diceRoll: StreamEntry<DiceRollLog>) {
        setMomentum(() => getMomentumMeta(character).reset);
        const newDiceRoll = diceRoll;
        const currentChallenges = diceRoll.data.value.roll.challengeDice
        const newChallenges = currentChallenges.map(v => v < currentMomentum ? 0 : v) as [number, number];
        newDiceRoll.data.value.roll.challengeDice = newChallenges;
        logSource.edit(newDiceRoll);
    }

    return <>
        <InnerLogBlock entry={selected} character={character} />
        <div className="pt-2">
            <SmallPrimaryButton
                className="mr-2"
                onClick={() => onEdit(selected)}>
                edit
            </SmallPrimaryButton>
            {character.momentum.level > 0 && isDiceRollEntry(selected) ?
                <SmallPrimaryButton className="mt-2" onClick={() => burnMomentum(selected)} >
                    burn momentum ({currentMomentum})
                </SmallPrimaryButton> :
            null}
            {canDeleteSelected ?
                <SmallDangerButton className="mt-2" onClick={() => onRemove(selected)} >
                    delete
                </SmallDangerButton> :
                null}
        </div>
    </>
}
