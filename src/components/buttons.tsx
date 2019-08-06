import * as React from "react";
import { ChildrenProp, ClassProp } from "../contracts/component";

interface ButtonProps extends ChildrenProp, ClassProp {
    onClick: (e: React.SyntheticEvent<any>) => void
}

export function SmallPrimaryButton({ onClick, children, className }: ButtonProps) {
    const classes = `
        bg-blue-500 hover:bg-blue-700
        text-white
        py-1 px-3 rounded
        focus:outline-none focus:shadow-outline
    ` + className || "";
    return <button onClick={onClick} className={classes}>
        {children}
    </button>
}

export function PrimaryButton({ onClick, children, className }: ButtonProps) {
    const classes = `
        bg-blue-500 hover:bg-blue-700
        text-white font-bold
        py-2 px-4 rounded
        focus:outline-none focus:shadow-outline
    ` + className || "";
    return <button onClick={onClick} className={classes}>
        {children}
    </button>
}

export function SmallSecondaryButton({ onClick, children, className }: ButtonProps) {
    const classes = `
        bg-gray-500 hover:bg-gray-700
        text-white
        py-1 px-3 rounded
        focus:outline-none focus:shadow-outline
    ` + className || "";
    return <button onClick={onClick} className={classes}>
        {children}
    </button>
}

export function SecondaryButton({ onClick, children, className }: ButtonProps) {
    const classes = `
        bg-gray-500 hover:bg-gray-700
        text-white font-bold
        py-2 px-4 rounded
        focus:outline-none focus:shadow-outline
    ` + className || "";
    return <button onClick={onClick} className={classes}>
        {children}
    </button>
}

export function SmallDangerButton({ onClick, children, className }: ButtonProps) {
    const classes = `
        bg-red-500 hover:bg-red-700
        text-white
        py-1 px-3 rounded
        focus:outline-none focus:shadow-outline
    ` + className || "";
    return <button onClick={onClick} className={classes}>
        {children}
    </button>
}

export function DangerButton({ onClick, children, className }: ButtonProps) {
    const classes = `
        bg-red-500 hover:bg-red-700
        text-white font-bold
        py-2 px-4 rounded
        focus:outline-none focus:shadow-outline
    ` + className || "";
    return <button onClick={onClick} className={classes}>
        {children}
    </button>
}
