import { KeyMap } from './persistence';
import { ProgressChallenge } from './challenge';

export interface Campaign {
    /**
     * The campaign name
     */
    name: string;
    /**
     * a set of character keys
     */
    characters: Set<string>;
    /**
     * a set of combat tracks keys
     */
    combats: KeyMap<ProgressChallenge<'combat'>>;
    /**
     * a set of travel tracks keys
     */
    travels: KeyMap<ProgressChallenge<'travel'>>;
    /**
     * The key of the last used character
     */
    lastUsedCharacter?: string;
}
