import * as React from "react";
import { AnyLogBlock, UserInputLog, DiceRollLog, ChallengeRoll } from "../../contracts/log";
import { StreamEntry } from "../../contracts/persistence";
import { DataServiceContainer } from "../../containers/dataService";
import { Character } from "../../contracts/character";


interface LogBlockProps {
    entry: StreamEntry<AnyLogBlock>;
    onSelect(entry: StreamEntry<AnyLogBlock>): void;
    selected: boolean;
}

export function LogBlock({ entry, onSelect, selected }: LogBlockProps) {
    const dataService = DataServiceContainer.useContainer();
    const character = dataService.characters.values[entry.data.characterKey];
    const classes = [
        "border border-gray-200 rounded p-2 mt-2 cursor-pointer hover:shadow",
        selected ? "bg-gray-400" : ""
    ].join(" ");
    return <div className={classes} onClick={() => onSelect(entry)}>
        <InnerLogBlock entry={entry} character={character.data} />
    </div>
}

interface InnerLogBlockProps {
    entry: StreamEntry<AnyLogBlock>;
    character: Character;
}

export function InnerLogBlock({ entry, character }: InnerLogBlockProps) {
    return <>
        <div className="text-sm text-gray-600 w-full flex justify-between">
            <span>{character.name}</span>
            <span>{entry.createdAt.toLocaleString("en")}</span>
        </div>
        <LogBlockContent log={entry.data} />
    </>
}

function LogBlockContent({ log }: { log: AnyLogBlock }) {
    switch (log.type) {
        case "UserInput":
            return <UserInputLogBlock block={log} />;
        case "DiceRoll":
            return <DiceRollLogBlock block={log} />;
        default:
            return null;
    }
}

function UserInputLogBlock({ block }: { block: UserInputLog }) {
    return <p className="whitespace-pre-wrap" >{block.payload.text}</p>
}

function getActionScore(challenge: ChallengeRoll): number {
    return challenge.roll.actionDie + challenge.rollTypeStat + challenge.bonus;
}

function getResult(challenge: ChallengeRoll): string {
    const actionScore = getActionScore(challenge);
    const success = challenge.roll.challengeDice.filter(cd => cd < actionScore).length;
    switch(success) {
        case 0:
            return "miss";
        case 1:
            return "weak hit";
        case 2:
            return "strong hit";
        default:
            return "impossible";
    }

}

function DiceRollLogBlock({ block }: { block: DiceRollLog }) {
    const challenge = block.payload;
    const challengeBonusDisplay = challenge.bonus ? " + " + challenge.bonus : ""
    return <>
        <p>roll + {challenge.rollType}{challengeBonusDisplay}</p>
        <p>
            {challenge.roll.actionDie} + {challenge.rollTypeStat}{challengeBonusDisplay}
             = {getActionScore(challenge)}
            <span className="font-semibold mx-2">vs</span>{" "}
            {challenge.roll.challengeDice[0]} & {challenge.roll.challengeDice[1]}
        </p>
        <p className="font-semibold">
            {getResult(challenge)}
        </p>
    </>
}

