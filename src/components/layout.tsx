import * as React from "react";

export function MainContainer({ children }: { children: React.ReactNode }) {
    return <div className="mycontainer mx-auto px-4 py-2 bg-gray-200" >
        {children}
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

export function Nav({ children }: { children: React.ReactNode }) {
    return <nav className="mycontainer mx-auto bg-gray-300 p-3">
        {children}
    </nav>
}