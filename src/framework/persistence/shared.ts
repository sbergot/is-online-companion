import { KeyEntry } from '../../framework/contracts';

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export function newEntry<T>(data: T): KeyEntry<T> {
    const now = new Date();
    return {
        createdAt: now,
        data,
        lastModified: now,
        key: uuidv4(),
    };
}
