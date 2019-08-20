import { Variant } from "./variant";

export type Oracle =
    Variant<"simple", SimpleOracle> |
    Variant<"nested", NestedOracle> |
    Variant<"options", OptionsOracle>;

export interface SimpleOracle {
    description: string;
    "random-event": Record<string, string>;
}

export interface NestedOracle {
    description: string;
    "random-oracles": Record<number, SimpleOracle>;
}

export interface OptionsOracle {
    description: string;
    options: Record<string, SimpleOracle>;
}
