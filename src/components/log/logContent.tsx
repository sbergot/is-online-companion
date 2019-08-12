import * as React from 'react';
import { AnyLogBlock, UserInput, ChallengeRoll, ProgressRoll } from '../../contracts/log';
import { StreamEntry } from '../../contracts/persistence';
import { DataServiceContainer } from '../../containers/dataService';
import { Character } from '../../contracts/character';
import { Selectable } from '../layout';
import { getResult, getActionScore } from '../../services/rolls';

interface LogBlockProps {
    entry: StreamEntry<AnyLogBlock>;
    onSelect(entry: StreamEntry<AnyLogBlock>): void;
    selected: boolean;
}

export function LogBlock({ entry, onSelect, selected }: LogBlockProps) {
    const dataService = DataServiceContainer.useContainer();
    const character = dataService.characters.lens.state[entry.data.value.characterKey];
    return (
        <Selectable selected={selected} onClick={() => onSelect(entry)}>
            <InnerLogBlock entry={entry} character={character.data} />
        </Selectable>
    );
}

interface InnerLogBlockProps {
    entry: StreamEntry<AnyLogBlock>;
    character: Character;
}

export function InnerLogBlock({ entry, character }: InnerLogBlockProps) {
    return (
        <>
            <div className="text-gray-600 w-full flex justify-between">
                <span className="mr-1">{character.name}</span>
                <span>{entry.createdAt.toLocaleString('en')}</span>
            </div>
            <LogBlockContent log={entry.data} />
        </>
    );
}

function LogBlockContent({ log }: { log: AnyLogBlock }) {
    switch (log.key) {
        case 'UserInput':
            return <UserInputLogBlock block={log.value} />;
        case 'ChallengeRoll':
            return <ChallengeRollLogBlock block={log.value} />;
        case 'ProgressRoll':
            return <ProgressRollLogBlock block={log.value} />;
        default:
            return null;
    }
}

function UserInputLogBlock({ block }: { block: UserInput }) {
    return <p className="whitespace-pre-wrap">{block.text}</p>;
}

function ChallengeRollLogBlock({ block }: { block: ChallengeRoll }) {
    const result = block.result;
    const challengeBonusDisplay = result.bonus ? ' + ' + result.bonus : '';
    const score = getActionScore(result);
    return (
        <>
            <p>
                roll + {block.type}
                {challengeBonusDisplay}
            </p>
            <p>
                {result.actionDie} + {result.stat}
                {challengeBonusDisplay}= {score}
                <span className="font-semibold mx-2">vs</span>
                {result.challengeDice[0]} & {result.challengeDice[1]}
            </p>
            <p className="font-semibold">{getResult(score, result.challengeDice)}</p>
        </>
    );
}

export function ProgressRollLogBlock({ block }: { block: ProgressRoll }) {
    const challenge = block.challenge;
    const result = block.result;
    return (
        <>
            <p>Progress roll for {challenge.type} challenge</p>
            <p>{challenge.description}</p>
            <p>
                {result.track}
                <span className="font-semibold mx-2">vs</span>
                {result.challengeDice[0]} & {result.challengeDice[1]}
            </p>
            <p className="font-semibold">{getResult(result.track, result.challengeDice)}</p>
        </>
    );
}
