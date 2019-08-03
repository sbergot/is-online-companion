import { KeyMap, KeyEntry, StreamEntry } from "./persistence";
import { Campaign } from "./campaign";
import { Character } from "./character";
import { AnyLogBlock } from "./log";
import { Lens } from "../services/functors";

export interface KeyMapHook<T> {
    values: KeyMap<T>;
    getEntryLens(key: string): Lens<KeyEntry<T>>;
    saveNew(data: T): KeyEntry<T>;
    save(entry: KeyEntry<T>): KeyEntry<T>;
}

export interface StreamHook<T> {
    values: StreamEntry<T>[];
    pushNew(value: T): StreamEntry<T>;
    edit(entry: StreamEntry<T>): StreamEntry<T>;
    remove(entry: StreamEntry<T>): boolean;
    canRemove(entry: StreamEntry<T>): boolean;
}

export interface DataService {
    campaigns: KeyMapHook<Campaign>;
    characters: KeyMapHook<Character>;
    logs: (campaignName: string) => StreamHook<AnyLogBlock>;
}
