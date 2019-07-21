export interface Character {
    name: string;
    status: Status;
    momentum: Momentum;
    stats: Stats;
    experience: number;
    debilities: Debilities;
    bonds: Track;
    vows: Vow[];
    assets: Asset[];
}

export type Track = number;
export type Rank = "troublesome" | "dangerous" | "formidable" | "extreme" | "epic";

export interface Vow {
    description: string;
    rank: Rank;
    track: Track;
}

export interface Debilities {
    conditions: {
        wounded: boolean;
        shaken: boolean;
        unprepared: boolean;
        encumbered: boolean;
    };

    banes: {
        maimed: boolean;
        corrupted: boolean;
    };

    burdens: {
        cursed: boolean;
        tormented: boolean;
    }
}

export interface Momentum {
    level: number;
    max: number;
    reset: number;
}

export interface Status {
    health: number;
    spirit: number;
    supply: number;
}

export interface Stats {
    edge: number;
    heart: number;
    iron: number;
    shadow: number;
    wits: number;
}

export interface Asset {
    name: string;
}