import * as React from "react";
import { AnyLogBlock, UserInputLog, LogType, DiceRollLog, RollType, ChallengeRoll } from "../contracts/log";
import { StreamEntry } from "../contracts/persistence";
import { DataServiceContainer } from "../containers/dataService";
import { SmallButton, Select } from "./controls";
import { StatKey, StatusKey } from "../contracts/character";

interface EditorProps<T extends AnyLogBlock> {
    onLog(block: T): void;
}

interface LogBlockProps {
    entry: StreamEntry<AnyLogBlock>;
    onDelete(entry: StreamEntry<AnyLogBlock>): void;
    canDelete: boolean;
}

export function LogBlock({ entry, onLog, onDelete, canDelete }: LogBlockProps & EditorProps<AnyLogBlock>) {
    const [editMode, setEditMode] = React.useState(false);
    const dataService = DataServiceContainer.useContainer();
    const character = dataService.characters.values[entry.data.characterKey];
    return <div className="border rounded p-2 mt-2">
        <div className="text-sm text-gray-600 w-full flex justify-between">
            <span>{character.data.name}</span>
            <span>{entry.createdAt.toDateString()}</span>
        </div>
        {editMode ?
            <LogBlockEditor
                onLog={(b) => {onLog(b); setEditMode(false)}}
                logBlok={entry.data} /> : 
            <>
                <LogBlockContent log={entry.data} />
                <SmallButton onClick={() => setEditMode(true)} >edit</SmallButton>
                {canDelete ? <SmallButton onClick={() => onDelete(entry)} >delete</SmallButton> : null}
            </>}
    </div>
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

interface LogBlockEditorProps extends EditorProps<AnyLogBlock> {
    logBlok: AnyLogBlock;
}

function LogBlockEditor({ onLog, logBlok }: LogBlockEditorProps) {
    switch (logBlok.type) {
        case "UserInput":
            return <UserInputEditor
                onLog={onLog}
                characterKey={logBlok.characterKey}
                initialText={logBlok.payload.text} />;
        case "DiceRoll":
            return <DiceRollEditor
                onLog={onLog}
                characterKey={logBlok.characterKey} />
        default:
            return null;
    }
}

interface NewLogBlockEditorProps extends EditorProps<AnyLogBlock> {
    logType: LogType;
    characterKey: string;
}

export function NewLogBlockEditor({ onLog, logType, characterKey }: NewLogBlockEditorProps) {
    switch (logType) {
        case "UserInput":
            return <UserInputEditor onLog={onLog} characterKey={characterKey} />;
        case "DiceRoll":
            return <DiceRollEditor onLog={onLog} characterKey={characterKey} />
        default:
            return null;
    }
}

interface UserInputEditorProps extends EditorProps<UserInputLog> {
    characterKey: string;
    initialText?: string;
}

function UserInputEditor({ onLog, characterKey, initialText }: UserInputEditorProps) {
    const [input, setinput] = React.useState(initialText || "");
    function onClick() {
        if (!input) { return; }
            onLog({
                type: "UserInput",
                characterKey: characterKey,
                payload: { text: input }
            });
        setinput("");
    }

    return <>
        <div>
            <textarea className="resize-none border"
                value={input}
                onChange={(e) => setinput(e.target.value)}
                rows={5}
                cols={70}
            />
        </div>
        <SmallButton onClick={onClick}>Log</SmallButton>
    </>
}

interface DiceRollEditorProps extends EditorProps<DiceRollLog> {
    characterKey: string;
}

const statsRollTypes: StatKey[] = [ "edge", "heart", "iron", "shadow", "wits" ];
const statusRollTypes: StatusKey[] = [ "health", "spirit", "supply" ];

function rollDie(i: number) {
    return Math.floor(Math.random() * i) + 1
}

function DiceRollEditor({ characterKey, onLog }: DiceRollEditorProps) {
    const dataService = DataServiceContainer.useContainer();
    const character = dataService.characters.values[characterKey];
    const [rollType, setRollType] = React.useState<RollType>("edge");
    const [bonus, setBonus] = React.useState(0);
    const [rollTypeStat, setRollTypeStat] = React.useState(getStat("edge"));

    function getStat(statKey: StatKey) { return character.data.stats[statKey]; }
    function getStatus(statusKey: StatusKey) { return character.data.status[statusKey]; }

    function onStatSelect(statKey: StatKey) {
        setRollTypeStat(getStat(statKey));
        setRollType(statKey);
    }

    function onStatusSelect(statusKey: StatusKey) {
        setRollTypeStat(getStatus(statusKey));
        setRollType(statusKey);
    }

    function onSubmit() {
        onLog({
            type: "DiceRoll",
            characterKey,
            payload: {
                rollType,
                rollTypeStat: rollTypeStat,
                bonus,
                roll: {
                    actionDie: rollDie(6),
                    challengeDice: [rollDie(10), rollDie(10)]
                }
            }
        });
    }

    return <div className="flex flex-wrap">
        <Select className="mr-2"
            options={statsRollTypes.map(rt => ({ name: `${rt} (${getStat(rt)})`, value: rt }))}
            value={rollType as StatKey}
            onSelect={onStatSelect} />
        <Select className="mr-2"
            options={statusRollTypes.map(rt => ({ name: `${rt} (${getStatus(rt)})`, value: rt }))}
            value={rollType as StatusKey}
            onSelect={onStatusSelect} />
        <Select className="mr-2"
            options={[0, 1, 2].map(b => ({ name: b.toString(), value: b.toString() }))}
            value={bonus.toString()}
            onSelect={(b) => setBonus(parseInt(b))} />
        <SmallButton onClick={onSubmit}>Log</SmallButton>
    </div>
}