import { getLogger, setDefaultLevel } from 'loglevel';
import { LocalStorage } from '../framework/persistence/storage';
import { KeyMapSourceImpl } from '../framework/persistence/keyMapSource';
import { initMetadata, getFirstKey } from '../services/applicationMetadata';
import { ApplicationMetadata } from '../contracts/applicationMetadata';

const logger = getLogger('appStart');

function unregisterWorker() {
    logger.info('uninstall offline worker');
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (let registration of registrations) {
            registration.unregister();
        }
    });
}

function registerWorker() {
    if ('serviceWorker' in navigator) {
        logger.info('install offline worker');
        navigator.serviceWorker.register('worker.js');
    } else {
        logger.warn('service worker is not supported.');
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

function getMetadata(): ApplicationMetadata {
    const storage = new LocalStorage();
    const source = new KeyMapSourceImpl<ApplicationMetadata>(storage, 'metadata');
    const entries = source.loadAll();
    const key = getFirstKey(entries);
    return key ? entries[key].data : initMetadata();
}

export async function appStart() {
    setDefaultLevel('trace');
    const metaData = getMetadata();
    registerMetadata();
    if (metaData.offlineMode) {
        registerWorker();
    } else {
        unregisterWorker();
    }
}
