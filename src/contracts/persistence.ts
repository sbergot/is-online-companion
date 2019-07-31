export interface KeyEntry<T> {
    createdAt: Date,
    lastModified: Date,
    key: string,
    data: T
}

export interface KeyMapSource<T> {
    loadAll(): KeyMap<T>;
    saveNew(data: T): KeyEntry<T>;
    save(entry: KeyEntry<T>): KeyEntry<T>;
}

export type KeyMap<T> = Record<string, KeyEntry<T>>;

export interface StreamEntry<T> extends KeyEntry<T> {
    page: number;
}

export interface StreamSource<T> {
    pushNew(value: T): StreamEntry<T>;
    getEntries(page?: number): StreamEntry<T>[];
    edit(entry: StreamEntry<T>): StreamEntry<T>;
}