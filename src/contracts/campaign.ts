import { Character } from "./character";

export interface Campaign {
    name: string;
    createdAt: Date;
    lastPlayed: Date;
    characters: Character[];
}

export interface CampaignSelectionState {
    campaigns: Campaign[];
}
