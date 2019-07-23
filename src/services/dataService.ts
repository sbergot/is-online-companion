import { Campaign } from "../contracts/campaign";

export interface DataSet<T> {
    load(): T;
    save(data: T): void;
}

export interface DataService {
    campaigns: DataSet<Record<string, Campaign>>;
}

class LocalStorageDataSet<T> implements DataSet<T> {
    constructor(private key: string, private defaultValue: () => T) {}

    load(): T {
        const rawData = localStorage.getItem(this.key);
        return rawData ? JSON.parse(rawData) : this.defaultValue();
    }
    
    save(data: T): void {
        localStorage.setItem(this.key, JSON.stringify(data));
    }
}

export const DataService: DataService = {
    campaigns: new LocalStorageDataSet("campaigns", () => ({}))
}
