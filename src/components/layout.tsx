import * as React from "react";

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
