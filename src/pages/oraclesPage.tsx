import * as React from 'react';
import { MainPanel, Section } from '../components/layout';
import { Oracle } from '../contracts/oracles';
import oracles from '../referentials/oracles.json'
import { SimpleOracleRoll, NestedOracleRoll, OptionsOracleRoll } from '../components/pages/oracles/oracleRolls';
import { extractOracles } from '../services/variantHelpers';

const allOracles = oracles as Oracle[];

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
