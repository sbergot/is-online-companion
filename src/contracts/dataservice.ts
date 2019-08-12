import { Campaign } from './campaign';
import { Character } from './character';
import { AnyLogBlock } from './log';
import { ApplicationMetadata } from './applicationMetadata';
import { KeyMapHook, StreamHook } from '../framework/contracts';

export interface DataService {
    campaigns: KeyMapHook<Campaign>;
    characters: KeyMapHook<Character>;
    metaData: KeyMapHook<ApplicationMetadata>;
    logs: (campaignName: string) => StreamHook<AnyLogBlock>;
}
