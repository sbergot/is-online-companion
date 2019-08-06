import * as React from "react";
import { StreamEntry } from "../../contracts/persistence";
import { AnyLogBlock, ChallengeRollLog } from "../../contracts/log";
import { StreamHook } from "../../contracts/dataservice";
import { InnerLogBlock } from "./logContent";
import { SmallPrimaryButton, SmallDangerButton } from "../buttons";
import { Character } from "../../contracts/character";
import { Lens } from "../../services/functors";
import { getMomentumMeta } from "../../services/characterHelpers";
import { burnMomentum } from "../../services/rolls";

function isChallengeRollEntry(entry: StreamEntry<AnyLogBlock>): entry is StreamEntry<ChallengeRollLog> {
    return entry.data.key === "ChallengeRoll";
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

    function burnMomentumAction(challengeRoll: StreamEntry<ChallengeRollLog>) {
        setMomentum(() => getMomentumMeta(character).reset);
        const newChallengeRoll = challengeRoll;
        const newResult = burnMomentum(challengeRoll.data.value.result, currentMomentum);
        newChallengeRoll.data.value.result = newResult;
        logSource.edit(newChallengeRoll);
    }

    return <>
        <InnerLogBlock entry={selected} character={character} />
        <div className="pt-2">
            <SmallPrimaryButton
                className="mr-2"
                onClick={() => onEdit(selected)}>
                edit
            </SmallPrimaryButton>
            {character.momentum.level > 0 && isChallengeRollEntry(selected) ?
                <SmallPrimaryButton className="mt-2" onClick={() => burnMomentumAction(selected)} >
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
