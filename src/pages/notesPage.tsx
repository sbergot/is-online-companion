import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { CampaignKeyParam } from '../contracts/routes';
import { DataServiceContainer } from '../containers/dataService';
import { MainPanel, ActionPanel, SubSection } from '../components/layout';
import { Note } from '../contracts/note';
import { NewNoteForm, NoteList, EditNoteForm, NoteActions } from '../components/pages/notes/notes';
import { KeyEntry } from '../framework/contracts';
import { Variant } from '../contracts/variant';

type Mode = Variant<"display", {selected: KeyEntry<Note> | null}> |
Variant<"new"> |
Variant<"edit", {entry: KeyEntry<Note>}>

const defaultMode: Mode = {key: "display", value: {selected: null}};
const newMode: Mode = { key: "new", value: null };

export function NotesPage({ }: RouteComponentProps<CampaignKeyParam>) {
    const dataService = DataServiceContainer.useContainer();
    const noteLens = dataService.notes.lens;
    const [mode, setMode] = React.useState<Mode>(defaultMode);

    function onSubmitNewNote(n: Note) {
        dataService.notes.saveNew(n);
        setMode(defaultMode);
    }

    function onDeleteNote(n: KeyEntry<Note>) {
        dataService.notes.remove(n);
        setMode(defaultMode);
    }

    function onEditNote(entry: KeyEntry<Note>) {
        setMode({ key: "edit", value: {entry} });
    }

    function onEditSaveNote(entry: KeyEntry<Note>) {
        dataService.notes.save(entry);
        setMode(defaultMode);
    }

    const selected = mode.key == "display" ? mode.value.selected : null;

    return (
        <>
            <MainPanel>
                {(() => {
                    switch (mode.key) {
                        case 'display':
                            return <NoteList
                                onNew={() => setMode(newMode)}
                                setSelected={n => setMode({ key: "display", value: {selected: n} })}
                                notes={Object.values(noteLens.state)}
                                selected={mode.value.selected} />;
                        case 'edit':
                            return <EditNoteForm
                                entry={mode.value.entry}
                                onCancel={() => setMode(defaultMode)}
                                onSave={onEditSaveNote} />;
                        case 'new':
                            return <NewNoteForm onSubmit={onSubmitNewNote} onCancel={() => setMode(defaultMode)} />
                    }})()}
            </MainPanel>
            <ActionPanel>
                {selected &&
                <NoteActions note={selected} onDelete={onDeleteNote} onEdit={onEditNote} />}
            </ActionPanel>
        </>
    );
}
