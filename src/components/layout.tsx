import * as React from 'react';
import { ChildrenProp, ClassProp } from '../contracts/component';

interface SectionProps {
    title?: string;
    className?: string;
    children: React.ReactNode;
}

export function Section({ title, children, className }: SectionProps) {
    const classes = [className ? className : ''].join(' ');
    return (
        <div className={classes}>
            {title && <h1 className="title mt-2">{title}</h1>}
            {children}
        </div>
    );
}

export function SubSection({ title, children, className }: SectionProps) {
    const classes = [className ? className : ''].join(' ');
    return (
        <div className={classes}>
            {title && <h2 className="subtitle mt-2">{title}</h2>}
            {children}
        </div>
    );
}

export function MainPanel({ children }: ChildrenProp) {
    return <div className="max-w-4xl w-full max-h-screen overflow-y-auto pl-4 pb-2">{children}</div>;
}

export function ActionPanel({ children }: ChildrenProp) {
    return (
        <div className="pl-4 pt-4 w-full" style={{ maxWidth: '15rem' }}>
            {children}
        </div>
    );
}

interface SelectableProps extends ChildrenProp, ClassProp {
    selected?: boolean;
    onClick?: () => void;
}

export function Selectable({ children, selected, onClick, className }: SelectableProps) {
    const classes = [
        'border border-gray-200 rounded-sm p-2 mt-2 cursor-pointer hover:shadow',
        selected || false ? 'bg-gray-200' : '',
        className || '',
    ].join(' ');
    return (
        <div className={classes} onClick={onClick}>
            {children}
        </div>
    );
}
