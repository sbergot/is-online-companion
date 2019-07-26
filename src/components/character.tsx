import * as React from "react";

import { Character, Momentum, Status, Track, Vow, Debilities, Conditions, Banes, Burdens } from "../contracts/character";
import { CheckBox } from "./controls";
import { StatsBoxes } from "./stats";
import { Section, SubSection } from "./layout";
import { MomentumMeter, ResourceMeter, TrackMeter } from "./bars";

export interface CharacterSheetProps {
    character: Character;
    setCharacter: (c: Character) => void;
}

export function CharacterSheet({ character, setCharacter }: CharacterSheetProps) {
    return <div>
        <Section title="Character">
            <SubSection>
                <CharacterName name={character.name} />
                <Experience level={character.experience} />
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
                    level={character.momentum.level}
                    reset={character.momentum.reset}
                    tempMax={character.momentum.max}
                    onUpdate={(level) => setCharacter({ ...character, momentum: { ...character.momentum, level } })}
                />
            </SubSection>
            <SubSection title="resources">
                <Status resources={character.status} setResources={(status) => setCharacter({...character, status})} />
            </SubSection>
        </Section>
        <Section title="Tracks">
            <Bonds bonds={character.bonds} />
            <Vows vows={character.vows} />
        </Section>
        <Section title="Debilities">
            <Debilities
                debilities={character.debilities}
                setDebilities={(debilities) => setCharacter({ ...character, debilities })} />
        </Section>
    </div>
}

function CharacterName({ name }: { name: string }) {
    return <span>{name}</span>
}

function Experience({ level }: { level: number }) {
    return <span className="ml-8">Experience: {level}</span>
}


function Status({ resources, setResources }: { resources: Status, setResources: (s: Status) => void }) {
    return <div className="flex flex-row flex-wrap justify-between">
        {Object.keys(resources).map((key) => {
            const tkey = key as keyof typeof resources;
            return <div className="mr-2" key={key}>
                <span className="text-lg">{key}</span>
                <ResourceMeter
                    level={resources[tkey]}
                    minVal={0}
                    maxVal={5}
                    onUpdate={(v) => setResources({...resources, [tkey]: v})} />
            </div>
        })}
    </div>
}

function Bonds({ bonds }: { bonds: Track }) {
    return <SubSection title="Bonds">
        <TrackMeter track={bonds} />
    </SubSection>
}

function Vows({ vows }: { vows: Vow[] }) {
    return <SubSection title="Vows">
        {vows.map(v => <div className="vow">
            <div>{v.description} / {v.rank}</div>
            <TrackMeter track={v.track} />
        </div>)}
    </SubSection>
}

interface DebilitiesProps {
    debilities: Debilities;
    setDebilities: (d: Debilities) => void;
}

function Debilities({ debilities, setDebilities }: DebilitiesProps) {
    return <div className="flex flex-row justify-between">
        {Object.keys(debilities).map((parentKey) => {
            const tparentkey = parentKey as keyof typeof debilities;
            const subObject = debilities[tparentkey];
            return <SubSection title={parentKey} className="w-32 mr-24" key={parentKey}>
                {Object.keys(subObject).map(key => {
                    const tkey = key as keyof typeof subObject;
                    const value = subObject[tkey] as boolean;
                    function onToggle() {
                        setDebilities({ ...debilities, [parentKey]: { ...subObject, [key]: !value } });
                    }
                    return <CheckBox checked={value} title={key} onClick={onToggle} key={key} />
                })}
            </SubSection>
        })}
    </div>
}
