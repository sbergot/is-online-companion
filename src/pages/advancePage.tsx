import * as React from 'react';
import { MainPanel, Section } from '../components/layout';
import assets from '../referentials/assets.json'
import { Asset } from '../contracts/asset';
import { AssetDisplay } from '../components/pages/assets/assetDisplay';
import { Lens } from '../framework/contracts';
import { RouteComponentProps } from 'react-router';
import { CampaignKeyParam, CharacterKeyParam } from '../contracts/routes';
import { DataServiceContainer } from '../containers/dataService';
import { SecondaryButton } from '../components/buttons';

const allAssets = assets as Asset[];

type AdvancePageMode = "edit" | "select-new";

export function AdvancePage({ match }: RouteComponentProps<CampaignKeyParam & CharacterKeyParam>) {
    const dataService = DataServiceContainer.useContainer();
    const { characterKey } = match.params;
    const charactersSource = dataService.characters;
    const charLens = charactersSource.getEntryLens(characterKey).zoom('data');
    const assetsLens = charLens.zoom("assets");
    const [mode, setMode] = React.useState<AdvancePageMode>("edit");
    return (
        <MainPanel>
            <Section title="Assets">
                {(() => {
                    switch (mode) {
                        case "edit":
                            return <EditAssets assetsLens={assetsLens} onSelectNewClick={() => setMode("select-new")} />
                        case "select-new":
                            return <SelectAsset
                                onSelect={(newAsset) => {
                                    assetsLens.setState((prevAssets) => [...prevAssets, newAsset]);
                                    setMode("edit");
                                }}
                                onCancel={() => setMode("edit")}
                            />
                    }
                })()}
            </Section>
        </MainPanel>
    );
}

interface EditAssetsProps {
    assetsLens: Lens<Asset[]>;
    onSelectNewClick(): void;
}

function EditAssets({ assetsLens, onSelectNewClick }: EditAssetsProps) {
    return <>
        <SecondaryButton onClick={onSelectNewClick}>Select new asset</SecondaryButton>
        <div className="flex flex-row flex-wrap">
            {assetsLens.state.map(a => <AssetDisplay key={a.name} asset={a} />)}
        </div>
    </>
}

interface SelectAssetProps {
    onSelect(asset: Asset): void;
    onCancel(): void;
}

function SelectAsset({ onSelect, onCancel }: SelectAssetProps) {
    return <>
        <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
        <div className="flex flex-row flex-wrap">
            {allAssets.map(a => <AssetDisplay key={a.name} asset={a} />)}
        </div>
    </>
}
