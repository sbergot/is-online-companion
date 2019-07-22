import * as React from "react";
import { Track } from "../contracts/character";

export function CheckBox({ checked, title }: { checked: boolean, title: string }) {
    return <div className="flex flex-row justify-between items-center w-full">
        <label>{title}</label>
        <input type="checkbox" checked={checked} />
    </div>
}

function Ticks({t}: {t: number}) {
    return <div className="w-6 h-6 mr-1 flex flex-row flex-wrap">
        {range(1, t).map((_) => <div className="w-2 h-2 bg-gray-600 mr-1 mb-1" />)}
    </div>
}

export function TrackMeter({ track }: { track: Track }) {
    const progress = Math.floor(track/4);
    const rest = track % 4;
    return <div className="flex flex-row flex-wrap mt-1">
        {range(1, progress).map((_) => <Ticks t={4} />)}
        <Ticks t={rest} />
    </div>
}

export function Stat({ title, level }: { title: string, level: number }) {
    return <div className="flex flex-col border border-gray-500 mr-4 w-16">
        <span className="text-2xl text-center">{level}</span>
        <span className="text-center">{title}</span>
    </div>
}

export interface SectionProps {
    title?: string;
    className?: string;
    children: React.ReactNode
}

export function Section({ title, children, className }: SectionProps) {
    const classes = [
        "mt-4",
        className ? className : ""
    ].join(" ");
    return <div className={classes}>
        {title && <h2 className="text-2xl">{title}</h2>}
        {children}
    </div>
}

export function SubSection({ title, children, className }: SectionProps) {
    const classes = [
        "mt-2",
        className ? className : ""
    ].join(" ");
    return <div className={classes}>
        {title && <h3 className="text-xl">{title}</h3>}
        {children}
    </div>
}

export interface ResourceMeterProps {
    level: number;
    minVal: number;
    maxVal: number;
}

function range(minVal: number, maxVal: number): number[] {
    const result = [];
    for (var i = minVal; i <= maxVal; i++) {
        result.push(i);
    }
    return result;
}

export function ResourceMeter({ level, minVal, maxVal }: ResourceMeterProps) {
    return <div className="flex flex-row flex-wrap">
        {range(minVal, maxVal).map(v => {
            const slotClass = [
                "w-10 h-10 mr-1 py-1 border border-gray-500 text-center text-lg mt-1",
                v === level ? "bg-gray-400" : "bg-gray-200",
            ].join(" ")
            return <div key={v} className={slotClass}>{v}</div>
        })}
    </div>
}

export interface MomentumMeterProps extends ResourceMeterProps {
    reset: number;
    tempMax: number;
}

export function MomentumMeter({ level, minVal, maxVal, reset, tempMax }: MomentumMeterProps) {
    return <>
        <ResourceMeter level={level} minVal={minVal} maxVal={maxVal} />
        <span className="mr-2">reset: {reset}</span>
        <span>max: {tempMax}</span>
    </>
}
