import * as React from "react";
import { TrackProgress } from "../contracts/character";

function Ticks({t}: {t: number}) {
    return <div className="w-6 h-6 mr-1 flex flex-row flex-wrap">
        {range(1, t).map((i) => <div key={i} className="w-2 h-2 bg-gray-600 mr-1 mb-1" />)}
    </div>
}

export interface TrackMeterProps {
    progress: TrackProgress;
    setProgress(p: TrackProgress): void;
    progressStep: number;
}

export function TrackMeter({ progress, progressStep, setProgress }: TrackMeterProps) {
    const progressLevels = Math.floor(progress/4);
    const rest = progress % 4;
    return <div className="flex flex-row flex-wrap mt-1">
        {range(1, progressLevels).map((i) => <Ticks t={4} key={i} />)}
        <Ticks t={rest} />
        {range(1, 9 - progressLevels).map((i) => <Ticks t={0} key={i + progressLevels + 1} />)}
        <div onClick={() => setProgress(progress - progressStep)} className="text-xl mr-2 cursor-pointer">-</div>
        <div onClick={() => setProgress(progress + progressStep)} className="text-xl mr-2 cursor-pointer">+</div>
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
                `w-10 h-10 mr-1 mt-1 py-1
                 border border-gray-500
                 text-center text-lg
                 cursor-pointer`,
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
