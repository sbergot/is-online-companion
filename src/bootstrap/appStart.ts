import { LocalStorage } from "../services/persistence/storage";
import { KeyMapSource } from "../services/persistence/keyMapSource";
import { initMetadata } from "../services/applicationMetadata";

export async function appStart() {
    registerMetadata();
    registerWorker();
}

function registerWorker() {
    if ('serviceWorker' in navigator) {
        console.log('CLIENT: service worker registration in progress.');
        navigator.serviceWorker.register('worker.js').then(function () {
            console.log('CLIENT: service worker registration complete.');
        }, function () {
            console.log('CLIENT: service worker registration failure.');
        });
    }
    else {
        console.log('CLIENT: service worker is not supported.');
    }
}

function registerMetadata() {
    const storage = new LocalStorage();
    const source = new KeyMapSource(storage, "metadata");
    const allKeys = Object.keys(source.loadAll());
    if (allKeys.length == 0) {
        source.saveNew(initMetadata());
    }
}
