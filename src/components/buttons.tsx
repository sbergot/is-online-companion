import * as React from 'react';
import { ChildrenProp, ClassProp } from '../contracts/component';

interface ButtonProps extends ChildrenProp, ClassProp {
    onClick: (e: React.SyntheticEvent<unknown>) => void;
}

export function SmallPrimaryButton({ onClick, children, className }: ButtonProps) {
    const classes =
        `
        btn btn-small btn-primary
    ` + className || '';
    return (
        <button onClick={onClick} className={classes}>
            {children}
        </button>
    );
}

export function PrimaryButton({ onClick, children, className }: ButtonProps) {
    const classes =
        `
        btn btn-normal btn-primary
    ` + className || '';
    return (
        <button onClick={onClick} className={classes}>
            {children}
        </button>
    );
}

export function SmallSecondaryButton({ onClick, children, className }: ButtonProps) {
    const classes =
        `
        btn btn-small btn-secondary
    ` + className || '';
    return (
        <button onClick={onClick} className={classes}>
            {children}
        </button>
    );
}

export function SecondaryButton({ onClick, children, className }: ButtonProps) {
    const classes =
        `
        btn btn-normal btn-secondary
    ` + className || '';
    return (
        <button onClick={onClick} className={classes}>
            {children}
        </button>
    );
}

export function SmallDangerButton({ onClick, children, className }: ButtonProps) {
    const classes =
        `
        btn btn-small btn-danger
    ` + className || '';
    return (
        <button onClick={onClick} className={classes}>
            {children}
        </button>
    );
}

export function DangerButton({ onClick, children, className }: ButtonProps) {
    const classes =
        `
        btn btn-normal btn-danger
    ` + className || '';
    return (
        <button onClick={onClick} className={classes}>
            {children}
        </button>
    );
}
