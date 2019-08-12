import { KeyValueStore } from '../contracts/persistence';

export class BackupManager {
    constructor(private storage: KeyValueStore) {}

    backupLocalStorage(): string {
        const backupObj: Record<string, string> = {};
        this.storage.getKeys().map(key => {
            backupObj[key] = this.storage.get(key)!;
        });
        return JSON.stringify(backupObj);
    }

    restoreLocalStorage(backup: string) {
        this.storage.clear();
        const backupObj: Record<string, string> = JSON.parse(backup);
        Object.keys(backupObj).map(k => {
            this.storage.set(k, backupObj[k]);
        });
    }

    readFile(file: File): Promise<string> {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => {
                const content = reader.result as string;
                resolve(content);
            };
            reader.readAsText(file);
        });
    }

    download(filename: string, text: string) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
}
