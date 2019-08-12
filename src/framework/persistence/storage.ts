import { KeyValueStore } from '../contracts/persistence';

const registered: Function[] = [];

window.addEventListener('storage', () => {
    registered.forEach(cb => cb());
});

export class LocalStorage implements KeyValueStore {
    private path: string;

    constructor() {
        this.path = window.location.pathname;
    }

    getFullKey(subKey: string) {
        return `${this.path}-${subKey}`;
    }

    getSubKey(fullKey: string) {
        return fullKey.substr(this.path.length + 1);
    }

    set(key: string, value: string): void {
        localStorage.setItem(this.getFullKey(key), value);
    }

    get(key: string): string | null {
        return localStorage.getItem(this.getFullKey(key));
    }

    remove(key: string): void {
        localStorage.removeItem(this.getFullKey(key));
    }

    getKeys(): string[] {
        const keys = [];
        for (var i = 0, len = localStorage.length; i < len; ++i) {
            const key = localStorage.key(i)!;
            if (key.startsWith(this.path)) {
                keys.push(this.getSubKey(key));
            }
        }
        return keys;
    }

    clear() {
        this.getKeys().map(k => {
            this.remove(k);
        });
    }

    onUpdate(cb: () => void) {
        registered.push(cb);
    }

    unRegister(cb: () => void): void {
        const idx = registered.findIndex(e => e === cb);
        if (idx >= 0) {
            registered.splice(idx, 1);
        }
    }
}
