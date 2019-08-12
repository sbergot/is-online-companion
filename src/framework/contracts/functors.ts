import { SetState, Getter, Setter } from '@staltz/use-profunctor-state';

export interface Lens<T> {
    state: T;
    setState: SetState<T>;
    promap<S>(get: Getter<T, S>, set: Setter<T, S>): Lens<S>;
    zoom<K extends keyof T>(key: K): Lens<T[K]>;
}

export interface LensProps<T> {
    lens: Lens<T>;
}
