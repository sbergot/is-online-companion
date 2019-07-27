import * as React from "react";

import { KeyMap } from "../contracts/persistence";
import { ProgressChallenge, Rank } from "../contracts/character";
import { SubSection } from "./layout";
import { newEntry } from "../services/persistence";
import { SmallButton, Label, TextInput } from "./controls";
import { LensProps } from "../services/functors";
import { TrackMeter } from "./bars";
import { getProgressStepFromRank } from "../services/progressChallenges";

export function Vows({ lens: { state: vows, setState: setVows, zoom } }: LensProps<KeyMap<ProgressChallenge>>) {
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
            return <ProgressTrack lens={zoom(v.key).zoom("data")} />
        })}
    </SubSection>
}

function ProgressTrack({ lens: { state: challenge, zoom } }: LensProps<ProgressChallenge>) {
    return <div>
        <div>{challenge.description} / {challenge.rank}</div>
        <TrackMeter
            lens={zoom("track")}
            progressStep={getProgressStepFromRank(challenge.rank)} />
    </div>
}

function VowForm({ onSubmit }: { onSubmit: (vow: ProgressChallenge) => void }) {
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