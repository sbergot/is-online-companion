import { KeyMapSource, KeyMap, Entry } from "./persistence";
import { Campaign } from "./campaign";

export interface KeyMapHook<T> {
    values: KeyMap<T>;
    saveNew(data: T): Entry<T>;
    save(entry: Entry<T>): Entry<T>;
}

export interface DataService {
    campaigns: KeyMapHook<Campaign>;
}
