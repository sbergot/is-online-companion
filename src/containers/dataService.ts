import * as React from "react";
import { createContainer } from "unstated-next";

import { KeyEntry, IKeyMapSource, IStreamSource, StreamEntry } from "../contracts/persistence";
import { DataService, KeyMapHook, StreamHook } from "../contracts/dataservice";
import { KeyMapSource } from "../services/persistence/keyMapSource";
import { StreamSource } from "../services/persistence/streamSource";
import { LocalStorage } from "../services/persistence/storage";
import { useLens, wrapFunctor } from "../services/functors";

function useDataService(): DataService {
    const storage = new LocalStorage();

    return {
        campaigns: wrapKeyMap(new KeyMapSource(storage, "campaigns")),
        characters: wrapKeyMap(new KeyMapSource(storage, "characters")),
        logs: (campaignName: string) => wrapStream(new StreamSource(storage, 'logs', campaignName, 30))
    }
}

function wrapKeyMap<T>(source: IKeyMapSource<T>): KeyMapHook<T> {
    const lens = useLens(source.loadAll());
    React.useEffect(() => {
        function refresh() { lens.setState(() => source.loadAll()) }
        source.onUpdate(refresh);
        return () => {
            source.unRegister(refresh);
        }
    })

    function registerEntry(entry: KeyEntry<T>) {
        lens.setState((values) => ({...values, [entry.key]: entry}));
    }

    function getEntryLens(key: string) {
        return wrapFunctor(lens.promap(
            state => state[key],
            (entry, prevState) => {
                const newEntry = source.save(entry);
                return {
                    ...prevState,
                    [newEntry.key]: newEntry
                }
            }
        ));
    }

    return {
        values: lens.state,
        getEntryLens,
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

function wrapStream<T>(stream: IStreamSource<T>): StreamHook<T> {
    function getLast2Pages() {
        return [...stream.getEntries(1), ...stream.getEntries(0)];
    }
    const [streamState, setStreamState] = React.useState<StreamEntry<T>[]>(getLast2Pages());
    React.useEffect(() => {
        function refresh() { setStreamState(getLast2Pages()); }
        stream.onUpdate(refresh);
        return () => {
            stream.unRegister(refresh);
        }
    })

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