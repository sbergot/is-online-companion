import * as React from "react";

import { Character, Status, TrackProgress, Vow, Debilities, Conditions, Banes, Burdens, Rank } from "../contracts/character";
import { CheckBox, Label, TextInput, Button, SmallButton } from "./controls";
import { StatsBoxes } from "./stats";
import { Section, SubSection } from "./layout";
import { MomentumMeter, ResourceMeter, TrackMeter } from "./bars";
import { KeyMap } from "../contracts/persistence";
import { newEntry } from "../services/persistence";

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
            <Bonds bonds={character.bonds} setBonds={(bonds) => setCharacter({...character, bonds})} />
            <Vows vows={character.vows} setVows={(vows) => setCharacter({...character, vows})} />
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

function Bonds({ bonds, setBonds }: { bonds: TrackProgress, setBonds: (b: TrackProgress) => void }) {
    return <SubSection title="Bonds">
        <TrackMeter progress={bonds} setProgress={setBonds} progressStep={1} />
    </SubSection>
}

function getProgressStepFromRank(rank: Rank): number {
    switch (rank) {
        case 'troublesome':
            return 12
        case 'dangerous':
            return 8
        case 'formidable':
            return 4
        case 'extreme':
            return 2
        case 'epic':
            return 1
        default:
            throw new Error("unknow rank: " + rank);
    }
}

function Vows({ vows, setVows }: { vows: KeyMap<Vow>; setVows: (v: KeyMap<Vow>) => void}) {
    const [vowFormVisible, setVowFormVisible] = React.useState(false);

    return <SubSection title="Vows">
        {vowFormVisible ?
            <VowForm onSubmit={(vow) => {
                const entry = newEntry(vow);
                setVows({...vows, [entry.key]: entry});
                setVowFormVisible(false);
            }} /> :
            <SmallButton onClick={() => setVowFormVisible(true)}>new vow</SmallButton>}
        {Object.values(vows).map(v => <div className="vow" key={v.key}>
            <div>{v.data.description} / {v.data.rank}</div>
            <TrackMeter
                progress={v.data.track}
                progressStep={getProgressStepFromRank(v.data.rank)}
                setProgress={(track) => setVows({...vows, [v.key]: {...v, data: {...v.data, track}}})} />
        </div>)}
    </SubSection>
}

function VowForm({ onSubmit }: { onSubmit: (vow: Vow) => void }) {
    const [descr, setDescr] = React.useState("");
    const [rank, setRank] = React.useState<Rank>("troublesome")
    return <div>
        <Label>Description</Label>
        <TextInput value={descr} onChange={setDescr} />
        <div className="flex items-center">
            <RankSelector value={rank} onChange={setRank} />
            <SmallButton onClick={() => onSubmit({ description: descr, rank, track: 0 })} >Ok</SmallButton>
        </div>
    </div>
}

function RankSelector({ value, onChange }: { value: Rank; onChange: (r: Rank) => void }) {
    const ranks: Rank[] = ["troublesome", "dangerous", "formidable", "extreme", "epic"];
    return <div className="flex">
        {ranks.map((r) => {
            const classes = [
                "border mr-2 w-32 text-center py-2 my-2 cursor-pointer",
                value == r ? "bg-gray-400" : "bg-gray-200"
            ].join(" ");
            return <div key={r} onClick={() => onChange(r)} className={classes}>
                {r}
            </div>
        })}
    </div>
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
