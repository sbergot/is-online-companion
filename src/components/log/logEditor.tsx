import * as React from 'react';
import { AnyLogBlock, LogType, UserInputLog, ChallengeRollLog, ChallengeRoll } from '../../contracts/log';
import { SmallPrimaryButton } from '../buttons';
import { StatKey, StatusKey, Character } from '../../contracts/character';
import { Select } from '../controls';
import { ChallengeRollType } from '../../contracts/rolls';
import { challengeRoll } from '../../services/rolls';
import { getLogTypeDescription } from '../../services/logHelpers';
import { useLens } from '../../framework/functors';
import { KeyEntry, Lens } from '../../framework/contracts';

const allEditorLogTypes: LogType[] = ['UserInput', 'ChallengeRoll'];

interface EditorProps<T extends AnyLogBlock> {
    onLog(block: T): void;
}

function getUserInputLens(characterKey: string, text: string): Lens<UserInputLog> {
    return useLens<UserInputLog>({ key: 'UserInput', value: { characterKey, text } });
}

interface ChallengeRollParams {
    type: ChallengeRollType;
    bonus: number;
    stat: number;
}

function getChallengeRollLens(characterKey: string, params: ChallengeRollParams): Lens<ChallengeRollLog> {
    const { type, bonus, stat } = params;
    return useLens<ChallengeRollLog>({
        key: 'ChallengeRoll',
        value: {
            characterKey,
            type,
            result: {
                actionDie: 0,
                bonus,
                challengeDice: [0, 0],
                stat,
            },
        },
    });
}

interface LogBlockEditorProps extends EditorProps<AnyLogBlock> {
    logBlok: AnyLogBlock;
    character: KeyEntry<Character>;
}

export function LogBlockEditor({ onLog, logBlok, character }: LogBlockEditorProps) {
    const characterKey = character.key;
    const userInputLens = getUserInputLens(characterKey, logBlok.key == 'UserInput' ? logBlok.value.text : '');
    const challengeRollLogLens = getChallengeRollLens(
        characterKey,
        logBlok.key == 'ChallengeRoll'
            ? { type: logBlok.value.type, bonus: logBlok.value.result.bonus, stat: logBlok.value.result.stat }
            : { type: 'edge', bonus: 0, stat: 0 },
    );
    const logType = logBlok.key;

    function roll(): ChallengeRoll {
        const currentMomentum = character.data.momentum.level;
        const {
            type,
            result: { stat, bonus },
        } = challengeRollLogLens.state.value;
        return {
            characterKey,
            type,
            result: challengeRoll(stat, currentMomentum, bonus),
        };
    }

    function onSave() {
        switch (logType) {
            case 'ChallengeRoll':
                onLog({ key: 'ChallengeRoll', value: roll() });
                break;
            case 'UserInput':
                onLog(userInputLens.state);
                break;
        }
    }

    return (
        <div className="flex min-h-full">
            <div className="w-4/6">
                <AnyLogBlockEditor
                    userInputLens={userInputLens}
                    challengeRollLogLens={challengeRollLogLens}
                    logType={logType}
                    character={character}
                />
            </div>
            <div className="w-2/6">
                <SmallPrimaryButton onClick={onSave}>Save</SmallPrimaryButton>
            </div>
        </div>
    );
}

interface NewLogBlockEditorProps extends EditorProps<AnyLogBlock> {
    character: KeyEntry<Character>;
}

export function NewLogBlockEditor({ onLog, character }: NewLogBlockEditorProps) {
    const [logType, setLogType] = React.useState<LogType>('UserInput');
    const characterKey = character.key;
    const userInputLens = getUserInputLens(characterKey, '');
    const textLens = userInputLens.zoom('value').zoom('text');
    const challengeRollLogLens = getChallengeRollLens(characterKey, { type: 'edge', bonus: 0, stat: 0 });

    function roll(): ChallengeRoll {
        const currentMomentum = character.data.momentum.level;
        const {
            type,
            result: { stat, bonus },
        } = challengeRollLogLens.state.value;
        return {
            characterKey,
            type,
            result: challengeRoll(stat, currentMomentum, bonus),
        };
    }

    function onSave() {
        switch (logType) {
            case 'ChallengeRoll':
                onLog({ key: 'ChallengeRoll', value: roll() });
                break;
            case 'UserInput':
                onLog(userInputLens.state);
                textLens.setState(() => '');
                break;
        }
    }

    return (
        <div className="flex min-h-full">
            <div className="w-4/6">
                <AnyLogBlockEditor
                    userInputLens={userInputLens}
                    challengeRollLogLens={challengeRollLogLens}
                    logType={logType}
                    character={character}
                    onSubmit={onSave}
                />
            </div>
            <div className="w-2/6">
                <Select
                    options={allEditorLogTypes.map(lt => ({ name: getLogTypeDescription(lt), value: lt }))}
                    value={logType}
                    onSelect={setLogType}
                />
                <SubmitLog onClick={onSave} logType={logType} />
            </div>
        </div>
    );
}

