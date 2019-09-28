import * as React from 'react';
import { MainPanel, Section } from '../components/layout';
import assets from '../referentials/assets.json'
import { Asset } from '../contracts/asset';
import { AssetDisplay } from '../components/pages/assets/assetDisplay';

const allAssets = assets as Asset[];

export function SelectAssetsPage() {
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
