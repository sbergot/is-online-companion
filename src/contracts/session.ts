import { Campaign } from './campaign';
import { Character } from './character';

export interface Session {
    campaign: Campaign;
    character: Character;
}
