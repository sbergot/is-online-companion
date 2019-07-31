import * as React from "react";

import { KeyMap } from "../contracts/persistence";
import { ProgressChallenge, Rank } from "../contracts/character";
import { SubSection } from "./layout";
import { newEntry } from "../services/persistence/shared";
import { SmallButton, Label, TextInput } from "./controls";
import { LensProps, useLens } from "../services/functors";
import { TrackMeter } from "./bars";
import { getProgressStepFromRank, newChallenge, finishChallenge, failChallenge, allRanks, getExperienceFromRank } from "../services/progressChallenges";
import { SetState } from "@staltz/use-profunctor-state";

export function Vows({ lens, setExp }: LensProps<KeyMap<ProgressChallenge>> & { setExp: SetState<number> }) {
    const [vowFormVisible, setVowFormVisible] = React.useState(false);
    const { state: vows, setState: setVows } = lens;

    return <SubSection title="Vows">
        {Object.values(vows).map(v => {
            function onSuccess() {
                setExp(xp => xp + getExperienceFromRank(v.data.rank));
            }
            return <ProgressTrack key={v.key} entryKey={v.key} lens={lens} onSuccess={onSuccess} />
        })}
        <div className="mt-2">
            {vowFormVisible ?
                <VowForm onSubmit={(vow) => {
                    const entry = newEntry(vow);
                    setVowFormVisible(false);
                    setVows((vows) => ({ ...vows, [entry.key]: entry }));
                }} /> :
                <SmallButton onClick={() => setVowFormVisible(true)}>swear new vow</SmallButton>}
        </div>
    </SubSection>
}

interface ProgressTrackProps extends LensProps<KeyMap<ProgressChallenge>> {
    entryKey: string;
    onSuccess: () => void;
}

function ProgressTrack({ lens, entryKey, onSuccess }: ProgressTrackProps) {
    const { state: challenge, setState: setChallenge, zoom } = lens.zoom(entryKey).zoom("data");
    const descrClasses = challenge.finished ? "text-gray-500 line-through" : "";
    const buttonClasses = challenge.finished ? "hidden" : "";

    function onSuccessClick() {
        setChallenge(finishChallenge);
        onSuccess();
    }

    return <div>
        <div className={descrClasses}>{challenge.description} / {challenge.rank}</div>
        <div className="flex flex-wrap">
            <TrackMeter
                lens={zoom("track")}
                finished={challenge.finished}
                progressStep={getProgressStepFromRank(challenge.rank)} />
            <div className={"ml-2 " + buttonClasses}>
                <SmallButton className="mr-2" onClick={onSuccessClick}>Success</SmallButton>
                <SmallButton className="mr-2" onClick={() => setChallenge(failChallenge)}>Failure</SmallButton>
                <SmallButton onClick={() => setChallenge(finishChallenge)}>Abandon</SmallButton>
            </div>
        </div>
    </div>
}

function VowForm({ onSubmit }: { onSubmit: (vow: ProgressChallenge) => void }) {
    const [descr, setDescr] = React.useState("");
    const rankLens = useLens<Rank>("troublesome")
    return <div>
        <Label>Description</Label>
        <TextInput value={descr} onChange={setDescr} />
        <div className="flex items-stretch">
            <RankSelector lens={rankLens} />
            <SmallButton onClick={() => onSubmit(newChallenge(descr, rankLens.state))}>Ok</SmallButton>
        </div>
    </div>
}

function RankSelector({ lens: { state: value, setState: setRank } }: LensProps<Rank>) {
    return <div className="flex">
        {allRanks.map((r) => {
            const classes = [
                "border mr-2 w-32 text-center py-2 cursor-pointer",
                value == r ? "bg-gray-400" : "bg-gray-200"
            ].join(" ");
            return <div key={r} onClick={() => setRank(() => r)} className={classes}>
                {r}
            </div>
        })}
    </div>
}