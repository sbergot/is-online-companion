import * as React from "react";
import { createContainer } from "unstated-next";

import { KeyEntry, KeyMapSource, StreamSource, StreamEntry } from "../contracts/persistence";
import { DataService, KeyMapHook, StreamHook } from "../contracts/dataservice";
import { LocalStorageDataSet } from "../services/persistence/localStorageDataSet";
import { LocalStorageStreamSource } from "../services/persistence/streamSource";

function useDataService(): DataService {
    return {
        campaigns: wrapKeyMap(new LocalStorageDataSet("campaigns")),
        characters: wrapKeyMap(new LocalStorageDataSet("characters")),
        logs: (campaignName: string) => wrapStream(new LocalStorageStreamSource('logs', campaignName, 3))
    }
}

function wrapKeyMap<T>(source: KeyMapSource<T>): KeyMapHook<T> {
    const [values, setValues] = React.useState(source.loadAll());

    function registerEntry(entry: KeyEntry<T>) {
        setValues({...values, [entry.key]: entry})
    }

    return {
        values,
        saveNew(data: T) {
            const newEntry = source.saveNew(data);
            registerEntry(newEntry);
            return newEntry;
        },
        save(entry: KeyEntry<T>) {
            const newEntry = source.save(entry);
            registerEntry(newEntry);
            return newEntry;
        }
    }
}

function wrapStream<T>(stream: StreamSource<T>): StreamHook<T> {
    function getLast2Pages() {
        return [...stream.getEntries(1), ...stream.getEntries(0)];
    }

    const [streamState, setStreamState] = React.useState<KeyEntry<T>[]>(getLast2Pages());

    return {
        values: streamState,
        pushNew(value: T) {
            const entry = stream.pushNew(value);
            setStreamState(getLast2Pages());
            return entry;
        },
        edit(entry: StreamEntry<T>) {
            const newEntry = stream.edit(entry);
            const idx = streamState.findIndex(v => v.key === entry.key);
            if (idx >= 0) {
                const newArray = streamState.slice();
                newArray[idx] = newEntry;
                setStreamState(newArray);
            }
            return newEntry;
        }
    }
}

export const DataServiceContainer = createContainer(useDataService);