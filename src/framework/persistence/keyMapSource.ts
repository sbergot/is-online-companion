import { KeyEntry, KeyMap, KeyMapSource, KeyValueStore } from '../contracts';
import { newEntry } from './shared';
import { reviver, replacer } from './serialization';

export class KeyMapSourceImpl<T> implements KeyMapSource<T> {
    constructor(private storage: KeyValueStore, private key: string) {}

    loadAll(): KeyMap<T> {
        const rawData = this.storage.get(this.key);
        const values: KeyMap<T> = rawData ? JSON.parse(rawData, reviver) : {};
        return values;
    }

    saveAll(entries: Record<string, KeyEntry<T>>): void {
        this.innerSaveAll(entries);
    }

    saveNew(data: T) {
        const entry: KeyEntry<T> = newEntry(data);
        this.innerSave(entry);
        return entry;
    }

    save(entry: KeyEntry<T>): KeyEntry<T> {
        return this.innerSave({ ...entry, lastModified: new Date() });
    }

    innerSaveAll(entries: Record<string, KeyEntry<T>>) {
        this.storage.set(this.key, JSON.stringify(entries, replacer));
    }

    innerSave(entry: KeyEntry<T>): KeyEntry<T> {
        const allEntries = this.loadAll();
        allEntries[entry.key] = entry;
        this.innerSaveAll(allEntries);
        return entry;
    }

    remove(entry: KeyEntry<T>) {
        const allEntries = this.loadAll();
        delete allEntries[entry.key];
        this.innerSaveAll(allEntries);
    }

    onUpdate(cb: () => void): void {
        this.storage.onUpdate(cb);
    }

    unRegister(cb: () => void): void {
        this.storage.unRegister(cb);
    }
}
