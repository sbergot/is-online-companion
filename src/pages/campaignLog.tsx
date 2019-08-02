import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import { AnyLogBlock, LogType } from "../contracts/log";
import { StreamEntry } from "../contracts/persistence";
import { DataServiceContainer } from "../containers/dataService";
import { CampaignLogRouteParams } from "../services/routes";
import { Section, MainPanel } from "../components/layout";
import { Select, SmallButton } from "../components/controls";
import { LogBlock, InnerLogBlock } from "../components/log/logContent";
import { NewLogBlockEditor, LogBlockEditor } from "../components/log/logEditor";
import { StreamHook } from "../contracts/dataservice";
import { getLogTypeDescription } from "../services/logHelpers";

const allLogTypes: LogType[] = ["UserInput", "DiceRoll"];

export function CampaignLog({ match }: RouteComponentProps<CampaignLogRouteParams>) {
    const dataService = DataServiceContainer.useContainer();
    const { campaignKey, characterKey } = match.params;
    const logSource = dataService.logs(campaignKey);
    const logs = logSource.values;
    const logView = React.useRef<HTMLDivElement>(null);
    const [logType, setLogType] = React.useState<LogType>("UserInput");
    const [selected, setSelected] = React.useState<StreamEntry<AnyLogBlock> | null>(null);
    const [selectedEdited, setSelectedEdited] = React.useState(false);

    function unSelect() {
        setSelected(null);
        setSelectedEdited(false);
    }

    function toggleSelected(entry: StreamEntry<AnyLogBlock>) {
        if (selected != null && selected.key === entry.key) {
            unSelect();
        } else {
            setSelectedEdited(false);
            setSelected(entry);
        }
    }

    function onRemove(entry: StreamEntry<AnyLogBlock>) {
        logSource.remove(entry);
        unSelect();
    }

    React.useEffect(() => {
        if (logView.current) {
            const div = logView.current;
            div.scrollTop = div.scrollHeight;
        }
    }, [logs, logType])

    function onLog(block: AnyLogBlock) {
        logSource.pushNew(block);
        unSelect();
    }

    function onEditLog(oldEntry: StreamEntry<AnyLogBlock>, newBlock: AnyLogBlock) {
        const newEntry = {
            ...oldEntry,
            data: newBlock
        };
        logSource.edit(newEntry);
        unSelect();
    }

    function onEdit(entry: StreamEntry<AnyLogBlock>) {
        setLogType(entry.data.type);
        setSelectedEdited(true);
    }

    function onSelectLogType(logType: LogType) {
        unSelect();
        setLogType(logType);
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
                    options={allLogTypes.map(lt => ({ name: getLogTypeDescription(lt), value: lt }))}
                    value={logType}
                    onSelect={onSelectLogType} />
                <div className="h-40 pt-2">
                    {selected != null && selectedEdited ?
                        <LogBlockEditor
                            onLog={(newBlock) => onEditLog(selected, newBlock)}
                            logBlok={selected.data} /> :
                        <NewLogBlockEditor
                            onLog={onLog}
                            characterKey={characterKey}
                            logType={logType} />}
                </div>
            </Section>
        </MainPanel>
        <div className="p-4 w-full max-w-xs">
            {selected != null &&
                <ActionPanel
                    selected={selected}
                    onRemove={onRemove}
                    onEdit={onEdit}
                    logSource={logSource} />}
            {selectedEdited &&
                <p className="font-bold mt-2">Editing an entry...</p>}
        </div>
    </>
}

interface ActionPanelProps {
    selected: StreamEntry<AnyLogBlock>
    onRemove(entry: StreamEntry<AnyLogBlock>): void;
    onEdit(entry: StreamEntry<AnyLogBlock>): void;
    logSource: StreamHook<AnyLogBlock>;
}

function ActionPanel({ selected, logSource, onRemove, onEdit }: ActionPanelProps) {
    const canDeleteSelected = logSource.canRemove(selected);
    const dataService = DataServiceContainer.useContainer();
    const character = dataService.characters.values[selected.data.characterKey];

    return <div className="w-full">
        <InnerLogBlock entry={selected} character={character.data} />
        <div className="pt-2">
            <SmallButton
                className="mr-2"
                onClick={() => onEdit(selected)}>
                edit
            </SmallButton>
            {canDeleteSelected ?
                <SmallButton onClick={() => onRemove(selected)} >
                    delete
                </SmallButton> :
                null}
        </div>
    </div>
}