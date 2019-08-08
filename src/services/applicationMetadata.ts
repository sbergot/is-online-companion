import { version } from "../version";
import { Lens } from "./functors";
import { DataServiceContainer } from "../containers/dataService";

export interface ApplicationMetadata {
    version: string;
    lastBackup: Date | null;
    lastRestore: Date | null;
}

export function initMetadata(): ApplicationMetadata {
    return { version: version, lastBackup: null, lastRestore: null };
}

export function setCurrentVersion(inp: ApplicationMetadata): ApplicationMetadata {
    return {...inp, version};
}

export function useMetadata(): Lens<ApplicationMetadata> {
    const dataService = DataServiceContainer.useContainer();
    const metaDataLens = dataService.metaData.lens;
    let key: string;
    const allKeys = Object.keys(metaDataLens.state);
    if (allKeys.length == 0) {
        throw new Error("metadata not found");
    } else {
        key = allKeys[0];
    }
    return dataService.metaData.getEntryLens(key).zoom("data");
}