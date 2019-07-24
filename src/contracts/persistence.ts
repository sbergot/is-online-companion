export interface Entry<T> {
    createdAt: Date,
    lastModified: Date,
    key: string,
    data: T
}

export interface KeyMapSource<T> {
    loadAll(): KeyMap<T>;
    saveNew(data: T): Entry<T>;
    save(entry: Entry<T>): Entry<T>;
}

export type KeyMap<T> = Record<string, Entry<T>>;
