import * as React from "react";

export function MainContainer({ children }: { children: React.ReactNode }) {
    return <div className="px-4 py-2 bg-gray-200 h-full" >
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
        className ? className : "mt-3"
    ].join(" ");
    return <div className={classes}>
        {title && <h2 className="text-2xl mb-1">{title}</h2>}
        {children}
    </div>
}

export function SubSection({ title, children, className }: SectionProps) {
    const classes = [
        className ? className : "mt-3"
    ].join(" ");
    return <div className={classes}>
        {title && <h3 className="text-xl mb-1">{title}</h3>}
        {children}
    </div>
}

export function Nav({ children }: { children: React.ReactNode }) {
    return <nav className="bg-gray-300 p-3">
        {children}
    </nav>
}