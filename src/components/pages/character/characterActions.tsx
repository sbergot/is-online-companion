import * as React from 'react';
import { Lens, StreamHook } from '../../../framework/contracts';
import { Character } from '../../../contracts/character';
import { CharacterSheetSelection } from '../../../contracts/variant';
import { AnyLogBlock } from '../../../contracts/log';
import { Zoom } from '../../../framework/functors';
import { ProgressChallenge, ChallengeType } from '../../../contracts/challenge';
import { ChallengeActions } from '../../progressChallenge/challengeActions';
import { Label, Select } from '../../controls';

interface CharacterActionsProps {
    charLens: Lens<Character>;
    selectedLens: Lens<CharacterSheetSelection>;
    logSource: StreamHook<AnyLogBlock>;
    characterKey: string;
}

export function CharacterActions({ charLens, logSource, selectedLens, characterKey }: CharacterActionsProps) {
    const statsLens = charLens.zoom('stats');
    const selectedObj = selectedLens.state;
    const selectedVow = selectedObj.key != 'vow' ? null : selectedObj.value;
    const selectedStat = selectedObj.key != 'stat' ? null : selectedObj.value;

    return (
        <>
            {selectedVow != null ? (
                <Zoom parentLens={charLens} zoomTo="vows">
                    {sublens => {
                        const selectedLens = sublens.zoom(selectedVow.key).zoom('data') as Lens<
                            ProgressChallenge<ChallengeType>
                        >;
                        return (
                            <ChallengeActions
                                key="challengeActions"
                                lens={selectedLens}
                                characterKey={characterKey}
                                logSource={logSource}
                            />
                        );
                    }}
                </Zoom>
            ) : null}
            {selectedStat != null ? (
                <Zoom parentLens={statsLens} zoomTo={selectedStat.stat}>
                    {sublens => {
                        const statOptions = [0, 1, 2, 3, 4, 5].map(i => ({ name: i.toString(), value: i }));
                        return (
                            <>
                                <Label>{selectedStat.stat}</Label>
                                <Select
                                    options={statOptions}
                                    value={sublens.state}
                                    onSelect={v => sublens.setState(() => v)}
                                />
                            </>
                        );
                    }}
                </Zoom>
            ) : null}
        </>
    );
}
