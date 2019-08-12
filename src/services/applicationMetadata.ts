import { version } from '../bootstrap/version';
import { Lens } from '../framework/contracts';
import { DataServiceContainer } from '../containers/dataService';
import { ApplicationMetadata } from '../contracts/applicationMetadata';

export function initMetadata(): ApplicationMetadata {
    return { version: version, lastBackup: null, lastRestore: null, offlineMode: false };
}

export function setCurrentVersion(inp: ApplicationMetadata): ApplicationMetadata {
    return { ...inp, version };
}

export function getFirstKey(dict: Record<string, unknown>): string | null {
    let key: string;
    const allKeys = Object.keys(dict);
    if (allKeys.length == 0) {
        return null;
    } else {
        key = allKeys[0];
    }
    return key;
}

export function useMetadata(): Lens<ApplicationMetadata> {
    const dataService = DataServiceContainer.useContainer();
    const metaDataLens = dataService.metaData.lens;
    const key = getFirstKey(metaDataLens.state);
    if (!key) {
        throw new Error('metadata not found');
    }
    return dataService.metaData.getEntryLens(key).zoom('data');
}
