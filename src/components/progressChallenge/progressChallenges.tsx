import * as React from 'react';

import { KeyMap, KeyEntry, Lens } from '../../framework/contracts';
import { ProgressChallenge, ChallengeType } from '../../contracts/challenge';
import { SubSection, Selectable } from '../layout';
import { newEntry } from '../../framework/persistence/shared';
import { Zoom } from '../../framework/functors';
import { challengeResources } from '../../services/progressChallenges';
import { SmallPrimaryButton } from '../buttons';
import { ProgressTrack, ChallengeForm } from './challengeControls';

interface ChallengeProps<T extends ChallengeType> {
    type: T;
    lens: Lens<KeyMap<ProgressChallenge<T>>>;
    onSelect: (entry: KeyEntry<ProgressChallenge<T>> | null) => void;
    selectedKey?: string;
}

export function Challenge<T extends ChallengeType>({ lens, type, onSelect, selectedKey }: ChallengeProps<T>) {
    const [formVisible, setFormVisible] = React.useState(false);
    const [showFinished, setShowFinished] = React.useState(false);
    const { state: challenges } = lens;

    return (
        <SubSection className="flex flex-col max-w-xl" title={type + 's'}>
            {Object.values(challenges).map(v => {
                return (showFinished || !v.data.finished) && !v.data.deleted ? (
                    <Selectable
                        key={v.key}
                        onClick={() => (v.key == selectedKey ? onSelect(null) : onSelect(v))}
                        selected={selectedKey != null && selectedKey == v.key}
                    >
                        <Zoom parentLens={lens} zoomTo={v.key}>
                            {sublens => <ProgressTrack lens={sublens} />}
                        </Zoom>
                    </Selectable>
                ) : null;
            })}
            <div className="mt-2">
                {formVisible ? (
                    <ChallengeForm
                        onSubmit={challenge => {
                            const entry = newEntry(challenge);
                            setFormVisible(false);
                            lens.setState(challenges => ({ ...challenges, [entry.key]: entry }));
                        }}
                        onCancel={() => setFormVisible(false)}
                        type={type}
                    />
                ) : (
                    <div>
                        <SmallPrimaryButton
                            className="mr-2"
                            onClick={() => {
                                setFormVisible(true);
                                onSelect(null);
                            }}
                        >
                            {challengeResources[type].createAction}
                        </SmallPrimaryButton>
                        <SmallPrimaryButton
                            onClick={() => {
                                setShowFinished(!showFinished);
                                onSelect(null);
                            }}
                        >
                            show/hide finished tracks
                        </SmallPrimaryButton>
                    </div>
                )}
            </div>
        </SubSection>
    );
}
