import { createContainer } from 'unstated-next';

import { DataService } from '../contracts/dataservice';
import { KeyMapSourceImpl } from '../services/persistence/keyMapSource';
import { StreamSourceImpl } from '../services/persistence/streamSource';
import { LocalStorage } from '../services/persistence/storage';
import { wrapKeyMap, wrapStream } from '../services/persistence/hookWraps';

function useDataService(): DataService {
    const storage = new LocalStorage();

    return {
        campaigns: wrapKeyMap(new KeyMapSourceImpl(storage, 'campaigns')),
        characters: wrapKeyMap(new KeyMapSourceImpl(storage, 'characters')),
        metaData: wrapKeyMap(new KeyMapSourceImpl(storage, 'metadata')),
        logs: (campaignName: string) => {
            return wrapStream(new StreamSourceImpl(storage, 'logs', campaignName, 30));
        },
    };
}

export const DataServiceContainer = createContainer(useDataService);
