import * as React from "react";
import { DataServiceContainer } from "../containers/dataService";
import { Button } from "../components/controls";
import { RouteComponentProps } from "react-router-dom";
import { CampaignLogRouteParams } from "../services/routes";

export function CampaignLog({ match }: RouteComponentProps<CampaignLogRouteParams>) {
    const dataService = DataServiceContainer.useContainer();
    const { campaignKey } = match.params;
    const logSource = dataService.logs(campaignKey);
    const logs = logSource.values;
    const [input, setinput] = React.useState("");
    const logView = React.useRef<HTMLDivElement>(null);

    function onLog() {
        logSource.pushNew({ type: "UserInput", payload: { text: input } });
        setinput("");
    }

    React.useEffect(() => {
        if (logView.current) {
            const div = logView.current;
            div.scrollTop = div.scrollHeight;
        }
    }, [logs])

    return <>
        <div className='flex flex-col justify-between h-full'>
            <div className="h-64 overflow-y-auto" ref={logView} >
                {logs.map(l => {
                    const log = l.data;
                    if (log.type == "UserInput") {
                        return <p key={l.key}>{log.payload.text}</p>
                    }
                })}
            </div>
            <div>
                <div>
                    <textarea className="resize-none"
                        value={input}
                        onChange={(e) => setinput(e.target.value)}
                        rows={10}
                        cols={80}
                    />
                </div>
                <Button onClick={onLog}>Log</Button>
            </div>
        </div>
    </>
}