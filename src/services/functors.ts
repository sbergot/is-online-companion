import useProfunctorState, { Getter, Setter, ProfunctorState, SetState } from "@staltz/use-profunctor-state";

function zoom<T, K extends keyof T>(functor: ProfunctorState<T>, key: K) {
    return functor.promap(
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

export function wrapFunctor<T>(functor: ProfunctorState<T>): Lens<T> {
    const { state, setState, promap } = functor;
    return {
        state,
        setState,
        promap,
        zoom: (key) => {
            const subFunctor = zoom(functor, key);
            return wrapFunctor(subFunctor);
        }
    }
}

export function useLens<T>(initialState: T): Lens<T> {
    return wrapFunctor(useProfunctorState(initialState));
}