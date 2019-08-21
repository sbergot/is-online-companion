import * as React from 'react';
import { MainPanel, Section } from '../components/layout';
import { Oracle, SimpleOracle, OptionsOracle, OracleTypeKeys, OracleTypeMap, NestedOracle } from '../contracts/referential';
import oracles from '../referentials/oracles.json'
import { SmallPrimaryButton } from '../components/buttons';
import { rollTable } from '../services/rolls';
import { Variant } from '../contracts/variant';

const allOracles = oracles as Oracle[];

function extract<
    KEY extends string,
    OUT,
    INP extends Variant<string, unknown>>(variants: INP[], key: KEY): OUT[] {
    return variants.filter(v => v.type == key).map(v => v.value) as OUT[];
}

function extractOracles<K extends OracleTypeKeys>(variants: Oracle[], key: K): OracleTypeMap[K][] {
    return extract(variants, key);
}

export function OraclesPage() {
    const simpleOracles = extractOracles(allOracles, "simple");
    const optionsOracles = extractOracles(allOracles, "options");
    const nestedOracles = extractOracles(allOracles, "nested");
    return (
        <MainPanel>
            <div className="flex">
                <div className="w-2/5">
                    <Section title="Standard Oracles">
                        {simpleOracles.map(oracle => {
                            return <SimpleOracleRoll key={oracle.name} oracle={oracle} />
                        })}
                    </Section>
                </div>
                <div className="w-3/5">
                    {nestedOracles.map(oo => <NestedOracleRoll key={oo.name} oracle={oo} />)}
                    {optionsOracles.map(oo => <OptionsOracleRoll key={oo.name} oracle={oo} />)}
                </div>
            </div>
        </MainPanel>
    );
}

interface SimpleOracleRollProps {
    oracle: SimpleOracle;
}

function SimpleOracleRoll({ oracle }: SimpleOracleRollProps) {
    const [result, setResult] = React.useState("");

    function roll() {
        setResult(rollTable(oracle["random-event"]).description)
    }

    return <div className="flex justify-between mt-1">
        <SmallPrimaryButton onClick={roll}>
            {oracle.name}
        </SmallPrimaryButton>
        <p className="text-sm w-1/2">{result}</p>
    </div>
}

interface OptionsOracleRollProps {
    oracle: OptionsOracle;
}

function OptionsOracleRoll({ oracle }: OptionsOracleRollProps) {
    return <Section title={oracle.name}>
        {oracle.options.map(o => <div key={o.name} className="mr-1">
            <SimpleOracleRoll oracle={o} />
        </div>)}
    </Section>
}

interface NestedOracleRollProps {
    oracle: NestedOracle;
}

function NestedOracleRoll({ oracle }: NestedOracleRollProps) {
    const [result, setResult] = React.useState("");

    function roll() {
        const subOracle = rollTable(oracle["random-oracles"]);
        const subResult = rollTable(subOracle["random-event"]);
        setResult(`${subOracle.name} - ${subResult.description}`);
    }

    return <Section title={oracle.name}>
        <div className="flex mt-1">
            <SmallPrimaryButton onClick={roll}>
                full roll
            </SmallPrimaryButton>
            <p className="text-sm ml-8">{result}</p>
        </div>
        {oracle["random-oracles"].map(o => <div key={o.description} className="mr-1">
            <SimpleOracleRoll oracle={o} />
        </div>)}
    </Section>
}
