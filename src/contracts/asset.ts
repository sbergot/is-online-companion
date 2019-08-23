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
    options?: ResultOption[];
    move?: Move;
}

export interface ResultOption {
    name: string;
    description: string;
}

export interface CustomNote {
    title: string;
    placeholder: string;
}

export interface Move {
    name: string;
    "move-type": string;
    description: string;
    results: MoveResultTable;
}

export type MoveResultType = "Strong Hit" | "Weak Hit" | "Miss";

export interface MoveResultTable {
    "Strong Hit": MoveResult;
    "Weak Hit": MoveResult;
    "Miss": MoveResult;
}

export interface MoveResult {
    description: string;
    options?: ResultOption[];
}
