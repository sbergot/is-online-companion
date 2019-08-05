import * as React from "react";

import { KeyMap, KeyEntry } from "../../contracts/persistence";
import { ProgressChallenge, Rank, ChallengeType } from "../../contracts/challenge";
import { SubSection, Selectable } from "../layout";
import { newEntry } from "../../services/persistence/shared";
import { SmallPrimaryButton, Label, TextInput, SmallSecondaryButton, Select, SmallDangerButton } from "../controls";
import { LensProps, useLens, Lens, Zoom } from "../../services/functors";
import { TrackMeter } from "./bars";
import { newChallenge, finishChallenge, failChallenge, allRanks, rankStats, challengeResources } from "../../services/progressChallenges";
import { SetState } from "@staltz/use-profunctor-state";

interface ChallengeProps<T extends ChallengeType> {
    type: T;
    lens: Lens<KeyMap<ProgressChallenge<T>>>
    onSelect: (entry: KeyEntry<ProgressChallenge<T>> | null) => void;
    selectedKey?: string;
}

export function Challenge<T extends ChallengeType>({ lens, type, onSelect, selectedKey }:  ChallengeProps<T>) {
    const [formVisible, setFormVisible] = React.useState(false);
    const { state: challenges } = lens;

    return <SubSection className="flex flex-col max-w-xl" title={type}>
        {Object.values(challenges).map(v => {
            return <Selectable
                key={v.key}
                onClick={() => v.key == selectedKey ? onSelect(null) : onSelect(v)}
                selected={selectedKey != null && selectedKey == v.key}>
                    <Zoom parentLens={lens} zoomTo={v.key} >
                        {sublens => <ProgressTrack lens={sublens}/>}
                    </Zoom>
            </Selectable> 
        })}
        <div className="mt-2">
            {formVisible ?
                <ChallengeForm 
                    onSubmit={(challenge) => {
                        const entry = newEntry(challenge);
                        setFormVisible(false);
                        lens.setState(challenges => ({...challenges, [entry.key]: entry}));
                    }}
                    onCancel={() => setFormVisible(false)}
                    type={type} /> :
                <SmallPrimaryButton onClick={() => {setFormVisible(true); onSelect(null);}}>
                    {challengeResources[type].createAction}
                </SmallPrimaryButton>}
        </div>
    </SubSection>
}

interface ProgressTrackProps<T extends ChallengeType> {
    lens: Lens<KeyEntry<ProgressChallenge<T>>>
}

function ProgressTrack<T extends ChallengeType>({ lens }: ProgressTrackProps<T>) {
    const { state: challenge, zoom } = lens.zoom("data");

    return <div>
        <ChallengeDescription challenge={challenge} />
        <TrackMeter
            lens={zoom("track")}
            finished={challenge.finished}
            progressStep={rankStats[challenge.rank].progress} />
    </div>
}

function ChallengeDescription({challenge}: {challenge: ProgressChallenge<ChallengeType>}) {
    const descrClasses = challenge.finished ? "text-gray-500 line-through" : "";
    return <div className={descrClasses}>{challenge.description} / {challenge.rank}</div>
}

interface ChallengeFormProps<T extends ChallengeType> {
    type: T;
    onSubmit: (vow: ProgressChallenge<T>) => void
    onCancel: () => void;
}

function ChallengeForm<T extends ChallengeType>({ onSubmit, type, onCancel }: ChallengeFormProps<T>) {
    const [descr, setDescr] = React.useState("");
    const rankLens = useLens<Rank>("troublesome")
    return <div>
        <Label>Description</Label>
        <TextInput value={descr} onChange={setDescr} />
        <RankSelector lens={rankLens} />
        <SmallPrimaryButton
            className="mt-2 mr-2"
            onClick={() => onSubmit(newChallenge(descr, rankLens.state, type))}>
            save
        </SmallPrimaryButton>
        <SmallSecondaryButton
            className="mt-2"
            onClick={onCancel}>
            cancel
        </SmallSecondaryButton>
    </div>
}

function RankSelector({ lens: { state: value, setState: setRank } }: LensProps<Rank>) {
    return <Select
        options={allRanks.map(r => ({ name: r, value: r }))}
        value={value}
        onSelect={v => setRank(() => v)}/>
}

export interface ChallengeActionsProps {
    lens: Lens<ProgressChallenge<ChallengeType>>
    setExp?: SetState<number>;
}

export function ChallengeActions({lens, setExp}: ChallengeActionsProps) {
    const { state: challenge, setState: setChallenge } = lens;
    const { setState: setProgress } = lens.zoom("track");
    const buttonClasses = [
        "mt-2",
        challenge.finished ? "hidden" : ""
    ].join(" ");
    const progressStep = rankStats[challenge.rank].progress;

    function onSuccessClick() {
        setChallenge(finishChallenge);
        if (setExp && challenge.type === "vow") {
            setExp(xp => xp + rankStats[challenge.rank].experience);
        }
    }

    return <>
        <ChallengeDescription challenge={challenge} />
        <div className={buttonClasses}>
            <div className="mb-2">
                <SmallPrimaryButton className="mr-2" onClick={() => setProgress((p) => p + progressStep)}>
                    Progress
                </SmallPrimaryButton>
                <SmallDangerButton onClick={() => setProgress((p) => p - progressStep)}>
                    Regress
                </SmallDangerButton>
            </div>
            <div>
                <SmallPrimaryButton className="mr-2" onClick={onSuccessClick}>
                    Success
                </SmallPrimaryButton>
                <SmallDangerButton className="mr-2" onClick={() => setChallenge(failChallenge)}>
                    Failure
                </SmallDangerButton>
                <SmallDangerButton className="mt-2" onClick={() => setChallenge(finishChallenge)}>
                    Abandon
                </SmallDangerButton>
            </div>
        </div>
    </>
}