import { KeyEntry, KeyMap, IKeyMapSource } from "../../contracts/persistence";
import { newEntry } from "./shared";
import { reviver, replacer } from "./serialization";
import { KeyValueStore } from "./storage";

export class KeyMapSource<T> implements IKeyMapSource<T> {
    constructor(private storage: KeyValueStore, private key: string) {}

    loadAll(): KeyMap<T> {
        const rawData = this.storage.get(this.key);
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
        this.storage.set(this.key, JSON.stringify(allEntries, replacer));
        return entry;
    }

    onUpdate(cb: () => void): void {
        this.storage.onUpdate(cb);
    }

    unRegister(cb: () => void): void {
        this.storage.unRegister(cb);
    }
}
