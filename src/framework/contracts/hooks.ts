import { Lens } from './functors';
import { KeyMap, KeyEntry, StreamEntry, StreamEntryRef } from './persistence';

export interface KeyMapHook<T> {
    lens: Lens<KeyMap<T>>;
    getEntryLens(key: string): Lens<KeyEntry<T>>;
    saveNew(data: T): KeyEntry<T>;
    save(entry: KeyEntry<T>): KeyEntry<T>;
    remove(entry: KeyEntry<T>): void;
}

export interface StreamHook<T> {
    values: StreamEntry<T>[];
    pushNew(value: T): StreamEntry<T>;
    edit(entry: StreamEntry<T>): StreamEntry<T>;
    remove(entry: StreamEntry<T>): boolean;
    canRemove(entry: StreamEntry<T>): boolean;
    find(ref: StreamEntryRef): StreamEntry<unknown>;
}
