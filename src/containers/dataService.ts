import * as React from "react";
import { createContainer } from "unstated-next";

import { KeyEntry, KeyMapSource, StreamSource, StreamEntry } from "../contracts/persistence";
import { DataService, KeyMapHook, StreamHook } from "../contracts/dataservice";
import { LocalStorageKeyMapSource } from "../services/persistence/localStorageKeyMapSource";
import { LocalStorageStreamSource } from "../services/persistence/streamSource";

function useDataService(): DataService {
    return {
        campaigns: wrapKeyMap(new LocalStorageKeyMapSource("campaigns")),
        characters: wrapKeyMap(new LocalStorageKeyMapSource("characters")),
        logs: (campaignName: string) => wrapStream(new LocalStorageStreamSource('logs', campaignName, 30))
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

    const [streamState, setStreamState] = React.useState<StreamEntry<T>[]>(getLast2Pages());

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
        },
        remove(entry: StreamEntry<T>): boolean {
            if (!stream.canRemove(entry)) { return false; }
            stream.remove(entry);
            const idx = streamState.findIndex(v => v.key === entry.key);
            if (idx >= 0) {
                const newArray = streamState.slice();
                newArray.splice(idx, 1);
                setStreamState(newArray);
            }
            return true;
        },
        canRemove(entry: StreamEntry<T>): boolean {
            return stream.canRemove(entry);
        }
    }
}

export const DataServiceContainer = createContainer(useDataService);