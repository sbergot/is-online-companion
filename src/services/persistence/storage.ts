export interface KeyValueStore {
    set(key: string, value: string): void;
    get(key: string): string | null;
    remove(key: string): void;
    getKeys(): string[];
    clear(): void;
    onUpdate(cb: () => void): void;
    unRegister(cb: () => void): void;
}

const registered: Function[] = [];

window.addEventListener("storage", () => {
    registered.forEach(cb => cb());
});

export class LocalStorage implements KeyValueStore {
    private path: string;

    constructor() {
        this.path = window.location.pathname;
    }

    getKey(subKey: string) {
        return `${this.path}-${subKey}`
    }

    set(key: string, value: string): void {
        localStorage.setItem(this.getKey(key), value);
    }
    
    get(key: string): string | null {
        return localStorage.getItem(this.getKey(key));
    }

    remove(key: string): void {
        localStorage.removeItem(this.getKey(key));
    }

    getKeys(): string[] {
        const keys = [];
        for (var i = 0, len = localStorage.length; i < len; ++i) {
            const key = localStorage.key(i)!;
            if (key.startsWith(this.path)) {
                keys.push(key.substr(0, this.path.length));
            }
        }
        return keys;
    }

    clear() {
        this.getKeys().map(k => {
            this.remove(k);
        })
    }

    onUpdate(cb: () => void) {
        registered.push(cb);
    }

    unRegister(cb: () => void): void {
        const idx = registered.findIndex((e) => e===cb);
        if (idx >= 0) { registered.splice(idx, 1); }
    }
}