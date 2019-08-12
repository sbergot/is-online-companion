import { createContainer } from 'unstated-next';

import { DataService } from '../contracts/dataservice';
import { KeyMapSourceImpl } from '../framework/persistence/keyMapSource';
import { StreamSourceImpl } from '../framework/persistence/streamSource';
import { LocalStorage } from '../framework/persistence/storage';
import { wrapKeyMap, wrapStream } from '../framework/persistence/hookWraps';

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
