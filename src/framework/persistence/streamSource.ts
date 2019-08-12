import { StreamSource, StreamEntry, StreamEntryRef } from '../../contracts/persistence';
import { newEntry } from './shared';
import { reviver, replacer } from './serialization';
import { KeyValueStore } from '../contracts/persistence';

interface StreamMetadata {
    currentPage: number;
}

export class StreamSourceImpl<T> implements StreamSource<T> {
    constructor(
        private storage: KeyValueStore,
        private name: string,
        private campaignName: string,
        private pageSize: number,
    ) {}

    getRootKey() {
        return `${this.name}-${this.campaignName}`;
    }

    getPageKey(i: number) {
        return `${this.getRootKey()}-page-${i}`;
    }

    savePage(i: number, entries: StreamEntry<T>[]): void {
        this.storage.set(this.getPageKey(i), JSON.stringify(entries, replacer));
    }

    saveMetadata(metadata: StreamMetadata) {
        this.storage.set(this.getRootKey(), JSON.stringify(metadata));
    }

    getMetadata(): StreamMetadata {
        const metadataRaw = this.storage.get(this.getRootKey());
        if (!metadataRaw) {
            const metadata = { currentPage: 0 };
            this.saveMetadata(metadata);
            return metadata;
        }
        return JSON.parse(metadataRaw, reviver);
    }

    getPage(i: number) {
        const rawData = this.storage.get(this.getPageKey(i));
        const entries = rawData ? JSON.parse(rawData, reviver) : [];
        return entries;
    }

    pushNew(value: T): StreamEntry<T> {
        const entry = newEntry(value);
        const pageIdx = this.getMetadata().currentPage;
        const currentPage = this.getPage(pageIdx);
        if (currentPage.length < this.pageSize) {
            const streamEntry = { ...entry, page: pageIdx };
            const newCurrentPage = [...currentPage, streamEntry];
            this.savePage(pageIdx, newCurrentPage);
            return streamEntry;
        } else {
            const newPageIdx = pageIdx + 1;
            const streamEntry = { ...entry, page: newPageIdx };
            const newCurrentPage = [streamEntry];
            this.savePage(newPageIdx, newCurrentPage);
            this.saveMetadata({ currentPage: newPageIdx });
            return streamEntry;
        }
    }

    getEntries(page: number = 0): StreamEntry<T>[] {
        const realPage = this.getMetadata().currentPage - page;
        return this.getPage(realPage);
    }

    findIdxFromEntry(entries: StreamEntry<T>[], entry: StreamEntryRef) {
        const idx = entries.findIndex(e => e.key === entry.key);
        if (idx < 0) {
            throw new Error(`entry not found in page ${entry.page} for key ${entry.key}`);
        }
        return idx;
    }

    edit(entry: StreamEntry<T>): StreamEntry<T> {
        const entries = this.getPage(entry.page);
        const idx = this.findIdxFromEntry(entries, entry);
        const newEntry = { ...entry, lastModified: new Date() };
        const newEntries = [...entries];
        newEntries[idx] = newEntry;
        this.savePage(entry.page, newEntries);
        return newEntry;
    }

    remove(entry: StreamEntry<T>): boolean {
        if (!this.canRemove(entry)) {
            return false;
        }
        const entries = this.getEntries();
        const idx = this.findIdxFromEntry(entries, entry);
        entries.splice(idx, 1);
        return true;
    }

    canRemove(entry: StreamEntry<T>): boolean {
        return this.getMetadata().currentPage === entry.page;
    }

    find(ref: StreamEntryRef): StreamEntry<unknown> {
        const entries = this.getEntries(ref.page);
        const idx = this.findIdxFromEntry(entries, ref);
        return entries[idx];
    }

    onUpdate(cb: () => void): void {
        this.storage.onUpdate(cb);
    }

    unRegister(cb: () => void): void {
        this.storage.unRegister(cb);
    }
}
