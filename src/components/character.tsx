import * as React from "react";

import { Character, Status, TrackProgress, Vow, Debilities, Rank } from "../contracts/character";
import { CheckBox, Label, TextInput, SmallButton } from "./controls";
import { StatsBoxes } from "./stats";
import { Section, SubSection } from "./layout";
import { MomentumMeter, ResourceMeter, TrackMeter } from "./bars";
import { KeyMap } from "../contracts/persistence";
import { newEntry } from "../services/persistence";
import { ProfunctorState } from "@staltz/use-profunctor-state";
import { drill } from "../services/functors";

export interface CharacterSheetProps {
    character: Character;
    setCharacter: (c: Character) => void;
}

export function CharacterSheet({ lens: { state: character, promap }}: {lens: ProfunctorState<Character>}) {
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
                    reset={character.momentum.reset}
                    tempMax={character.momentum.max}
                    lens={drill(drill(promap, "momentum").promap, "level")}
                />
            </SubSection>
            <SubSection title="resources">
                <Status lens={drill(promap, "status")} />
            </SubSection>
        </Section>
        <Section title="Tracks">
            <Bonds lens={drill(promap, "bonds")} />
            <Vows lens={drill(promap, "vows")} />
        </Section>
        <Section title="Debilities">
            <Debilities lens={drill(promap, "debilities")} />
        </Section>
    </div>
}

function CharacterName({ name }: { name: string }) {
    return <span>{name}</span>
}

function Experience({ level }: { level: number }) {
    return <span className="ml-8">Experience: {level}</span>
}


function Status({lens: { state:resources, promap }}: { lens: ProfunctorState<Status> }) {
    return <div className="flex flex-row flex-wrap justify-between">
        {Object.keys(resources).map((key) => {
            const tkey = key as keyof typeof resources;
            const subLens = drill(promap, tkey);
            return <div className="mr-2" key={key}>
                <span className="text-lg">{key}</span>
                <ResourceMeter minVal={0} maxVal={5} lens={subLens} />
            </div>
        })}
    </div>
}

function Bonds({lens}: {lens: ProfunctorState<TrackProgress>}) {
    return <SubSection title="Bonds">
        <TrackMeter lens={lens} progressStep={1} />
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

function Vows({ lens: { state: vows, setState: setVows, promap } }: { lens: ProfunctorState<KeyMap<Vow>> }) {
    const [vowFormVisible, setVowFormVisible] = React.useState(false);

    return <SubSection title="Vows">
        {vowFormVisible ?
            <VowForm onSubmit={(vow) => {
                const entry = newEntry(vow);
                setVows((vows) => ({ ...vows, [entry.key]: entry }));
                setVowFormVisible(false);
            }} /> :
            <SmallButton onClick={() => setVowFormVisible(true)}>new vow</SmallButton>}
        {Object.values(vows).map(v => {
            const entryLens = drill(promap, v.key);
            const vowLens = drill(entryLens.promap, "data");
            const trackLens = drill(vowLens.promap, "track");
            
            return <div className="vow" key={v.key}>
                <div>{v.data.description} / {v.data.rank}</div>
                <TrackMeter
                    lens={trackLens}
                    progressStep={getProgressStepFromRank(v.data.rank)} />
            </div>
        })}
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

function Debilities({lens: {state:debilities, promap}}: {lens: ProfunctorState<Debilities>}) {
    return <div className="flex flex-row justify-between">
        {Object.keys(debilities).map((parentKey) => {
            const tparentkey = parentKey as keyof typeof debilities;
            const subObject = debilities[tparentkey];
            const subLens = drill(promap, tparentkey);
            return <SubSection title={parentKey} className="w-32 mr-24" key={parentKey}>
                {Object.keys(subObject).map(key => {
                    const tkey = key as keyof typeof subObject;
                    const boolLens = drill(subLens.promap as any, tkey) as unknown as ProfunctorState<boolean>;
                    return <CheckBox title={key} key={key} lens={boolLens} />
                })}
            </SubSection>
        })}
    </div>
}
