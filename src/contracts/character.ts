import { KeyMap } from "./persistence";

export interface Character {
    name: string;
    status: Status;
    momentum: Momentum;
    stats: Stats;
    experience: number;
    debilities: Debilities;
    bonds: TrackProgress;
    vows: KeyMap<ProgressChallenge>;
    assets: Asset[];
}

export type TrackProgress = number;
export type Rank = "troublesome" | "dangerous" | "formidable" | "extreme" | "epic";

export interface ProgressChallenge {
    description: string;
    rank: Rank;
    track: TrackProgress;
}

export interface Debilities {
    conditions: Conditions;
    banes: Banes;
    burdens: Burdens;
}

export interface Conditions {
    wounded: boolean;
    shaken: boolean;
    unprepared: boolean;
    encumbered: boolean;
}

export interface Banes {
    maimed: boolean;
    corrupted: boolean;
}

export interface Burdens {
    cursed: boolean;
    tormented: boolean;
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