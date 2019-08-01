import * as React from "react";
import { AnyLogBlock, UserInputLog } from "../contracts/log";
import { StreamEntry } from "../contracts/persistence";
import { DataServiceContainer } from "../containers/dataService";
import { SmallButton } from "./controls";

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
        default:
            return null;
    }
}

function UserInputLogBlock({ block }: { block: UserInputLog }) {
    return <p className="whitespace-pre-wrap" >{block.payload.text}</p>
}

function LogBlockEditor({ onLog, logBlok }: EditorProps<AnyLogBlock> & {logBlok: AnyLogBlock}) {
    switch (logBlok.type) {
        case "UserInput":
            return <UserInputEditor onLog={onLog} characterKey={logBlok.characterKey} initialText={logBlok.payload.text} />;
        default:
            return null;
    }
}

interface UserInputEditorProps extends EditorProps<UserInputLog> {
    characterKey: string;
    initialText: string;
}

export function UserInputEditor({ onLog, characterKey, initialText }: UserInputEditorProps) {
    const [input, setinput] = React.useState(initialText);
    function onClick() {
        onLog({ type: "UserInput", characterKey: characterKey, payload: { text: input } });
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
