import { LocalStorage } from "./services/persistence/storage";
import { KeyMapSource } from "./services/persistence/keyMapSource";
import { initMetadata } from "./services/applicationMetadata";

export async function appStart() {
    const storage = new LocalStorage();
    const source = new KeyMapSource(storage, "metadata");

    const allKeys = Object.keys(source.loadAll());
    if (allKeys.length == 0) {
        source.saveNew(initMetadata());
    }
}