import * as React from "react";
import { ChildrenProp } from "../contracts/component";

export interface SectionProps {
    title?: string;
    className?: string;
    children: React.ReactNode
}

export function Section({ title, children, className }: SectionProps) {
    const classes = [
        className ? className : ""
    ].join(" ");
    return <div className={classes}>
        {title && <h2 className="text-2xl mb-1">{title}</h2>}
        {children}
    </div>
}

export function SubSection({ title, children, className }: SectionProps) {
    const classes = [
        className ? className : ""
    ].join(" ");
    return <div className={classes}>
        {title && <h3 className="text-xl mb-1">{title}</h3>}
        {children}
    </div>
}

export function MainPanel({ children }: ChildrenProp) {
    return <div className="max-w-4xl w-full max-h-screen overflow-y-auto pl-4 pb-2">
        {children}
    </div>
}

export function ActionPanel({ children }: ChildrenProp) {
    return <div className="pl-4 pt-4 max-w-2xl w-full"  style={{maxWidth: "15rem"}}>
        {children}
    </div>
}

export interface SelectableProps extends ChildrenProp {
    selected?: boolean
    onClick?: () => void;
}

export function Selectable({ children, selected, onClick }: SelectableProps) {
    const classes = [
        "border border-gray-200 rounded p-2 mt-2 cursor-pointer hover:shadow",
        selected || false ? "bg-gray-200" : ""
    ].join(" ");
    return <div className={classes} onClick={onClick} >
        {children}
    </div>
}
