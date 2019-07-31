import { KeyEntry, KeyMap, KeyMapSource } from "../../contracts/persistence";
import { newEntry } from "./shared";
import { reviver, replacer } from "./serialization";

export class LocalStorageDataSet<T> implements KeyMapSource<T> {
    constructor(private key: string) {}

    loadAll(): KeyMap<T> {
        const rawData = localStorage.getItem(this.key);
        const values: KeyMap<T> =  rawData ? JSON.parse(rawData, reviver) : {};
        return values;
    }

    saveNew(data: T) {
        const entry: KeyEntry<T> = newEntry(data);
        this.innerSave(entry);
        return entry;
    }

    save(entry: KeyEntry<T>): KeyEntry<T> {
        return this.innerSave({...entry, lastModified: new Date()});
    }

    innerSave(entry: KeyEntry<T>): KeyEntry<T> {
        const allEntries = this.loadAll();
        allEntries[entry.key] = entry;
        localStorage.setItem(this.key, JSON.stringify(allEntries, replacer));
        return entry;
    }
}
