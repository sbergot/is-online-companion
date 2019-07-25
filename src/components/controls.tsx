import * as React from "react";

import { Entry } from "../contracts/persistence"
import { Link as RLink } from "react-router-dom";
import { string } from "prop-types";

export function CheckBox({ checked, title }: { checked: boolean, title: string }) {
    return <div className="flex flex-row justify-between items-center w-full">
        <label>{title}</label>
        <input type="checkbox" checked={checked} />
    </div>
}

export interface EntryItemProps {
    entry: Entry<{ name: string }>;
    children: React.ReactNode;
}

export function EntryItem({ entry, children }: EntryItemProps) {
    return <div className="mt-2">
        <div>{children}</div>
        <div>created: {entry.createdAt.toDateString()}</div>
        <div>modified: {entry.lastModified.toDateString()}</div>
    </div>
}

export function Link({to, children}: { to: string, children: React.ReactNode }) {
    return <RLink to={to} className="text-gray-600 hover:text-red-600">
        {children}
    </RLink>
}

export function TextInput({ value, onChange }: { value: string, onChange: (s: string) => void }) {
    const classes = `
    shadow border rounded
    w-full py-2 px-3
    text-gray-700 leading-tight
    focus:outline-none focus:shadow-outline
    `
    return <input
        type="text"
        onChange={(e) => onChange(e.target.value)}
        value={value}
        className={classes}/>
}

export function Button({ onClick, children }: { onClick: () => void, children: React.ReactNode }) {
    const classes = `
        bg-blue-500 hover:bg-blue-700
        text-white font-bold
        py-2 px-4 rounded
        focus:outline-none focus:shadow-outline
    `
    return <button onClick={onClick} className={classes}>
        {children}
    </button>
}


export function Label({ children }: { children: React.ReactNode }) {
    const classes = `
    block text-gray-700 text-sm font-bold mb-2
    `
    return <label className={classes}>
        {children}
    </label>
}

export interface SelectProps<T> {
    options: {
        name: string;
        value: T;
    }[];
    value: T;
    onSelect: (v: T) => void;
}

export function Select<T>({ options, value, onSelect }: SelectProps<T>) {
    return <div className="flex">
        {options.map(({name, value: v}, idx) => {
            const classes = [
                "py-2 px-3 mr-px",
                v == value ? "bg-blue-500" : "bg-gray-500 hover:bg-gray-400",
                idx == 0 ? "rounded-l" : "",
                idx == (options.length - 1) ? "rounded-r" : ""
            ].join(" ");
            return <button key={name} onClick={() => onSelect(v)} className={classes}>
                {name}
            </button>
        })}
    </div>
}