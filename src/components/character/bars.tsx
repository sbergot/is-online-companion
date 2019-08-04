import * as React from "react";
import { TrackProgress } from "../../contracts/challenge";
import { Lens } from "../../services/functors";
import { SmallPrimaryButton, SmallDangerButton } from "../controls";

function Ticks({t}: {t: number}) {
    const boxClasses = `
        w-8 h-8 mr-1 p-1
        flex flex-row flex-wrap items-center justify-between content-between
        border border-gray-400 rounded
    `
    const capped = Math.min(t, 4);
    return <div className={boxClasses}>
        {range(1, capped).map((i) => <div key={i} className="w-1/3 h-2 mx-px bg-gray-600 rounded-sm" />)}
    </div>
}

export interface TrackMeterProps {
    lens: Lens<TrackProgress>;
    progressStep: number;
    finished: boolean;
}

export function TrackMeter({ progressStep, finished, lens }: TrackMeterProps) {
    const { state: progress, setState } = lens;
    const capped = Math.min(progress, 40);
    const progressLevels = Math.floor(capped / 4);
    const rest = capped % 4;
    const buttonClasses = [
        "ml-2",
        finished ? "hidden" : ""
    ].join(" ");

    function setProgress(e: React.SyntheticEvent<any>, step: number) {
        e.stopPropagation();
        setState(p => p + step);
    }

    return <div className="flex flex-row flex-wrap">
        {range(1, progressLevels).map((i) => <Ticks t={4} key={i} />)}
        {rest > 0 && <Ticks t={rest} />}
        {range(1, 10 - progressLevels - (rest > 0 ? 1 : 0)).map((i) => <Ticks t={0} key={i + progressLevels + 1} />)}
        <div className={buttonClasses}>
            <SmallDangerButton className="mr-2" onClick={(e) => setProgress(e, -progressStep)}>
                -
            </SmallDangerButton>
            <SmallPrimaryButton onClick={(e) => setProgress(e, progressStep)}>
                +
            </SmallPrimaryButton>
        </div>
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
                `w-10 h-10 mr-1 mt-1 py-1 hover:shadow
                 border border-gray-500
                 text-center text-lg
                 cursor-pointer`,
                v <= level ? "bg-gray-400" : "bg-gray-200",
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
