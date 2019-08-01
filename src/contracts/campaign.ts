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
     * The key of the last used character
     */
    lastUsedCharacter?: string;
}

