import { Variant } from "./variant";
import { EventRange } from "./shared-referential";

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
