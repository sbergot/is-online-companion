import * as React from 'react';
import { ProgressChallenge, ChallengeType } from '../../contracts/challenge';
import { StreamHook } from '../../framework/contracts/hooks';
import { AnyLogBlock, ProgressRollLog } from '../../contracts/log';
import { rankStats, finishChallenge, failChallenge, deleteChallenge } from '../../services/progressChallenges';
import { progressRoll } from '../../services/rolls';
import { SmallPrimaryButton, SmallDangerButton } from '../buttons';
import { ProgressRollLogBlock } from '../log/logContent';
import { Lens } from '../../framework/contracts/functors';
import { SetState } from '@staltz/use-profunctor-state';
import { ChallengeDescription } from './challengeControls';

interface ChallengeActionsProps {
    lens: Lens<ProgressChallenge<ChallengeType>>;
    characterKey: string;
    setExp?: SetState<number>;
    logSource: StreamHook<AnyLogBlock>;
}

export function ChallengeActions({ lens: challengeLens, setExp, characterKey, logSource }: ChallengeActionsProps) {
    const { state: challenge, setState: setChallenge } = challengeLens;
    const { setState: setProgress } = challengeLens.zoom('track');
    const { state: challengeRollRef, setState: setChallengeRollRef } = challengeLens.zoom('rollReference');
    const challengeRoll = challengeRollRef ? logSource.find(challengeRollRef) : null;
    const buttonClasses = ['mt-2'].join(' ');
    const progressStep = rankStats[challenge.rank].progress;

    function onSuccessClick() {
        setChallenge(finishChallenge);
        if (setExp && challenge.type === 'vow') {
            setExp(xp => xp + rankStats[challenge.rank].experience);
        }
    }

    function rollProgress() {
        const roll = {
            type: challenge.type,
            characterKey,
            challenge: challenge,
            result: progressRoll(challenge.track),
        };
        const entry = logSource.pushNew({ key: 'ProgressRoll', value: roll });
        setChallengeRollRef(() => ({ page: entry.page, key: entry.key }));
    }

    return (
        <>
            <ChallengeDescription challenge={challenge} />
            {!challenge.finished ? (
                <div className={buttonClasses}>
                    <div className="mb-2">
                        <SmallPrimaryButton className="mr-2" onClick={() => setProgress(p => p + progressStep)}>
                            Progress
                        </SmallPrimaryButton>
                        <SmallDangerButton onClick={() => setProgress(p => p - progressStep)}>
                            Regress
                        </SmallDangerButton>
                    </div>
                    <div>
                        <SmallPrimaryButton className="mr-2" onClick={rollProgress}>
                            Roll progress
                        </SmallPrimaryButton>
                        <SmallPrimaryButton className="mr-2 mt-2" onClick={onSuccessClick}>
                            Success
                        </SmallPrimaryButton>
                        <SmallDangerButton className="mr-2" onClick={() => setChallenge(failChallenge)}>
                            Failure
                        </SmallDangerButton>
                        <SmallDangerButton className="mt-2" onClick={() => setChallenge(finishChallenge)}>
                            Abandon
                        </SmallDangerButton>
                        <SmallDangerButton className="mt-2" onClick={() => setChallenge(deleteChallenge)}>
                            Delete
                        </SmallDangerButton>
                    </div>
                </div>
            ) : null}
            {challengeRoll != null && (
                <div className="mt-4">
                    <p className="font-semibold">Progress roll result:</p>
                    <ProgressRollLogBlock block={(challengeRoll.data as ProgressRollLog).value} />
                </div>
            )}
        </>
    );
}
