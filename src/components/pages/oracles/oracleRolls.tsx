import * as React from 'react';
import { SimpleOracle, OptionsOracle, NestedOracle } from '../../../contracts/oracles';
import { rollTable } from '../../../services/rolls';
import { SmallPrimaryButton } from '../../buttons';
import { Section } from '../../layout';

interface SimpleOracleRollProps {
    oracle: SimpleOracle;
}

export function SimpleOracleRoll({ oracle }: SimpleOracleRollProps) {
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

export function OptionsOracleRoll({ oracle }: OptionsOracleRollProps) {
    return <Section title={oracle.name}>
        {oracle.options.map(o => <div key={o.name} className="mr-1">
            <SimpleOracleRoll oracle={o} />
        </div>)}
    </Section>
}

interface NestedOracleRollProps {
    oracle: NestedOracle;
}

export function NestedOracleRoll({ oracle }: NestedOracleRollProps) {
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
