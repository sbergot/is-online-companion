import { LocalStorage } from '../framework/persistence/storage';
import { KeyMapSourceImpl } from '../framework/persistence/keyMapSource';
import { initMetadata } from '../services/applicationMetadata';

function registerWorker() {
    if ('serviceWorker' in navigator) {
        console.log('CLIENT: service worker registration in progress.');
        navigator.serviceWorker.register('worker.js').then(
            function() {
                console.log('CLIENT: service worker registration complete.');
            },
            function() {
                console.log('CLIENT: service worker registration failure.');
            },
        );
    } else {
        console.log('CLIENT: service worker is not supported.');
    }
}

function registerMetadata() {
    const storage = new LocalStorage();
    const source = new KeyMapSourceImpl(storage, 'metadata');
    const allKeys = Object.keys(source.loadAll());
    if (allKeys.length == 0) {
        source.saveNew(initMetadata());
    }
}

export async function appStart() {
    registerMetadata();
    if (1 + 1 < 1) {
        registerWorker();
    }
}
