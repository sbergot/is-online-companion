import { KeyEntry } from '../framework/contracts';
import { ProgressChallenge, ChallengeType } from './challenge';
import { Character } from './character';

export interface Variant<K extends string, T = null> {
    type: K;
    value: T;
}

export type NullVariant = Variant<'null'>;

export type ChallengeSelection<K extends ChallengeType> = Variant<K, KeyEntry<ProgressChallenge<K>>>;
export type StatSelection = Variant<'stat', { stat: keyof Character['stats'] }>;
export type CharacterSheetSelection = ChallengeSelection<'vow'> | StatSelection | NullVariant;
