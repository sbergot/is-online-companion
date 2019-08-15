import { Campaign } from './campaign';
import { Character } from './character';
import { Note } from './note';
import { AnyLogBlock } from './log';
import { ApplicationMetadata } from './applicationMetadata';
import { KeyMapHook, StreamHook } from '../framework/contracts';

export interface DataService {
    campaigns: KeyMapHook<Campaign>;
    characters: KeyMapHook<Character>;
    metaData: KeyMapHook<ApplicationMetadata>;
    notes: KeyMapHook<Note>;
    logs: (campaignName: string) => StreamHook<AnyLogBlock>;
}
