import * as React from "react";
import { Character } from "../contracts/character";
import { Section } from "./layout";
import { EntryItem, Label, TextInput, Button, Select } from "./controls";
import { Entry } from "../contracts/persistence";
import { makeDefaultCharacter } from "../services/character";
import { DataServiceContainer } from "../containers/dataService";

export interface CharacterSelectionProps {
    characters: Entry<Character>[];
    onSelected: (character: Entry<Character>) => void;
}

export function CharacterSelection({ characters, onSelected }: CharacterSelectionProps) {
    return <Section title="Character selection">
        <div className="flex">
            <div className="w-1/2 p-4">
                Select a character...
            </div>
            <div className="w-1/2 p-4">
                ... or create a new one.
            </div>
        </div>
        <div className="flex">
            <div className="w-1/2 p-4">
                <CharacterPicker characters={characters} onSelected={onSelected} />
            </div>
            <div className="w-1/2 p-4">
                <CharacterForm onCreated={onSelected} />
            </div>
        </div>
    </Section>
}

function CharacterForm({ onCreated }: { onCreated: (c: Entry<Character>) => void }) {
    const dataService = DataServiceContainer.useContainer();
    const [character, setCharacter] = React.useState(makeDefaultCharacter())
    const statOptions = [0, 1, 2, 3].map(i => ({ name: i.toString(), value: i }));

    function onSubmit() {
        const entry = dataService.characters.saveNew(character);
        onCreated(entry);
    }

    return <div>
        <div className="my-2">
            <Label>Name</Label>
            <TextInput
                value={character.name}
                onChange={(name) => { setCharacter({ ...character, name }) }}
            />
            <div className="flex flex-wrap my-2">
                {Object.keys(character.stats).map((key) => {
                    const tkey = key as keyof typeof character.stats;
                    return <div className="mr-2" key={key}>
                        <Label>{key}</Label>
                        <Select
                            options={statOptions}
                            value={character.stats[tkey]}
                            onSelect={(v) => {
                                setCharacter({
                                    ...character,
                                    stats: {
                                        ...character.stats,
                                        [tkey]: v
                                    }
                                })
                            }}
                        />
                    </div>
                })}
            </div>
        </div>
        <Button onClick={onSubmit}>Ok</Button>
    </div>
}


export function CharacterPicker({ characters, onSelected }: CharacterSelectionProps) {
    return characters.length ?
        <ul>
            {characters.map((c) => {
                return <EntryItem entry={c} key={c.key}>
                    <span onClick={() => onSelected(c)}>{c.data.name}</span>
                </EntryItem>
            })}
        </ul> :
        <div className="w-full p-8 border-dashed border-2 text-center text-gray-500 border-gray-500">
            Nothing to select
        </div>
}
