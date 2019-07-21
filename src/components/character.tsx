import * as React from "react";
import { Character, Momentum, Status, Stats, Track, Vow, Debilities } from "../contracts/character";

export interface CharacterProps {
    character: Character;
}

export function Character({ character }: CharacterProps) {
    return <div className="character" >
        <div className="header">
            <div className="character-name">
                <h2>Character</h2>
                <span>{character.name}</span>
            </div>
            <Experience level={character.experience} />
        </div>
        <Momentum momentum={character.momentum} />
        <Status resources={character.status} />
        <div className="middle">
            <Stats stats={character.stats} />
            <Bonds bonds={character.bonds} />
            <Vows vows={character.vows} />
            <Debilities debilities={character.debilities} />
        </div>
    </div>
}

function Experience({ level }: { level: number }) {
    return <div className="experience">
        <h2>Experience</h2>
        <span className="experience-level">{level}</span>
    </div>
}

function Momentum({ momentum }: { momentum: Momentum }) {
    return <div className="momentum">
        <span>{momentum.level}</span>
        <span>{momentum.max}</span>
        <span>{momentum.reset}</span>
    </div>
}

function Status({ resources }: { resources: Status }) {
    return <div className="status">
        <StatusMeter title="health" level={resources.health} />
        <StatusMeter title="spirit" level={resources.spirit} />
        <StatusMeter title="supply" level={resources.supply} />
    </div>
}

function StatusMeter({ level, title }: { level: number, title: string }) {
    return <div className={`resource`}>
        <span className={`resource__title`}>{title}</span>
        <span className={`resource__level`}>{level}</span>
    </div>
}

function Stats({ stats }: { stats: Stats }) {
    return <div className="stats">
        <Stat title="edge" level={stats.edge} />
        <Stat title="heart" level={stats.heart} />
        <Stat title="iron" level={stats.iron} />
        <Stat title="shadow" level={stats.shadow} />
        <Stat title="wits" level={stats.wits} />
    </div>
}

function Stat({ title, level }: { title: string, level: number }) {
    return <div className="stat">
        <span className="stat__title">{title}</span>
        <span className="stat__level">{level}</span>
    </div>
}

function Bonds({ bonds }: { bonds: Track }) {
    return <div className="bonds">
        <h2>Bonds</h2>
        <TrackMeter track={bonds} />
    </div>
}

function TrackMeter({ track }: { track: Track }) {
    return <span className="track">{track}</span>
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
    return <div className="debilities">
        <h2>Debilities</h2>
        <div className="conditions">
            <h3>Conditions</h3>
            <CheckBox checked={debilities.conditions.wounded} title="wounded" />
            <CheckBox checked={debilities.conditions.shaken} title="shaken" />
            <CheckBox checked={debilities.conditions.unprepared} title="unprepared" />
            <CheckBox checked={debilities.conditions.encumbered} title="encumbered" />
        </div>
        <div className="banes">
            <h3>Banes</h3>
            <CheckBox checked={debilities.banes.maimed} title="maimed" />
            <CheckBox checked={debilities.banes.corrupted} title="corrupted" />
        </div>
        <div className="burdens">
            <h3>Burdens</h3>
            <CheckBox checked={debilities.burdens.cursed} title="cursed" />
            <CheckBox checked={debilities.burdens.tormented} title="tormented" />
        </div>
    </div>
}

function CheckBox({ checked, title }: { checked: boolean, title: string }) {
    return <div className="checkbox">
        <label>{title}</label>
        <input type="checkbox" checked={checked} />
    </div>
}
