import * as React from 'react';
import { KeyEntry } from '../../../framework/contracts';
import { Character } from '../../../contracts/character';
import { DataServiceContainer } from '../../../containers/dataService';
import { useLens } from '../../../framework/functors';
import { makeDefaultCharacter } from '../../../services/characterHelpers';
import { TextInput, Select, Label, EntryItem } from '../../controls';
import { PrimaryButton } from '../../buttons';

export function CharacterForm({ onCreated }: { onCreated: (c: KeyEntry<Character>) => void }) {
    const dataService = DataServiceContainer.useContainer();
    const { state: character, zoom } = useLens(makeDefaultCharacter());
    const statOptions = [0, 1, 2, 3, 4, 5].map(i => ({ name: i.toString(), value: i }));
    const statLens = zoom('stats');
    const { state: name, setState: setName } = zoom('name');

    const campaignSource = dataService.characters;
    function onSubmit() {
        const entry = campaignSource.saveNew(character);
        onCreated(entry);
    }

    return (
        <div>
            <div className="my-2">
                <TextInput value={name} placeHolder="name" onChange={name => setName(() => name)} />
                <div className="flex flex-wrap justify-around my-2">
                    {Object.keys(character.stats).map(key => {
                        const tkey = key as keyof typeof character.stats;
                        const { state: value, setState: setValue } = statLens.zoom(tkey);
                        return (
                            <div className="mr-2 mt-3 flex flex-col items-center" key={key}>
                                <Select options={statOptions} value={value} onSelect={v => setValue(() => v)} />
                                <Label>{key}</Label>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="text-right">
                <PrimaryButton onClick={onSubmit}>Ok</PrimaryButton>
            </div>
        </div>
    );
}

interface CharacterSelectionProps {
    characters: KeyEntry<Character>[];
    onSelected: (character: KeyEntry<Character>) => void;
}

export function CharacterPicker({ characters, onSelected }: CharacterSelectionProps) {
    return characters.length ? (
        <ul>
            {characters.map(c => {
                return (
                    <div className="cursor-pointer" onClick={() => onSelected(c)} key={c.key}>
                        <EntryItem entry={c} />
                    </div>
                );
            })}
        </ul>
    ) : (
        <div className="w-full p-8 border-dashed border-2 text-center text-gray-500 border-gray-500">
            Nothing to select
        </div>
    );
}
