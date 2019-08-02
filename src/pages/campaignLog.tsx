import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import { AnyLogBlock, LogType } from "../contracts/log";
import { StreamEntry } from "../contracts/persistence";
import { DataServiceContainer } from "../containers/dataService";
import { CampaignLogRouteParams } from "../services/routes";
import { Section, MainPanel } from "../components/layout";
import { Select, SmallButton } from "../components/controls";
import { LogBlock, NewLogBlockEditor, LogBlockEditor } from "../components/log";
import { StreamHook } from "../contracts/dataservice";

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

    function unSelect() { setSelected(null); }

    function toggleSelected(entry: StreamEntry<AnyLogBlock>) {
        if (selected != null && selected.key === entry.key) {
            unSelect();
        } else {
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
    }, [logs])

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
        setSelectedEdited(false);
        unSelect();
    }

    function onEdit() {
        setSelectedEdited(true);
    }

    return <>
        <MainPanel>
            <Section className="flex flex-col justify-between h-full" title="Log">
                <div className="h-64 overflow-y-auto flex-grow" ref={logView} >
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
                    options={allLogTypes.map(lt => ({ name: lt, value: lt }))}
                    value={logType}
                    onSelect={setLogType} />
                <div>
                    {selected != null && selectedEdited ?
                        <LogBlockEditor
                            onLog={(newBlock) => onEditLog(selected, newBlock)}
                            logBlok={selected.data}/> :
                        <NewLogBlockEditor
                            onLog={onLog}
                            characterKey={characterKey}
                            logType={logType} />}
                </div>
            </Section>
        </MainPanel>
        <div className="p-4">
            {selected != null && 
                <ActionPanel
                    selected={selected}
                    onRemove={onRemove}
                    onEdit={onEdit}
                    logSource={logSource} />}
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

    return <>
        <SmallButton onClick={() => onEdit(selected)}>
            edit
        </SmallButton>
        {canDeleteSelected ?
            <SmallButton onClick={() => onRemove(selected)} >
                delete
            </SmallButton> :
            null}
    </>
}