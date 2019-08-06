import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import { AnyLogBlock, LogType } from "../contracts/log";
import { StreamEntry } from "../contracts/persistence";
import { DataServiceContainer } from "../containers/dataService";
import { CampaignKeyParam, CharacterKeyParam } from "../services/routes";
import { Section, MainPanel, ActionPanel } from "../components/layout";
import { Select } from "../components/controls";
import { LogBlock } from "../components/log/logContent";
import { NewLogBlockEditor, LogBlockEditor } from "../components/log/logEditor";
import { getLogTypeDescription } from "../services/logHelpers";
import { LogBlockActions } from "../components/log/logActions";

const allEditorLogTypes: LogType[] = ["UserInput", "ChallengeRoll"];

export function LogPage({ match }: RouteComponentProps<CampaignKeyParam & CharacterKeyParam>) {
    const dataService = DataServiceContainer.useContainer();
    const { campaignKey, characterKey } = match.params;
    const logSource = dataService.logs(campaignKey);
    const logs = logSource.values;
    const logView = React.useRef<HTMLDivElement>(null);
    const [logType, setLogType] = React.useState<LogType>("UserInput");
    const [selected, setSelected] = React.useState<StreamEntry<AnyLogBlock> | null>(null);
    const [selectedEdited, setSelectedEdited] = React.useState(false);
    const characterLens = dataService.characters.getEntryLens(characterKey).zoom('data');

    React.useEffect(() => {
        if (logView.current) {
            const div = logView.current;
            div.scrollTop = div.scrollHeight;
        }
    }, [logs, logType])

    function escapeSelection() {
        setSelected(null);
        setSelectedEdited(false);
    }

    function toggleSelected(entry: StreamEntry<AnyLogBlock>) {
        if (selected != null && selected.key === entry.key) {
            escapeSelection();
        } else {
            setSelectedEdited(false);
            setSelected(entry);
        }
    }

    function selectLogType(logType: LogType) {
        escapeSelection();
        setLogType(logType);
    }

    function saveNewLog(block: AnyLogBlock) {
        logSource.pushNew(block);
        escapeSelection();
    }

    function removeLog(entry: StreamEntry<AnyLogBlock>) {
        logSource.remove(entry);
        escapeSelection();
    }

    function editStart(entry: StreamEntry<AnyLogBlock>) {
        setLogType(entry.data.key);
        setSelectedEdited(true);
    }

    function editSave(oldEntry: StreamEntry<AnyLogBlock>, newBlock: AnyLogBlock) {
        const newEntry = {
            ...oldEntry,
            data: newBlock
        };
        logSource.edit(newEntry);
        escapeSelection();
    }

    return <>
        <MainPanel>
            <Section className="flex flex-col justify-between h-full" title="Log">
                <div className="h-64 overflow-y-auto flex-grow mb-2 pr-2" ref={logView} >
                    {logs.map(l => {
                        return <LogBlock
                            key={l.key}
                            entry={l}
                            onSelect={toggleSelected}
                            selected={selected != null && (l.key === selected.key)}
                        />
                    })}
                </div>
                <Select
                    options={allEditorLogTypes.map(lt => ({ name: getLogTypeDescription(lt), value: lt }))}
                    value={logType}
                    onSelect={selectLogType} />
                <div className="h-40 pt-2">
                    {selected != null && selectedEdited ?
                        <LogBlockEditor
                            onLog={(newBlock) => editSave(selected, newBlock)}
                            logBlok={selected.data} /> :
                        <NewLogBlockEditor
                            onLog={saveNewLog}
                            characterKey={characterKey}
                            logType={logType} />}
                </div>
            </Section>
        </MainPanel>
        <ActionPanel>
            {selected != null &&
                <LogBlockActions
                    selected={selected}
                    onRemove={removeLog}
                    onEdit={editStart}
                    logSource={logSource}
                    characterLens={characterLens} />}
            {selectedEdited &&
                <p className="font-bold mt-2">Editing an entry...</p>}
        </ActionPanel>
    </>
}

