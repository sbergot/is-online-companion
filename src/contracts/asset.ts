export interface Asset {
    name: string;
    "asset-type": string;
    description?: string;
    perks: Perk[];
    "res-counter"?: ResourceCounter;
    "custom-note"?: CustomNote;
}

export interface ResourceCounter {
    current: number;
    max: number;
}

export interface Perk {
    id: string;
    enabled: boolean;
    result: PerkResult;
}

export interface PerkResult {
    description: string;
    options?: PerkResultOption[];
}

export interface PerkResultOption {
    name: string;
    description: string;
}

export interface CustomNote {
    title: string;
    placeholder: string;
}
