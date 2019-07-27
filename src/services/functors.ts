import { Getter, Setter, ProfunctorState } from "@staltz/use-profunctor-state";

type Promap<T, S> = (get: Getter<T, S>, set: Setter<T, S>, args?: any[]) => ProfunctorState<S>;

export function drill<T, K extends keyof T>(promap: Promap<T, T[K]>, key: K) {
    return promap(
        (parent) => parent[key],
        (child, parent) => ({...parent, [key]: child}));
}