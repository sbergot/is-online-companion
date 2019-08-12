import * as React from 'react';

import { Character, Status, Debilities, StatKey } from '../../contracts/character';
import { TrackProgress, ProgressChallenge } from '../../contracts/challenge';
import { CheckBox } from '../controls';
import { StatsBoxes } from './stats';
import { Section, SubSection } from '../layout';
import { MomentumMeter, ResourceMeter, TrackMeter } from './bars';
import { Challenge } from '../progressChallenge/progressChallenges';
import { getMomentumMeta } from '../../services/characterHelpers';
import { CharacterSheetSelection } from '../../contracts/variant';
import { KeyEntry, Lens } from '../../framework/contracts';
import { nullVariant } from '../../services/variantHelpers';

interface CharacterSheetProps {
    lens: Lens<Character>;
    selectionLens: Lens<CharacterSheetSelection>;
}

export function CharacterSheet({ lens, selectionLens }: CharacterSheetProps) {
    const { state: character, zoom } = lens;
    const momentumMeta = getMomentumMeta(character);
    const selectedObj = selectionLens.state;
    const selectedStat = selectedObj.key === 'stat' ? selectedObj.value.stat : null;
    function onSelectStat(statKey: StatKey | null) {
        selectionLens.setState(() => (statKey != null ? { key: 'stat', value: { stat: statKey } } : nullVariant));
    }
    const selectedVow = selectedObj.key == 'vow' ? selectedObj.value.key : undefined;
    function onSelectVow(entry: KeyEntry<ProgressChallenge<'vow'>> | null) {
        selectionLens.setState(() => (entry != null ? { key: 'vow', value: entry } : nullVariant));
    }
    return (
        <>
            <Section title={character.name}>
                <span className="">experience: {character.experience}</span>
                <SubSection>
                    <StatsBoxes selectedStat={selectedStat} stats={character.stats} onSelectStat={onSelectStat} />
                </SubSection>
            </Section>
            <Section className="mt-4">
                <span className="text-xl">momentum</span>
                <MomentumMeter
                    minVal={-6}
                    maxVal={10}
                    reset={momentumMeta.reset}
                    tempMax={momentumMeta.max}
                    lens={zoom('momentum').zoom('level')}
                />
                <div className="mt-2">
                    <Status lens={zoom('status')} />
                </div>
            </Section>
            <Section className="mt-4">
                <Bonds lens={zoom('bonds')} />
                <div className="mt-2">
                    <Challenge lens={zoom('vows')} type="vow" onSelect={onSelectVow} selectedKey={selectedVow} />
                </div>
            </Section>
            <Section title="Debilities" className="mt-4">
                <Debilities lens={zoom('debilities')} />
            </Section>
        </>
    );
}

function Status({ lens: { state: resources, zoom } }: { lens: Lens<Status> }) {
    return (
        <div className="flex flex-row flex-wrap justify-between">
            {Object.keys(resources).map(key => {
                const tkey = key as keyof typeof resources;
                const subLens = zoom(tkey);
                return (
                    <div className="mr-2" key={key}>
                        <span className="text-xl">{key}</span>
                        <ResourceMeter minVal={0} maxVal={5} lens={subLens} />
                    </div>
                );
            })}
        </div>
    );
}

function Bonds({ lens }: { lens: Lens<TrackProgress> }) {
    return (
        <SubSection title="bonds">
            <div className="px-2 max-w-xl mt-2">
                <TrackMeter lens={lens} progressStep={1} finished={false} />
            </div>
        </SubSection>
    );
}

function Debilities({ lens: { state: debilities, zoom } }: { lens: Lens<Debilities> }) {
    return (
        <div className="flex flex-row justify-between max-w-2xl">
            {Object.keys(debilities).map(parentKey => {
                const tparentkey = parentKey as keyof typeof debilities;
                const subObject = debilities[tparentkey];
                const subLens = zoom(tparentkey);
                return (
                    <SubSection title={parentKey} className="w-32" key={parentKey}>
                        {Object.keys(subObject).map(key => {
                            const tkey = key as keyof typeof subObject;
                            const boolLens = (subLens.zoom(tkey) as unknown) as Lens<boolean>;
                            return <CheckBox title={key} key={key} lens={boolLens} />;
                        })}
                    </SubSection>
                );
            })}
        </div>
    );
}
