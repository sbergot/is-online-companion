import * as React from "react";
import { Track } from "../contracts/character";

function Ticks({t}: {t: number}) {
    return <div className="w-6 h-6 mr-1 flex flex-row flex-wrap">
        {range(1, t).map((i) => <div key={i} className="w-2 h-2 bg-gray-600 mr-1 mb-1" />)}
    </div>
}

export function TrackMeter({ track }: { track: Track }) {
    const progress = Math.floor(track/4);
    const rest = track % 4;
    return <div className="flex flex-row flex-wrap mt-1">
        {range(1, progress).map((i) => <Ticks t={4} key={i} />)}
        <Ticks t={rest} />
    </div>
}

export interface ResourceMeterProps {
    level: number;
    minVal: number;
    maxVal: number;
    onUpdate: (v: number) => void;
}

export function ResourceMeter({ level, minVal, maxVal, onUpdate }: ResourceMeterProps) {
    return <div className="flex flex-row flex-wrap">
        {range(minVal, maxVal).map(v => {
            const slotClass = [
                "w-10 h-10 mr-1 py-1 border border-gray-500 text-center text-lg mt-1 cursor-pointer",
                v === level ? "bg-gray-400" : "bg-gray-200",
            ].join(" ")
            return <div key={v} className={slotClass} onClick={() => onUpdate(v)}>{v}</div>
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

export function MomentumMeter({ level, minVal, maxVal, reset, tempMax, onUpdate }: MomentumMeterProps) {
    return <>
        <ResourceMeter level={level} minVal={minVal} maxVal={maxVal} onUpdate={onUpdate} />
        <span className="mr-2">reset: {reset}</span>
        <span>max: {tempMax}</span>
    </>
}