interface SubmitLogProps {
    logType: LogType;
    onClick(): void;
}

function SubmitLog({ logType, onClick }: SubmitLogProps) {
    return (
        <SmallPrimaryButton className="mt-2" onClick={onClick}>
            {logType == 'UserInput' ? 'log' : 'roll'}
        </SmallPrimaryButton>
    );
}

interface AnyLogBlockEditorProps {
    logType: LogType;
    userInputLens: Lens<UserInputLog>;
    challengeRollLogLens: Lens<ChallengeRollLog>;
    character: KeyEntry<Character>;
    onSubmit?(): void;
}

export function AnyLogBlockEditor({
    userInputLens,
    challengeRollLogLens,
    logType,
    character,
    onSubmit,
}: AnyLogBlockEditorProps) {
    switch (logType) {
        case 'UserInput':
            return <UserInputEditor userInputLens={userInputLens} onSubmit={onSubmit} />;
        case 'ChallengeRoll':
            return <ChallengeRollEditor challengeRollLogLens={challengeRollLogLens} character={character} />;
        default:
            return null;
    }
}

interface UserInputEditorProps {
    userInputLens: Lens<UserInputLog>;
    onSubmit?(): void;
}

function UserInputEditor({ userInputLens, onSubmit }: UserInputEditorProps) {
    const textLens = userInputLens.zoom('value').zoom('text');
    function setText(t: string) {
        textLens.setState(() => t);
    }

    function onKeyDown(e: React.KeyboardEvent) {
        if (e.key == 'Enter' && !e.shiftKey && onSubmit) {
            onSubmit();
            e.preventDefault();
        }
    }

    return (
        <textarea
            className="resize-none border"
            value={textLens.state}
            onChange={e => setText(e.target.value)}
            onKeyPress={onKeyDown}
            rows={5}
            cols={70}
        />
    );
}

interface ChallengeRollEditorProps {
    challengeRollLogLens: Lens<ChallengeRollLog>;
    character: KeyEntry<Character>;
}

const statsRollTypes: StatKey[] = ['edge', 'heart', 'iron', 'shadow', 'wits'];
const statusRollTypes: StatusKey[] = ['health', 'spirit', 'supply'];

function ChallengeRollEditor({ character, challengeRollLogLens }: ChallengeRollEditorProps) {
    const valueLens = challengeRollLogLens.zoom('value');
    const resultLens = valueLens.zoom('result');
    const rollTypeStatLens = resultLens.zoom('stat');
    const bonusLens = resultLens.zoom('bonus');
    const rollTypeLens = valueLens.zoom('type');
    function getStat(statKey: StatKey) {
        return character.data.stats[statKey];
    }
    function getStatus(statusKey: StatusKey) {
        return character.data.status[statusKey];
    }

    function onStatSelect(statKey: StatKey) {
        rollTypeStatLens.setState(() => getStat(statKey));
        rollTypeLens.setState(() => statKey);
    }

    function onStatusSelect(statusKey: StatusKey) {
        rollTypeStatLens.setState(() => getStatus(statusKey));
        rollTypeLens.setState(() => statusKey);
    }

    return (
        <div className="flex flex-wrap flex-grow content-around mb-2">
            <Select
                className="mb-2"
                options={statsRollTypes.map(rt => ({ name: `${rt} (${getStat(rt)})`, value: rt }))}
                value={rollTypeLens.state as StatKey}
                onSelect={onStatSelect}
            />
            <Select
                className="mr-2"
                options={statusRollTypes.map(rt => ({ name: `${rt} (${getStatus(rt)})`, value: rt }))}
                value={rollTypeLens.state as StatusKey}
                onSelect={onStatusSelect}
            />
            <Select
                options={[0, 1, 2, 3, 4, 5].map(b => ({ name: b.toString(), value: b.toString() }))}
                value={bonusLens.state.toString()}
                onSelect={b => bonusLens.setState(() => parseInt(b))}
            />
        </div>
    );
}
