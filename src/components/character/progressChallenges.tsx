import * as React from "react";

import { KeyMap, KeyEntry } from "../../contracts/persistence";
import { ProgressChallenge, Rank, ChallengeType } from "../../contracts/challenge";
import { SubSection, Selectable } from "../layout";
import { newEntry } from "../../services/persistence/shared";
import { SmallButton, Label, TextInput, Select } from "../controls";
import { LensProps, useLens, Lens, Zoom } from "../../services/functors";
import { TrackMeter } from "./bars";
import { newChallenge, finishChallenge, failChallenge, allRanks, rankStats, challengeResources } from "../../services/progressChallenges";
import { SetState } from "@staltz/use-profunctor-state";

interface ChallengeProps<T extends ChallengeType> {
    type: T;
    lens: Lens<KeyMap<ProgressChallenge<T>>>
    setExp?: SetState<number>;
    onSelect?: (entry: KeyEntry<ProgressChallenge<T>>) => void;
    selectedKey?: string;
}

export function Challenge<T extends ChallengeType>({ lens, setExp, type, onSelect, selectedKey }:  ChallengeProps<T>) {
    const [formVisible, setFormVisible] = React.useState(false);
    const { state: challenges } = lens;

    return <SubSection title={type}>
        {Object.values(challenges).map(v => {
            function onSuccess() {
                if (setExp) {
                    setExp(xp => xp + rankStats[v.data.rank].experience);
                }
            }
            return <Selectable
                key={v.key}
                onClick={() => {onSelect ? onSelect(v) : null}}
                selected={selectedKey != null && selectedKey == v.key}>
                    <Zoom parentLens={lens} zoomTo={v.key} >
                        {sublens => <ProgressTrack
                            lens={sublens}
                            onSuccess={onSuccess} />
                        }
                    </Zoom>
            </Selectable> 
        })}
        <div className="mt-2">
            {formVisible ?
                <ChallengeForm onSubmit={(challenge) => {
                    const entry = newEntry(challenge);
                    setFormVisible(false);
                    lens.setState(challenges => ({...challenges, [entry.key]: entry}));
                }}
                type={type} /> :
                <SmallButton onClick={() => setFormVisible(true)}>
                    {challengeResources[type].createAction}
                </SmallButton>}
        </div>
    </SubSection>
}

interface ProgressTrackProps<T extends ChallengeType> {
    lens: Lens<KeyEntry<ProgressChallenge<T>>>
    onSuccess: () => void;
}

function ProgressTrack<T extends ChallengeType>({ lens, onSuccess }: ProgressTrackProps<T>) {
    const { state: challenge, setState: setChallenge, zoom: zoom } = lens.zoom("data");
    const buttonClasses = challenge.finished ? "hidden" : "";

    function onSuccessClick() {
        setChallenge(finishChallenge);
        onSuccess();
    }

    return <div>
        <ChallengeDescription challenge={challenge} />
        <div className="flex flex-wrap">
            <TrackMeter
                lens={zoom("track")}
                finished={challenge.finished}
                progressStep={rankStats[challenge.rank].progress} />
            <div className={"ml-2 " + buttonClasses}>
                <SmallButton className="mr-2" onClick={onSuccessClick}>
                    Success
                </SmallButton>
                <SmallButton className="mr-2" onClick={() => setChallenge(failChallenge)}>
                    Failure
                </SmallButton>
                <SmallButton onClick={() => setChallenge(finishChallenge)}>
                    Abandon
                </SmallButton>
            </div>
        </div>
    </div>
}

function ChallengeDescription({challenge}: {challenge: ProgressChallenge<ChallengeType>}) {
    const descrClasses = challenge.finished ? "text-gray-500 line-through" : "";
    return <div className={descrClasses}>{challenge.description} / {challenge.rank}</div>
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
                <SmallButton className="mr-2" onClick={() => setProgress((p) => p + progressStep)}>
                    Progress
                </SmallButton>
                <SmallButton onClick={() => setProgress((p) => p - progressStep)}>
                    Regress
                </SmallButton>
            </div>
            <div>
                <SmallButton className="mr-2" onClick={onSuccessClick}>
                    Success
                </SmallButton>
                <SmallButton className="mr-2" onClick={() => setChallenge(failChallenge)}>
                    Failure
                </SmallButton>
                <SmallButton onClick={() => setChallenge(finishChallenge)}>
                    Abandon
                </SmallButton>
            </div>
        </div>
    </>
}