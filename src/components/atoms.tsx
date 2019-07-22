import * as React from "react";
import { Track } from "../contracts/character";

export function CheckBox({ checked, title }: { checked: boolean, title: string }) {
    return <div className="checkbox flex-row space-between">
        <label>{title}</label>
        <input type="checkbox" checked={checked} />
    </div>
}

export function TrackMeter({ track }: { track: Track }) {
    return <span className="track">{track}</span>
}

export function Stat({ title, level }: { title: string, level: number }) {
    return <div className="stat">
        <span className="stat__title">{title}</span>
        <span className="stat__level text-l">{level}</span>
    </div>
}

export interface SectionProps {
    title?: string;
    className?: string;
    children: React.ReactNode
}

export function Section({ title, children, className }: SectionProps) {
    const classes = [
        "section",
        className ? className : ""
    ].join(" ");
    return <div className={classes}>
        {title && <h2 className="section__title">{title}</h2>}
        {children}
    </div>
}

export function SubSection({ title, children, className }: SectionProps) {
    const classes = [
        "subsection",
        className ? className : ""
    ].join(" ");
    return <div className={classes}>
        {title && <h3 className="subsection__title">{title}</h3>}
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
    return <div className="resource-meter">
        {range(minVal, maxVal).map(v => {
            const slotClass = [
                "resource-meter__slot",
                "border margin-r-min1",
                "text-m",
                v === level ? "resource-meter__slot-current" : ""
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
    return <div className="resource-meter">
        {range(minVal, maxVal).map(v => {
            const slotClass = [
                "resource-meter__slot",
                "text-m",
                v === level ? "border-bold margin-r-min2" : "border margin-r-min1",
                v === reset ? "bg-blue" : "",
                v === tempMax ? "bg-red" : "",
            ].join(" ")
            return <div key={v} className={slotClass}>{v}</div>
        })}
    </div>
}
