import { useEffect, useState } from "react";

import { IKeyMapSource, KeyEntry, IStreamSource, StreamEntry, StreamEntryRef } from "../../contracts/persistence";
import { KeyMapHook, StreamHook } from "../../contracts/dataservice";
import { useLens } from "../functors";

export function wrapKeyMap<T>(source: IKeyMapSource<T>): KeyMapHook<T> {
    const lens = useLens(source.loadAll());
    useEffect(() => {
        function refresh() {
            lens.setState(() => {
                const data = source.loadAll();
                return data
            });
        }
        source.onUpdate(refresh);
        return () => {
            source.unRegister(refresh);
        }
    })

    function registerEntry(entry: KeyEntry<T>) {
        lens.setState((values) => ({...values, [entry.key]: entry}));
    }

    const savingLens = lens.promap(
        state => state,
        (newState, _) => {
            source.saveAll(newState);
            return newState;
        }
    );

    function getEntryLens(key: string) {
        return savingLens.zoom(key);
    }

    return {
        lens: savingLens,
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

export function wrapStream<T>(stream: IStreamSource<T>): StreamHook<T> {
    function getLast2Pages() {
        return [...stream.getEntries(1), ...stream.getEntries(0)];
    }
    const [streamState, setStreamState] = useState<StreamEntry<T>[]>(getLast2Pages());
    useEffect(() => {
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
        },
        find(ref: StreamEntryRef): StreamEntry<unknown> {
            return stream.find(ref);
        }
    }
}
