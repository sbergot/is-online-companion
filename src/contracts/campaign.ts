import { KeyEntry } from "./persistence";

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
    combats: Set<string>;
    /**
     * a set of travel tracks keys
     */
    travels: Set<string>;
    /**
     * The key of the last used character
     */
    lastUsedCharacter?: string;
}

