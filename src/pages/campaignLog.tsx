import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import { AnyLogBlock, LogType } from "../contracts/log";
import { StreamEntry } from "../contracts/persistence";
import { DataServiceContainer } from "../containers/dataService";
import { CampaignLogRouteParams } from "../services/routes";
import { Section } from "../components/layout";
import { Select } from "../components/controls";
import { LogBlock, NewLogBlockEditor } from "../components/log";

const allLogTypes: LogType[] = [ "UserInput", "DiceRoll" ];

export function CampaignLog({ match }: RouteComponentProps<CampaignLogRouteParams>) {
    const dataService = DataServiceContainer.useContainer();
    const { campaignKey, characterKey } = match.params;
    const logSource = dataService.logs(campaignKey);
    const logs = logSource.values;
    const logView = React.useRef<HTMLDivElement>(null);
    const [logType, setLogType] = React.useState<LogType>("UserInput");

    React.useEffect(() => {
        if (logView.current) {
            const div = logView.current;
            div.scrollTop = div.scrollHeight;
        }
    }, [logs])

    function onLog(block: AnyLogBlock) { logSource.pushNew(block); }

    function onEditLog(oldEntry: StreamEntry<AnyLogBlock>, newBlock: AnyLogBlock) {
        const newEntry = {
            ...oldEntry,
            data: newBlock
        };
        logSource.edit(newEntry)
    }

    return <Section className="flex flex-col justify-between h-full" title="Log">
        <div className="h-64 overflow-y-auto flex-grow" ref={logView} >
            {logs.map(l => {
                return <LogBlock
                    key={l.key}
                    entry={l}
                    canDelete={logSource.canRemove(l)}
                    onDelete={logSource.remove}
                    onLog={(newBlock) => onEditLog(l, newBlock)}
                />
            })}
        </div>
        <Select
            options={allLogTypes.map(lt => ({ name: lt, value: lt }))}
            value={logType}
            onSelect={setLogType} />
        <div>
            <NewLogBlockEditor onLog={onLog} characterKey={characterKey} logType={logType} />
        </div>
    </Section>
}

