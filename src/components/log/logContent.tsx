import * as React from "react";
import { AnyLogBlock, UserInputLog, DiceRollLog } from "../../contracts/log";
import { StreamEntry } from "../../contracts/persistence";
import { DataServiceContainer } from "../../containers/dataService";
import { Character } from "../../contracts/character";
import { Selectable } from "../layout";
import { getResult, getActionScore } from "../../services/rolls";

interface LogBlockProps {
    entry: StreamEntry<AnyLogBlock>;
    onSelect(entry: StreamEntry<AnyLogBlock>): void;
    selected: boolean;
}

export function LogBlock({ entry, onSelect, selected }: LogBlockProps) {
    const dataService = DataServiceContainer.useContainer();
    const character = dataService.characters.lens.state[entry.data.value.characterKey];
    return <Selectable selected={selected} onClick={() => onSelect(entry)}>
        <InnerLogBlock entry={entry} character={character.data} />
    </Selectable>
}

interface InnerLogBlockProps {
    entry: StreamEntry<AnyLogBlock>;
    character: Character;
}

export function InnerLogBlock({ entry, character }: InnerLogBlockProps) {
    return <>
        <div className="text-sm text-gray-600 w-full flex justify-between">
            <span className="mr-1">{character.name}</span>
            <span>{entry.createdAt.toLocaleString("en")}</span>
        </div>
        <LogBlockContent log={entry.data} />
    </>
}

function LogBlockContent({ log }: { log: AnyLogBlock }) {
    switch (log.key) {
        case "UserInput":
            return <UserInputLogBlock block={log} />;
        case "DiceRoll":
            return <DiceRollLogBlock block={log} />;
        default:
            return null;
    }
}

function UserInputLogBlock({ block }: { block: UserInputLog }) {
    return <p className="whitespace-pre-wrap" >{block.value.text}</p>
}

function DiceRollLogBlock({ block }: { block: DiceRollLog }) {
    const challenge = block.value;
    const result = challenge.result;
    const challengeBonusDisplay = result.bonus ? " + " + result.bonus : ""
    const score = getActionScore(result);
    return <>
        <p>roll + {challenge.type}{challengeBonusDisplay}</p>
        <p>
            {result.actionDie} + {result.stat}{challengeBonusDisplay}
             = {score}
            <span className="font-semibold mx-2">vs</span>
            {result.challengeDice[0]} & {result.challengeDice[1]}
        </p>
        <p className="font-semibold">
            {getResult(score, result.challengeDice)}
        </p>
    </>
}

