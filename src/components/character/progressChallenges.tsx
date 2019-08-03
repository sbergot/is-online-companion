import * as React from "react";

import { KeyMap } from "../../contracts/persistence";
import { ProgressChallenge, Rank, ChallengeType } from "../../contracts/challenge";
import { SubSection } from "../layout";
import { newEntry } from "../../services/persistence/shared";
import { SmallButton, Label, TextInput, Select } from "../controls";
import { LensProps, useLens } from "../../services/functors";
import { TrackMeter } from "./bars";
import { newChallenge, finishChallenge, failChallenge, allRanks, rankStats, challengeResources } from "../../services/progressChallenges";
import { SetState } from "@staltz/use-profunctor-state";

interface ChallengeProps<T extends ChallengeType> extends LensProps<KeyMap<ProgressChallenge<T>>> {
    setExp?: SetState<number>;
    type: T;
}

export function Challenge<T extends ChallengeType>({ lens, setExp, type }:  ChallengeProps<T>) {
    const [vowFormVisible, setVowFormVisible] = React.useState(false);
    const { state: vows, setState: setVows } = lens;

    return <SubSection title={type}>
        {Object.values(vows).map(v => {
            function onSuccess() {
                if (setExp) {
                    setExp(xp => xp + rankStats[v.data.rank].experience);
                }
            }
            return <ProgressTrack key={v.key} entryKey={v.key} lens={lens} onSuccess={onSuccess} />
        })}
        <div className="mt-2">
            {vowFormVisible ?
                <ChallengeForm onSubmit={(vow) => {
                    const entry = newEntry(vow);
                    setVowFormVisible(false);
                    setVows((vows) => ({ ...vows, [entry.key]: entry }));
                }}
                type={type} /> :
                <SmallButton onClick={() => setVowFormVisible(true)}>
                    {challengeResources[type].createAction}
                </SmallButton>}
        </div>
    </SubSection>
}

interface ProgressTrackProps<T extends ChallengeType> extends LensProps<KeyMap<ProgressChallenge<T>>> {
    entryKey: string;
    onSuccess: () => void;
}

function ProgressTrack<T extends ChallengeType>({ lens, entryKey, onSuccess }: ProgressTrackProps<T>) {
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
                progressStep={rankStats[challenge.rank].progress} />
            <div className={"ml-2 " + buttonClasses}>
                <SmallButton className="mr-2" onClick={onSuccessClick}>Success</SmallButton>
                <SmallButton className="mr-2" onClick={() => setChallenge(failChallenge)}>Failure</SmallButton>
                <SmallButton onClick={() => setChallenge(finishChallenge)}>Abandon</SmallButton>
            </div>
        </div>
    </div>
}

function ChallengeForm<T extends ChallengeType>({ onSubmit, type }: { type: T; onSubmit: (vow: ProgressChallenge<T>) => void }) {
    const [descr, setDescr] = React.useState("");
    const rankLens = useLens<Rank>("troublesome")
    return <div>
        <Label>Description</Label>
        <TextInput value={descr} onChange={setDescr} />
        <RankSelector lens={rankLens} />
        <SmallButton
            className="mt-2"
            onClick={() => onSubmit(newChallenge(descr, rankLens.state, type))}>
            save
        </SmallButton>
    </div>
}

function RankSelector({ lens: { state: value, setState: setRank } }: LensProps<Rank>) {
    return <Select
        options={allRanks.map(r => ({ name: r, value: r }))}
        value={value}
        onSelect={v => setRank(() => v)}/>
}