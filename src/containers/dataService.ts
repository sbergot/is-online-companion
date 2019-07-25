import * as React from "react";
import { createContainer } from "unstated-next";

import { Entry, KeyMapSource } from "../contracts/persistence";
import { DataService, KeyMapHook } from "../contracts/dataservice";
import { LocalStorageDataSet } from "../services/persistence";

function useDataService(): DataService {
    return {
        campaigns: wrapKeyMap(new LocalStorageDataSet("campaigns")),
        characters: wrapKeyMap(new LocalStorageDataSet("characters"))
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

export const DataServiceContainer = createContainer(useDataService);