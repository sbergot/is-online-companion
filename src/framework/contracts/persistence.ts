export interface KeyValueStore {
    set(key: string, value: string): void;
    get(key: string): string | null;
    remove(key: string): void;
    getKeys(): string[];
    clear(): void;
    onUpdate(cb: () => void): void;
    unRegister(cb: () => void): void;
}
