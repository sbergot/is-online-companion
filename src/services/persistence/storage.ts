export interface KeyValueStore {
    set(key: string, value: string): void;
    get(key: string): string | null;
    onUpdate(cb: () => void): void;
    unRegister(cb: () => void): void;
}

const registered: Function[] = [];

window.addEventListener("storage", () => {
    registered.forEach(cb => cb());
});

export class LocalStorage implements KeyValueStore {
    set(key: string, value: string): void {
        localStorage[key] = value;
    }
    
    get(key: string): string | null {
        return localStorage[key];
    }

    onUpdate(cb: () => void) {
        registered.push(cb);
    }

    unRegister(cb: () => void): void {
        const idx = registered.findIndex((e) => e===cb);
        if (idx >= 0) { registered.splice(idx, 1); }
    }
}