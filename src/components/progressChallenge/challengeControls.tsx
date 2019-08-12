import * as React from 'react';
import { ProgressChallenge, ChallengeType, Rank } from '../../contracts/challenge';
import { Lens, LensProps, KeyEntry } from '../../framework/contracts';
import { useLens } from '../../framework/functors';
import { rankStats, newChallenge, allRanks } from '../../services/progressChallenges';
import { Label, TextInput, Select, TrackMeter } from '../controls';
import { SmallPrimaryButton, SmallSecondaryButton } from '../buttons';

export function ChallengeDescription({ challenge }: { challenge: ProgressChallenge<ChallengeType> }) {
    const descrClasses = challenge.finished ? 'text-gray-500 line-through' : '';
    return (
        <div className={descrClasses}>
            {challenge.description} / {challenge.rank}
        </div>
    );
}

interface ProgressTrackProps<T extends ChallengeType> {
    lens: Lens<KeyEntry<ProgressChallenge<T>>>;
}

export function ProgressTrack<T extends ChallengeType>({ lens }: ProgressTrackProps<T>) {
    const { state: challenge, zoom } = lens.zoom('data');

    return (
        <div>
            <ChallengeDescription challenge={challenge} />
            <TrackMeter
                lens={zoom('track')}
                finished={challenge.finished}
                progressStep={rankStats[challenge.rank].progress}
            />
        </div>
    );
}

interface ChallengeFormProps<T extends ChallengeType> {
    type: T;
    onSubmit: (vow: ProgressChallenge<T>) => void;
    onCancel: () => void;
}

export function ChallengeForm<T extends ChallengeType>({ onSubmit, type, onCancel }: ChallengeFormProps<T>) {
    const [descr, setDescr] = React.useState('');
    const rankLens = useLens<Rank>('troublesome');
    return (
        <div>
            <Label>Description</Label>
            <TextInput value={descr} onChange={setDescr} />
            <RankSelector lens={rankLens} />
            <SmallPrimaryButton
                className="mt-2 mr-2"
                onClick={() => onSubmit(newChallenge(descr, rankLens.state, type))}
            >
                save
            </SmallPrimaryButton>
            <SmallSecondaryButton className="mt-2" onClick={onCancel}>
                cancel
            </SmallSecondaryButton>
        </div>
    );
}

function RankSelector({ lens: { state: value, setState: setRank } }: LensProps<Rank>) {
    return (
        <Select options={allRanks.map(r => ({ name: r, value: r }))} value={value} onSelect={v => setRank(() => v)} />
    );
}
