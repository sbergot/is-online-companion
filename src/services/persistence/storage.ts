export interface KeyValueStore {
    set(key: string, value: string): void;
    get(key: string): string | null;
    onUpdate(cb: () => void): void;
    unRegister(cb: () => void): void;
}

export class LocalStorage implements KeyValueStore {
    set(key: string, value: string): void {
        localStorage[key] = value;
    }
    
    get(key: string): string | null {
        return localStorage[key];
    }

    onUpdate(cb: () => void) {
        window.addEventListener("storage", cb);
    }

    unRegister(cb: () => void): void {
        window.removeEventListener("storage", cb);
    }
}