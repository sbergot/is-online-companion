import * as React from 'react';
import { Note } from '../../../contracts/note';
import { SubSection, Selectable } from '../../layout';
import { useLens } from '../../../framework/functors';
import { TextInput, TextArea } from '../../controls';
import { PrimaryButton, SecondaryButton, DangerButton } from '../../buttons';
import { KeyEntry, Lens } from '../../../framework/contracts';

interface NoteDisplayProps {
    note: Note;
}

export function NoteDisplay({ note }: NoteDisplayProps) {
    const { title, body } = note;
    return <SubSection className="h-40 whitespace-pre-wrap overflow-hidden" title={title}>
        {body}
    </SubSection>
}

interface NewNoteFormProps {
    onSubmit(note: Note): void;
    onCancel(): void;
}

export function NewNoteForm({ onSubmit, onCancel }: NewNoteFormProps) {
    const newNoteLens = useLens<Note>({ title: '', body: '' });

    return <div className="max-w-xl">
        <NoteForm noteLens={newNoteLens} />
        <PrimaryButton onClick={() => onSubmit(newNoteLens.state)}>
            save
        </PrimaryButton>
        <SecondaryButton className="ml-2" onClick={onCancel}>
            cancel
        </SecondaryButton>
    </div>
}

interface EditNoteFormProps {
    entry: KeyEntry<Note>;
    onSave(note: KeyEntry<Note>): void;
    onCancel(): void;
}

export function EditNoteForm({ entry, onSave, onCancel }: EditNoteFormProps) {
    const editNoteLens = useLens<Note>(entry.data);
    function save() {
        onSave({...entry, data: editNoteLens.state})
    }

    return <div className="max-w-xl">
        <NoteForm noteLens={editNoteLens} />
        <PrimaryButton onClick={save}>
            save
        </PrimaryButton>
        <SecondaryButton className="ml-2" onClick={onCancel}>
            cancel
        </SecondaryButton>
    </div>
}

interface NoteFormProps {
    noteLens: Lens<Note>;
}

function NoteForm({ noteLens }: NoteFormProps) {
    const { state: title, setState: setTitle } = noteLens.zoom("title");
    const bodyLens = noteLens.zoom("body");
    function setText(t: string) {
        bodyLens.setState(() => t);
    }

    return <>
        <TextInput value={title} onChange={s => setTitle(() => s)} placeHolder="title" />
        <TextArea value={bodyLens.state} onChange={setText} rows={7} cols={80} />
    </>
}

function sortBy<T>(cb: (o: T) => string) {
    return function (a: T, b: T) {
        const aVal = cb(a);
        const bVal = cb(b);
        if (aVal < bVal) { return -1; }
        if (aVal > bVal) { return 1; }
        return 0;
    }
}

interface NoteListProps {
    notes: KeyEntry<Note>[];
    selected: KeyEntry<Note> | null;
    setSelected(note: KeyEntry<Note>): void;
    onNew(): void;
}

export function NoteList({notes, selected, setSelected, onNew}: NoteListProps) {
    const [filter, setFilter] = React.useState('');
    if (filter) {
        notes = notes.filter(n => n.data.title.includes(filter));
    }
    notes = notes.sort(sortBy(n => n.data.title));

    return <div className="mt-2 max-w-4xl">
        <div className="max-w-sm flex items-center">
            <div className="flex-grow">
                <TextInput value={filter} onChange={setFilter} placeHolder="filter" />
            </div>
            <PrimaryButton className="ml-2" onClick={onNew}>
                new note
            </PrimaryButton>
        </div>
        <div className="flex flex-wrap">
            {notes.map(n => {
                return <Selectable
                    onClick={() => setSelected(n)}
                    className="flex-grow max-w-sm w-full mr-1"
                    key={n.key}
                    selected={selected && selected.key == n.key || false}
                >
                    <NoteDisplay note={n.data} />
                </Selectable>;
            })}
        </div>
    </div>
}

interface NoteActionsProps {
    note: KeyEntry<Note>;
    onDelete(note: KeyEntry<Note>): void;
    onEdit(note: KeyEntry<Note>): void;
}

export function NoteActions({note, onDelete, onEdit}: NoteActionsProps) {
    const {title} = note.data;
    return <SubSection className="ml-2" title={title}>
        <PrimaryButton onClick={() => onEdit(note)}>edit</PrimaryButton>
        <DangerButton className="ml-1" onClick={() => onDelete(note)}>delete</DangerButton>
    </SubSection>
}
