import * as React from "react";

import { Character, Status, TrackProgress, Debilities } from "../contracts/character";
import { CheckBox } from "./controls";
import { StatsBoxes } from "./stats";
import { Section, SubSection } from "./layout";
import { MomentumMeter, ResourceMeter, TrackMeter } from "./bars";
import { ProfunctorState } from "@staltz/use-profunctor-state";
import { Lens } from "../services/functors";
import { Vows } from "./progressChallenges";

export interface CharacterSheetProps {
    character: Character;
    setCharacter: (c: Character) => void;
}

export function CharacterSheet({lens: {state: character, zoom}}: {lens: Lens<Character>}) {
    return <div>
        <Section title="Character">
            <SubSection>
                <span>{character.name}</span>
                <span className="ml-8">Experience: {character.experience}</span>
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
            <Vows lens={zoom("vows")} />
        </Section>
        <Section title="Debilities">
            <Debilities lens={zoom("debilities")} />
        </Section>
    </div>
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
        <TrackMeter lens={lens} progressStep={1} />
    </SubSection>
}

function Debilities({lens: {state:debilities, zoom}}: {lens: Lens<Debilities>}) {
    return <div className="flex flex-row justify-between">
        {Object.keys(debilities).map((parentKey) => {
            const tparentkey = parentKey as keyof typeof debilities;
            const subObject = debilities[tparentkey];
            const subLens = zoom(tparentkey);
            return <SubSection title={parentKey} className="w-32 mr-24" key={parentKey}>
                {Object.keys(subObject).map(key => {
                    const tkey = key as keyof typeof subObject;
                    const boolLens = subLens.zoom(tkey) as unknown as Lens<boolean>;
                    return <CheckBox title={key} key={key} lens={boolLens} />
                })}
            </SubSection>
        })}
    </div>
}
