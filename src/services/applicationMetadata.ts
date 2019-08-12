import { version } from '../bootstrap/version';
import { Lens } from '../framework/contracts';
import { DataServiceContainer } from '../containers/dataService';
import { ApplicationMetadata } from '../contracts/applicationMetadata';

export function initMetadata(): ApplicationMetadata {
    return { version: version, lastBackup: null, lastRestore: null };
}

export function setCurrentVersion(inp: ApplicationMetadata): ApplicationMetadata {
    return { ...inp, version };
}

export function useMetadata(): Lens<ApplicationMetadata> {
    const dataService = DataServiceContainer.useContainer();
    const metaDataLens = dataService.metaData.lens;
    let key: string;
    const allKeys = Object.keys(metaDataLens.state);
    if (allKeys.length == 0) {
        throw new Error('metadata not found');
    } else {
        key = allKeys[0];
    }
    return dataService.metaData.getEntryLens(key).zoom('data');
}
