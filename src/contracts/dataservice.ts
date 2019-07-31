import { KeyMap, KeyEntry } from "./persistence";
import { Campaign } from "./campaign";
import { Character } from "./character";
import { AnyLogBlock } from "./log";

export interface KeyMapHook<T> {
    values: KeyMap<T>;
    saveNew(data: T): KeyEntry<T>;
    save(entry: KeyEntry<T>): KeyEntry<T>;
}

export interface StreamHook<T> {
    values: KeyEntry<T>[];
    pushNew(value: T): KeyEntry<T>;
    edit(entry: KeyEntry<T>): KeyEntry<T>;
}

export interface DataService {
    campaigns: KeyMapHook<Campaign>;
    characters: KeyMapHook<Character>;
    logs: (campaignName: string) => StreamHook<AnyLogBlock>;
}
