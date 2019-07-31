import { StreamSource, StreamEntry } from "../../contracts/persistence";
import { newEntry } from "./shared";
import { reviver, replacer } from "./serialization";

interface Metadata {
    currentPage: number;
}

export class LocalStorageStreamSource<T> implements StreamSource<T> {
    constructor(private name: string, private campaignName: string, private pageSize: number) {}

    getRootKey() { return `${this.name}-${this.campaignName}`; }

    getPageKey(i: number) { return `${this.getRootKey()}-page-${i}`; }

    savePage(i: number, entries: StreamEntry<T>[]): void {
        localStorage[this.getPageKey(i)] = JSON.stringify(entries, replacer);
    }

    saveMetadata(metadata: Metadata) {
        localStorage[this.getRootKey()] = JSON.stringify(metadata);
    }

    getMetadata(): Metadata {
        const metadataRaw = localStorage[this.getRootKey()];
        if (!metadataRaw) {
            const metadata = { currentPage: 0 };
            this.saveMetadata(metadata);
            return metadata;
        }
        return JSON.parse(metadataRaw, reviver);
    }

    getPage(i: number) {
        const rawData = localStorage[this.getPageKey(i)];
        const entries = rawData ? JSON.parse(rawData, reviver) : [];
        return entries;
    }

    pushNew(value: T): StreamEntry<T> {
        const entry = newEntry(value);
        const pageIdx = this.getMetadata().currentPage;
        const currentPage = this.getPage(pageIdx);
        if (currentPage.length < this.pageSize) {
            const streamEntry = {...entry, page: pageIdx};
            const newCurrentPage = [...currentPage, streamEntry];
            this.savePage(pageIdx, newCurrentPage);
            return streamEntry;
        } else {
            const newPageIdx = pageIdx + 1
            const streamEntry = {...entry, page: newPageIdx};
            const newCurrentPage = [streamEntry];
            this.savePage(newPageIdx, newCurrentPage);
            this.saveMetadata({ currentPage: newPageIdx })
            return streamEntry;
        }
    }

    getEntries(page: number = 0): StreamEntry<T>[] {
        const realPage = this.getMetadata().currentPage - page;
        return this.getPage(realPage);
    }

    edit(entry: StreamEntry<T>): StreamEntry<T> {
        const entries = this.getEntries(entry.page);
        const idx = entries.findIndex(e => e.key === entry.key);
        if (idx < 0) {
            throw new Error(`entry not found in page ${entry.page} for key ${entry.key}`);
        }
        const newEntry = {...entry, lastModified: new Date()};
        const newEntries = [...entries];
        newEntries[idx] = newEntry;
        this.savePage(entry.page, newEntries);
        return newEntry;
    }
}