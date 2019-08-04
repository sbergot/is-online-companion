import * as React from "react";

import { Character, Status, Debilities } from "../../contracts/character";
import { TrackProgress, ProgressChallenge } from "../../contracts/challenge";
import { CheckBox } from "../controls";
import { StatsBoxes } from "./stats";
import { Section, SubSection } from "../layout";
import { MomentumMeter, ResourceMeter, TrackMeter } from "./bars";
import { Lens } from "../../services/functors";
import { Challenge } from "./progressChallenges";
import { KeyEntry } from "../../contracts/persistence";

export interface CharacterSheetProps {
    lens: Lens<Character>;
    selectedVowLens: Lens<KeyEntry<ProgressChallenge<"vow">> | null>;
}

export function CharacterSheet({lens, selectedVowLens}: CharacterSheetProps) {
    const {state: character, zoom} = lens;
    return <>
        <Section title="Character">
            <SubSection>
                <span>{character.name}</span>
                <span className="ml-8">
                    experience: {character.experience}
                </span>
            </SubSection>
            <SubSection>
                <StatsBoxes stats={character.stats} />
            </SubSection>
        </Section>
        <Section title="Resources">
            <SubSection title="momentum">
                <MomentumMeter
                    minVal={-6}
                    maxVal={10}
                    reset={character.momentum.reset}
                    tempMax={character.momentum.max}
                    lens={zoom("momentum").zoom("level")}
                />
            </SubSection>
            <SubSection title="resources">
                <Status lens={zoom("status")} />
            </SubSection>
        </Section>
        <Section title="Tracks">
            <Bonds lens={zoom("bonds")} />
            <Challenge
                lens={zoom("vows")}
                type="vow"
                onSelect={(entry) => selectedVowLens.setState(() => entry)}
                selectedKey={selectedVowLens.state ? selectedVowLens.state.key : undefined} />
        </Section>
        <Section title="Debilities">
            <Debilities lens={zoom("debilities")} />
        </Section>
    </>
}

function Status({lens: { state:resources, zoom }}: { lens: Lens<Status> }) {
    return <div className="flex flex-row flex-wrap justify-between">
        {Object.keys(resources).map((key) => {
            const tkey = key as keyof typeof resources;
            const subLens = zoom(tkey);
            return <div className="mr-2" key={key}>
                <span className="text-lg">{key}</span>
                <ResourceMeter minVal={0} maxVal={5} lens={subLens} />
            </div>
        })}
    </div>
}

function Bonds({lens}: {lens: Lens<TrackProgress>}) {
    return <SubSection title="Bonds">
        <div className="px-2 max-w-xl">
            <TrackMeter lens={lens} progressStep={1} finished={false} />
        </div>
    </SubSection>
}

function Debilities({lens: {state:debilities, zoom}}: {lens: Lens<Debilities>}) {
    return <div className="flex flex-row justify-between max-w-2xl">
        {Object.keys(debilities).map((parentKey) => {
            const tparentkey = parentKey as keyof typeof debilities;
            const subObject = debilities[tparentkey];
            const subLens = zoom(tparentkey);
            return <SubSection title={parentKey} className="w-32" key={parentKey}>
                {Object.keys(subObject).map(key => {
                    const tkey = key as keyof typeof subObject;
                    const boolLens = subLens.zoom(tkey) as unknown as Lens<boolean>;
                    return <CheckBox title={key} key={key} lens={boolLens} />
                })}
            </SubSection>
        })}
    </div>
}
