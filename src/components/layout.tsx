import * as React from "react";
import { ChildrenProp } from "../contracts/component";

export interface SectionProps {
    title?: string;
    className?: string;
    children: React.ReactNode
}

export function Section({ title, children, className }: SectionProps) {
    const classes = [
        "mt-3",
        className ? className : ""
    ].join(" ");
    return <div className={classes}>
        {title && <h2 className="text-2xl mb-1">{title}</h2>}
        {children}
    </div>
}

export function SubSection({ title, children, className }: SectionProps) {
    const classes = [
        "mt-3",
        className ? className : ""
    ].join(" ");
    return <div className={classes}>
        {title && <h3 className="text-xl mb-1">{title}</h3>}
        {children}
    </div>
}

export function MainPanel({ children }: ChildrenProp) {
    return <div className="max-w-3xl w-full pl-4 pb-4">
        {children}
    </div>
}

export function ActionPanel({ children }: ChildrenProp) {
    return <div className="p-4 w-full max-w-xs">
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
        selected || false ? "bg-gray-400" : ""
    ].join(" ");
    return <div className={classes} onClick={onClick} >
        {children}
    </div>
}