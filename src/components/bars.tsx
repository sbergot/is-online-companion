import * as React from "react";
import { TrackProgress } from "../contracts/character";
import { ProfunctorState } from "@staltz/use-profunctor-state";
import { Lens } from "../services/functors";

function Ticks({t}: {t: number}) {
    return <div className="w-6 h-6 mr-1 flex flex-row flex-wrap">
        {range(1, t).map((i) => <div key={i} className="w-2 h-2 bg-gray-600 mr-1 mb-1" />)}
    </div>
}

export interface TrackMeterProps {
    lens: Lens<TrackProgress>;
    progressStep: number;
}

export function TrackMeter({ progressStep, lens: { state:progress, setState:setProgress } }: TrackMeterProps) {
    const progressLevels = Math.floor(progress/4);
    const rest = progress % 4;
    return <div className="flex flex-row flex-wrap mt-1">
        {range(1, progressLevels).map((i) => <Ticks t={4} key={i} />)}
        <Ticks t={rest} />
        {range(1, 9 - progressLevels).map((i) => <Ticks t={0} key={i + progressLevels + 1} />)}
        <div onClick={() => setProgress((p) => p - progressStep)} className="text-xl mr-2 cursor-pointer">-</div>
        <div onClick={() => setProgress((p) => p + progressStep)} className="text-xl mr-2 cursor-pointer">+</div>
    </div>
}

export interface ResourceMeterProps {
    lens: Lens<number>;
    minVal: number;
    maxVal: number;
}

export function ResourceMeter({ minVal, maxVal, lens: { state:level, setState:setLevel } }: ResourceMeterProps) {
    return <div className="flex flex-row flex-wrap">
        {range(minVal, maxVal).map(v => {
            const slotClass = [
                `w-10 h-10 mr-1 mt-1 py-1
                 border border-gray-500
                 text-center text-lg
                 cursor-pointer`,
                v === level ? "bg-gray-400" : "bg-gray-200",
            ].join(" ")
            return <div key={v} className={slotClass} onClick={() => setLevel(() => v)}>{v}</div>
        })}
    </div>
}

function range(minVal: number, maxVal: number): number[] {
    const result = [];
    for (var i = minVal; i <= maxVal; i++) {
        result.push(i);
    }
    return result;
}

export interface MomentumMeterProps extends ResourceMeterProps {
    reset: number;
    tempMax: number;
}

export function MomentumMeter({ minVal, maxVal, reset, tempMax, lens }: MomentumMeterProps) {
    return <>
        <ResourceMeter minVal={minVal} maxVal={maxVal} lens={lens} />
        <span className="mr-2">reset: {reset}</span>
        <span>max: {tempMax}</span>
    </>
}
