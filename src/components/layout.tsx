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