import useProfunctorState, { Getter, Setter, ProfunctorState, SetState } from "@staltz/use-profunctor-state";

type Promap<T, S> = (get: Getter<T, S>, set: Setter<T, S>, args?: any[]) => ProfunctorState<S>;

function zoom<T, K extends keyof T>(promap: Promap<T, T[K]>, key: K) {
    return promap(
        (parent) => parent[key],
        (child, parent) => ({...parent, [key]: child}));
}

export interface Lens<T> {
    state: T;
    setState: SetState<T>;
    promap<S>(get: Getter<T, S>, set: Setter<T, S>): ProfunctorState<S>;
    zoom<K extends keyof T>(key: K): Lens<T[K]>;
}

export interface LensProps<T> {
    lens: Lens<T>;
}

export function wrapFunctor<T>({ state, setState, promap }: ProfunctorState<T>): Lens<T> {
    return {
        state,
        setState,
        promap,
        zoom: (key) => {
            const subFunctor = zoom(promap, key);
            return wrapFunctor(subFunctor);
        }
    }
}

export function useLens<T>(initialState: T): Lens<T> {
    return wrapFunctor(useProfunctorState(initialState));
}