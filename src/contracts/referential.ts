import { Variant } from "./variant";

export type OracleTypeKeys = "simple" | "nested" | "options";

export type OracleType = SimpleOracle | NestedOracle | OptionsOracle;

export interface OracleTypeMap {
    simple: SimpleOracle;
    nested: NestedOracle;
    options: OptionsOracle;
}

export type Oracle =
    Variant<"simple", SimpleOracle> |
    Variant<"nested", NestedOracle> |
    Variant<"options", OptionsOracle>;

export interface EventRange {
    upper: number;
    description: string;
}

export interface SimpleOracle {
    name: string;
    description: string;
    "random-event": EventRange[];
}

export interface SubOracle {
    upper: number;
    name: string;
    description: string;
    "random-event": EventRange[];
}

export interface NestedOracle {
    name: string;
    description: string;
    "random-oracles": SubOracle[];
}

export interface OptionsOracle {
    name: string;
    description: string;
    options: SimpleOracle[];
}

export type RandomTableEntry<T> = T & { upper: number };

export type RandomTable<T> = RandomTableEntry<T>[];

export interface Assets {
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
