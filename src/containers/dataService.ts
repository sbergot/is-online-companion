import { createContainer } from 'unstated-next';

import { DataService } from '../contracts/dataservice';
import { KeyMapSource } from '../services/persistence/keyMapSource';
import { StreamSource } from '../services/persistence/streamSource';
import { LocalStorage } from '../services/persistence/storage';
import { wrapKeyMap, wrapStream } from '../services/persistence/hookWraps';
import { useMemo } from 'react';

function useDataService(): DataService {
    const storage = new LocalStorage();

    return {
        campaigns: wrapKeyMap(new KeyMapSource(storage, 'campaigns')),
        characters: wrapKeyMap(new KeyMapSource(storage, 'characters')),
        metaData: wrapKeyMap(new KeyMapSource(storage, 'metadata')),
        logs: (campaignName: string) => {
            return wrapStream(new StreamSource(storage, 'logs', campaignName, 30));
        },
    };
}

export const DataServiceContainer = createContainer(useDataService);
