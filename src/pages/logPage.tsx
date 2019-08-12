import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { AnyLogBlock } from '../contracts/log';
import { StreamEntry } from '../framework/contracts';
import { DataServiceContainer } from '../containers/dataService';
import { CampaignKeyParam, CharacterKeyParam } from '../contracts/routes';
import { Section, MainPanel, ActionPanel } from '../components/layout';
import { LogBlock } from '../components/log/logContent';
import { NewLogBlockEditor, LogBlockEditor } from '../components/log/logEditor';
import { LogBlockActions } from '../components/log/logActions';

export function LogPage({ match }: RouteComponentProps<CampaignKeyParam & CharacterKeyParam>) {
    const dataService = DataServiceContainer.useContainer();
    const { campaignKey, characterKey } = match.params;
    const logSource = dataService.logs(campaignKey);
    const logs = logSource.values;
    const logView = React.useRef<HTMLDivElement>(null);
    const [selected, setSelected] = React.useState<StreamEntry<AnyLogBlock> | null>(null);
    const [selectedEdited, setSelectedEdited] = React.useState(false);
    const characterEntryLens = dataService.characters.getEntryLens(characterKey);
    const characterLens = characterEntryLens.zoom('data');
    const character = characterEntryLens.state;

    React.useEffect(() => {
        if (logView.current) {
            const div = logView.current;
            div.scrollTop = div.scrollHeight;
        }
    });

    function escapeSelection() {
        setSelected(null);
        setSelectedEdited(false);
    }

    function toggleSelected(entry: StreamEntry<AnyLogBlock>) {
        if (selected != null && selected.key === entry.key) {
            escapeSelection();
        } else {
            setSelectedEdited(false);
            setSelected(entry);
        }
    }

    function saveNewLog(block: AnyLogBlock) {
        const lastBlock = logSource.values[logSource.values.length - 1];
        if (block.key == 'UserInput' && lastBlock.data.key == 'UserInput') {
            const lastText = lastBlock.data.value.text;
            lastBlock.data.value.text = `${lastText}\n${block.value.text}`;
            logSource.edit(lastBlock);
        } else {
            logSource.pushNew(block);
        }
        escapeSelection();
    }

    function removeLog(entry: StreamEntry<AnyLogBlock>) {
        logSource.remove(entry);
        escapeSelection();
    }

    function editStart() {
        setSelectedEdited(true);
    }

    function editSave(oldEntry: StreamEntry<AnyLogBlock>, newBlock: AnyLogBlock) {
        const newEntry = {
            ...oldEntry,
            data: newBlock,
        };
        logSource.edit(newEntry);
        escapeSelection();
    }

    return (
        <>
            <MainPanel>
                <Section className="flex flex-col h-full" title="Log">
                    <div className="flex-grow overflow-y-auto mb-2 pr-2" ref={logView}>
                        {logs.map(l => {
                            return (
                                <LogBlock
                                    key={l.key}
                                    entry={l}
                                    onSelect={toggleSelected}
                                    selected={selected != null && l.key === selected.key}
                                />
                            );
                        })}
                    </div>
                    <div className="h-32 pt-2">
                        {selected != null && selectedEdited ? (
                            <LogBlockEditor
                                onLog={newBlock => editSave(selected, newBlock)}
                                logBlok={selected.data}
                                character={character}
                            />
                        ) : (
                            <NewLogBlockEditor onLog={saveNewLog} character={character} />
                        )}
                    </div>
                </Section>
            </MainPanel>
            <ActionPanel>
                {selected != null && (
                    <LogBlockActions
                        selected={selected}
                        onRemove={removeLog}
                        onEdit={editStart}
                        logSource={logSource}
                        characterLens={characterLens}
                    />
                )}
                {selectedEdited && <p className="font-bold mt-2">Editing an entry...</p>}
            </ActionPanel>
        </>
    );
}
