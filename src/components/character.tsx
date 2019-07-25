import * as React from "react";

import { Character, Momentum, Status, Track, Vow, Debilities, Conditions, Banes, Burdens } from "../contracts/character";
import { CheckBox } from "./controls";
import { StatsBoxes } from "./stats";
import { Section, SubSection } from "./layout";
import { MomentumMeter, ResourceMeter, TrackMeter } from "./bars";

export function Character({ character }: { character: Character }) {
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
            <Momentum momentum={character.momentum} />
            <SubSection>
                <Status resources={character.status} />
            </SubSection>
        </Section>
        <Section title="Tracks">
            <Bonds bonds={character.bonds} />
            <Vows vows={character.vows} />
        </Section>
        <Section title="Debilities">
            <Debilities debilities={character.debilities} />
        </Section>
    </div>
}

function CharacterName({ name }: { name: string }) {
    return <span>{name}</span>
}

function Experience({ level }: { level: number }) {
    return <span className="ml-8">Experience: {level}</span>
}

function Momentum({ momentum }: { momentum: Momentum }) {
    return <div className="momentum">
        <div className="text-lg">Momentum</div>
        <MomentumMeter
            minVal={-6}
            maxVal={10}
            level={momentum.level}
            reset={momentum.reset}
            tempMax={momentum.max}
        />
    </div>
}

function Status({ resources }: { resources: Status }) {
    return <div className="flex flex-row flex-wrap justify-between">
        <StatusMeter title="health" level={resources.health} />
        <StatusMeter title="spirit" level={resources.spirit} />
        <StatusMeter title="supply" level={resources.supply} />
    </div>
}

function StatusMeter({ level, title }: { level: number, title: string }) {
    return <div className="mr-2">
        <span className="text-lg">{title}</span>
        <span>
            <ResourceMeter level={level} minVal={0} maxVal={5} />
        </span>
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

function Debilities({ debilities }: { debilities: Debilities }) {
    return <div className="flex flex-row">
        <SubSection title="Conditions" className="w-32 mr-24">
            <Conditions conditions={debilities.conditions} />
        </SubSection>
        <SubSection title="Banes" className="w-32 mr-24">
            <Banes banes={debilities.banes} />
        </SubSection>
        <SubSection title="Burdens" className="w-32 mr-24">
            <Burdens burdens={debilities.burdens} />
        </SubSection>
    </div>
}

function Conditions({ conditions }: { conditions: Conditions }) {
    return <>
        <CheckBox checked={conditions.wounded} title="wounded" />
        <CheckBox checked={conditions.shaken} title="shaken" />
        <CheckBox checked={conditions.unprepared} title="unprepared" />
        <CheckBox checked={conditions.encumbered} title="encumbered" />
    </>
}

function Banes({ banes }: { banes: Banes }) {
    return <>
        <CheckBox checked={banes.maimed} title="maimed" />
        <CheckBox checked={banes.corrupted} title="corrupted" />
    </>
}


function Burdens({ burdens }: { burdens: Burdens }) {
    return <>
        <CheckBox checked={burdens.cursed} title="cursed" />
        <CheckBox checked={burdens.tormented} title="tormented" />
    </>
}