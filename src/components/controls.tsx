import * as React from "react";

import { KeyEntry } from "../contracts/persistence"
import { Link } from "react-router-dom";
import { LensProps } from "../services/functors";
import { ChildrenProp, ClassProp } from "../contracts/component";

export interface CheckBoxProps extends LensProps<boolean> {
    title: string;
}

export function CheckBox({ title, lens:{ state:checked, setState } }: CheckBoxProps) {
    return <div className="flex flex-row justify-between items-center w-full">
        <label htmlFor={title}>{title}</label>
        <input name={title} onChange={() => setState(b => !b)} type="checkbox" checked={checked} />
    </div>
}

export interface EntryItemProps {
    entry: KeyEntry<{ name: string }>;
}

export function EntryItem({ entry }: EntryItemProps) {
    return <div className="flex mt-2 py-2 px-4 justify-between rounded-lg border bg-gray-100 hover:shadow">
        <div className="text-xl py-2 pr-8">{entry.data.name}</div>
        <div className="text-sm text-gray-600 w-40">
            <div>created: {entry.createdAt.toLocaleDateString("en")}</div>
            <div>modified: {entry.lastModified.toLocaleDateString("en")}</div>
        </div>
    </div>
}

export function InlineLink({to, children, className}: { to: string } & ChildrenProp & ClassProp) {
    return <Link to={to} className={"text-gray-600 hover:text-red-600 " + className || ""}>
        {children}
    </Link>
}

export function TextInput({ value, onChange }: { value: string, onChange: (s: string) => void }) {
    const classes = `
    shadow border rounded
    w-full py-2 px-3 my-2
    text-gray-700 leading-tight
    focus:outline-none focus:shadow-outline
    `
    return <input
        type="text"
        onChange={(e) => onChange(e.target.value)}
        value={value}
        className={classes}/>
}

export function SmallButton({ onClick, children, className }: { onClick: () => void } & ChildrenProp & ClassProp) {
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

export function Button({ onClick, children, className }: { onClick: () => void } & ChildrenProp & ClassProp) {
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


export function Label({ children }: ChildrenProp) {
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

export function Select<T>({ options, value, onSelect, className }: SelectProps<T> & ClassProp) {
    const classes = ["flex", className || ""].join(" ");
    return <div className={classes}>
        {options.map(({name, value: v}, idx) => {
            const classes = [
                "py-2 px-3 mr-px",
                v == value ? "bg-blue-500 text-white" : "bg-gray-500 hover:bg-gray-400",
                idx == 0 ? "rounded-l" : "",
                idx == (options.length - 1) ? "rounded-r" : ""
            ].join(" ");
            return <button key={name} onClick={() => onSelect(v)} className={classes}>
                {name}
            </button>
        })}
    </div>
}