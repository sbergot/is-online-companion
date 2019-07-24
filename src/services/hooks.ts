import * as React from "react";
import { Entry, KeyMapSource } from "../contracts/persistence";
import { DataService, KeyMapHook } from "../contracts/dataservice";
import { LocalStorageDataSet } from "./persistence";

export function useDataService(): DataService {
    return {
        campaigns: wrapKeyMap(new LocalStorageDataSet("campaigns"))
    }
}

function wrapKeyMap<T>(source: KeyMapSource<T>): KeyMapHook<T> {
    const [values, setValues] = React.useState(source.loadAll());

    function registerEntry(entry: Entry<T>) {
        setValues({...values, [entry.key]: entry})
    }

    return {
        values,

        saveNew(data: T) {
            const newEntry = source.saveNew(data);
            registerEntry(newEntry);
            return newEntry;
        },

        save(entry: Entry<T>) {
            const newEntry = source.save(entry);
            registerEntry(newEntry);
            return newEntry;
        }
    }
}