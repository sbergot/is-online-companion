import * as React from 'react';
import { MainPanel, Section } from '../components/layout';
import assets from '../referentials/assets.json'
import { Asset } from '../contracts/asset';

const allAssets = assets as Asset[];

export function AssetsPage() {
    return (
        <MainPanel>
            <Section title="Assets">
                <div className="flex flex-row flex-wrap">
                    {allAssets.map(a => <AssetDisplay key={a.name} asset={a} />)}
                </div>
            </Section>
        </MainPanel>
    );
}

interface AssetDisplayProps {
    asset: Asset;
}

function AssetDisplay({ asset }: AssetDisplayProps) {
    return <div className="border max-w-sm p-1 mb-2 mr-2">
        <div className="text-sm font-bold mb-1">
            {asset.name} - {asset["asset-type"]}
        </div>
        {asset.description ? <div>{asset.description}</div> : null}
        <ul className="mt-1">
            {asset.perks.map(p => (<li key={p.id} className="flex">
                <PerkActivation enabled={p.enabled} />
                <div>
                    <div className="max-w-sm w-full pl-1">{p.result.description}</div>
                </div>
            </li>))}
        </ul>
    </div>
}

interface PerkActivationProps {
    enabled: boolean;
    onClick?: () => void;
}

function PerkActivation({ onClick, enabled }: PerkActivationProps) {
    return <svg width="15" height="15" onClick={onClick}>
        <circle cx="8" cy="6" r="5" fill={enabled ? "#4a5568" : "transparent"} stroke="#4a5568" />
    </svg>
}
