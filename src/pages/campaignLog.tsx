import * as React from "react";
import { DataServiceContainer } from "../containers/dataService";
import { RouteComponentProps } from "react-router-dom";
import { CampaignLogRouteParams } from "../services/routes";
import { Section } from "../components/layout";
import { AnyLogBlock } from "../contracts/log";
import { StreamEntry } from "../contracts/persistence";
import { LogBlock, UserInputEditor } from "../components/log";

export function CampaignLog({ match }: RouteComponentProps<CampaignLogRouteParams>) {
    const dataService = DataServiceContainer.useContainer();
    const { campaignKey, characterKey } = match.params;
    const logSource = dataService.logs(campaignKey);
    const logs = logSource.values;
    const logView = React.useRef<HTMLDivElement>(null);

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
        <div>
            <UserInputEditor onLog={onLog} characterKey={characterKey} initialText="" />
        </div>
    </Section>
}

