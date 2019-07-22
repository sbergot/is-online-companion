import * as React from "react";
import { Character, Momentum, Status, Stats, Track, Vow, Debilities, Conditions, Banes, Burdens } from "../contracts/character";
import { CheckBox, TrackMeter, Stat, Section, ResourceMeter, SubSection, MomentumMeter } from "./atoms";

export interface CharacterProps {
    character: Character;
}

export function Character({ character }: CharacterProps) {
    return <div className="character flex-col" >
        <Section title="Character">
            <SubSection>
                <CharacterName name={character.name} />
                <Experience level={character.experience} />
            </SubSection>
            <SubSection>
                <Stats stats={character.stats} />
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
    return <span className="character-name text-m">{name}</span>
}

function Experience({ level }: { level: number }) {
    return <span className="experience text-m">Experience: {level}</span>
}

function Momentum({ momentum }: { momentum: Momentum }) {
    return <div className="momentum">
        <div>Momentum</div>
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
    return <div className="status flex-row space-between">
        <StatusMeter title="health" level={resources.health} />
        <StatusMeter title="spirit" level={resources.spirit} />
        <StatusMeter title="supply" level={resources.supply} />
    </div>
}

function StatusMeter({ level, title }: { level: number, title: string }) {
    return <div className={`resource`}>
        <span className={`resource__title`}>{title}</span>
        <span className={`resource__level`}>
            <ResourceMeter level={level} minVal={0} maxVal={5} />
        </span>
    </div>
}

function Stats({ stats }: { stats: Stats }) {
    return <div className="stats flex-row space-between">
        <Stat title="edge" level={stats.edge} />
        <Stat title="heart" level={stats.heart} />
        <Stat title="iron" level={stats.iron} />
        <Stat title="shadow" level={stats.shadow} />
        <Stat title="wits" level={stats.wits} />
    </div>
}

function Bonds({ bonds }: { bonds: Track }) {
    return <div className="bonds">
        <h2>Bonds</h2>
        <TrackMeter track={bonds} />
    </div>
}

function Vows({ vows }: { vows: Vow[] }) {
    return <div className="vows">
        <h2>Vows</h2>
        {vows.map(v => <div className="vow">
            <span className="vow__title">{v.description}</span>
            <span className="vow__rank">{v.rank}</span>
            <span className="vow__track">{v.track}</span>
        </div>)}
    </div>
}

function Debilities({ debilities }: { debilities: Debilities }) {
    return <div className="debilities flex-row space-between">
        <SubSection title="Conditions">
            <Conditions conditions={debilities.conditions} />
        </SubSection>
        <SubSection title="Banes">
            <Banes banes={debilities.banes} />
        </SubSection>
        <SubSection title="Burdens">
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