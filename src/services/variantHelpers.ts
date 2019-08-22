import { NullVariant, Variant } from '../contracts/variant';
import { OracleTypeKeys, Oracle, OracleTypeMap } from '../contracts/oracles';

export const nullVariant: NullVariant = { type: 'null', value: null };

function extract<
    KEY extends string,
    OUT,
    INP extends Variant<string, unknown>>(variants: INP[], key: KEY): OUT[] {
    return variants.filter(v => v.type == key).map(v => v.value) as OUT[];
}

export function extractOracles<K extends OracleTypeKeys>(variants: Oracle[], key: K): OracleTypeMap[K][] {
    return extract(variants, key);
}
