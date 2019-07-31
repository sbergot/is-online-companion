import * as React from "react";
import { MainContainer } from "../components/layout";
import { DataServiceContainer } from "../containers/dataService";
import { Button } from "../components/controls";
import { RouteComponentProps } from "react-router-dom";

export function CampaignLog({ match }: RouteComponentProps<{ key: string }>) {
    const dataService = DataServiceContainer.useContainer();
    const { key } = match.params;
    const logSource = dataService.logs(key);
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

    return <MainContainer>
        <div className='flex flex-col justify-between h-full'>
            <div className="h-64 overflow-y-auto" ref={logView} >
                {logs.map(l => {
                    const log = l.data;
                    if (log.type == "UserInput") {
                        return <p>{log.payload.text}</p>
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
    </MainContainer>
}