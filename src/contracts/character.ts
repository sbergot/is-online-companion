import { KeyMap } from '../framework/contracts';
import { TrackProgress, ProgressChallenge } from './challenge';
import { Asset } from './asset';

export interface Character {
    name: string;
    status: Status;
    momentum: Momentum;
    stats: Stats;
    experience: number;
    debilities: Debilities;
    bonds: TrackProgress;
    vows: KeyMap<ProgressChallenge<'vow'>>;
    assets: Asset[];
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
}

export interface Status {
    health: number;
    spirit: number;
    supply: number;
}

export type StatusKey = keyof Status;

export interface Stats {
    edge: number;
    heart: number;
    iron: number;
    shadow: number;
    wits: number;
}

export type StatKey = keyof Stats;

export interface MomentumMeta {
    reset: number;
    max: number;
}
