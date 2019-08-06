import * as React from "react";
import { AnyLogBlock, LogType, UserInputLog, DiceRollLog, RollType } from "../../contracts/log";
import { SmallPrimaryButton } from "../buttons";
import { StatKey, StatusKey } from "../../contracts/character";
import { DataServiceContainer } from "../../containers/dataService";
import { Select } from "../controls";

interface EditorProps<T extends AnyLogBlock> {
    onLog(block: T): void;
}

interface LogBlockEditorProps extends EditorProps<AnyLogBlock> {
    logBlok: AnyLogBlock;
}

export function LogBlockEditor({ onLog, logBlok }: LogBlockEditorProps) {
    switch (logBlok.key) {
        case "UserInput":
            return <UserInputEditor
                onLog={onLog}
                characterKey={logBlok.value.characterKey}
                initialText={logBlok.value.text} />;
        case "DiceRoll":
            return <DiceRollEditor
                onLog={onLog}
                characterKey={logBlok.value.characterKey} />
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
                key: "UserInput",
                value: { characterKey, text: input }
            });
        setinput("");
    }

    return <div className="h-full flex flex-col items-start">
        <div className="flex-grow">
            <textarea className="resize-none border"
                value={input}
                onChange={(e) => setinput(e.target.value)}
                rows={4}
                cols={70}
            />
        </div>
        <SmallPrimaryButton onClick={onClick}>Log</SmallPrimaryButton>
    </div>
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
    const character = dataService.characters.lens.state[characterKey];
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
        let actionDie = rollDie(6);
        const currentMomentum = character.data.momentum.level;
        if (currentMomentum < 0 && (-currentMomentum) === actionDie) {
            actionDie = 0;
        }
        onLog({
            key: "DiceRoll",
            value: {
                characterKey,
                rollType,
                rollTypeStat: rollTypeStat,
                bonus,
                roll: {
                    actionDie,
                    challengeDice: [rollDie(10), rollDie(10)]
                }
            }
        });
    }

    return <div className="h-full flex flex-col items-start">
        <div className="flex flex-wrap flex-grow content-around mb-2">
            <Select className="mr-2"
                options={statsRollTypes.map(rt => ({ name: `${rt} (${getStat(rt)})`, value: rt }))}
                value={rollType as StatKey}
                onSelect={onStatSelect} />
            <Select className="mr-2"
                options={statusRollTypes.map(rt => ({ name: `${rt} (${getStatus(rt)})`, value: rt }))}
                value={rollType as StatusKey}
                onSelect={onStatusSelect} />
            <Select className="mr-2"
                options={[0, 1, 2, 3, 4, 5].map(b => ({ name: b.toString(), value: b.toString() }))}
                value={bonus.toString()}
                onSelect={(b) => setBonus(parseInt(b))} />
        </div>
        <SmallPrimaryButton onClick={onSubmit}>Log</SmallPrimaryButton>
    </div>
}