import { Character } from "./character";

export interface Campaign {
    uuid: string;
    name: string;
    createdAt: Date;
    lastPlayed: Date;
    characters: Character[];
}

export type CampaignSelectionState = Record<string, Campaign>;
