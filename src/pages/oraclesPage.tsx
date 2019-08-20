import * as React from 'react';
import { MainPanel } from '../components/layout';
import { Oracle, SimpleOracle } from '../contracts/referential';
import oracles from '../referentials/oracles.json'
import { SmallPrimaryButton } from '../components/buttons';
import { rollOracle } from '../services/rolls';

const allOracles = oracles as Record<string, Oracle>;

export function OraclesPage() {
    return (
        <MainPanel>
            {Object.keys(allOracles).map(name => {
                return <OracleRoll key={name} oracle={allOracles[name]} name={name} />
            })}
        </MainPanel>
    );
}

interface OracleRollProps {
    oracle: Oracle;
    name: string;
}

function OracleRoll({ oracle, name }: OracleRollProps) {
    return (oracle.type == "simple" ? <SimpleOracleRoll oracle={oracle.value} name={name} /> : null)
}


interface SimpleOracleRollProps {
    oracle: SimpleOracle;
    name: string;
}

function SimpleOracleRoll({ oracle, name }: SimpleOracleRollProps) {
    const [result, setResult] = React.useState("");

    function roll(so: SimpleOracle) {
        setResult(rollOracle(so))
    }

    return <div className="flex mb-2">
        <SmallPrimaryButton onClick={() => roll(oracle)}>
            {name}
        </SmallPrimaryButton>
        <p className="text-base ml-2">{result}</p>
    </div>
}