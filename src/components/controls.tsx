import * as React from 'react';

import { KeyEntry, LensProps } from '../framework/contracts';
import { Link } from 'react-router-dom';
import { ChildrenProp, ClassProp } from '../contracts/component';

interface CheckBoxProps extends LensProps<boolean> {
    title: string;
}

export function CheckBox({ title, lens: { state: checked, setState } }: CheckBoxProps) {
    return (
        <div className="flex flex-row justify-between items-center w-full">
            <label htmlFor={title}>{title}</label>
            <input name={title} onChange={() => setState(b => !b)} type="checkbox" checked={checked} />
        </div>
    );
}

interface EntryItemProps {
    entry: KeyEntry<{ name: string }>;
}

export function EntryItem({ entry }: EntryItemProps) {
    return (
        <div className="flex mt-2 py-2 px-4 justify-between rounded-lg border bg-gray-100 hover:shadow">
            <div className="text-xl py-2 pr-8">{entry.data.name}</div>
            <div className="text-gray-600 w-40">
                <div>created: {entry.createdAt.toLocaleDateString('en')}</div>
                <div>modified: {entry.lastModified.toLocaleDateString('en')}</div>
            </div>
        </div>
    );
}

interface InlineLinkProps extends ChildrenProp, ClassProp {
    to: string;
}

export function InlineLink({ to, children, className }: InlineLinkProps) {
    const classes = ['text-gray-600 hover:text-red-600', className || ''].join(' ');
    return (
        <Link to={to} className={classes}>
            {children}
        </Link>
    );
}

interface NavigationLinkProps extends InlineLinkProps {
    current: string;
}

export function NavigationLink({ to, children, className, current }: NavigationLinkProps) {
    const classes = [to === current ? 'text-red-600' : '', className || ''].join(' ');
    return (
        <InlineLink to={to} className={classes}>
            {children}
        </InlineLink>
    );
}

interface TextInputProps {
    value: string;
    placeHolder?: string;
    onChange(s: string): void;
}

export function TextInput({ value, onChange, placeHolder }: TextInputProps) {
    const classes = `
    shadow border rounded
    w-full py-2 px-3 my-2
    text-gray-700 leading-tight
    focus:outline-none focus:shadow-outline
    `;
    return (
        <input
            type="text"
            onChange={e => onChange(e.target.value)}
            value={value}
            placeholder={placeHolder}
            className={classes}
        />
    );
}

export function Label({ children }: ChildrenProp) {
    const classes = `
    block text-gray-700 font-bold mb-2
    `;
    return <label className={classes}>{children}</label>;
}

interface SelectProps<T> {
    options: {
        name: string;
        value: T;
    }[];
    value: T;
    onSelect: (v: T) => void;
}

export function Select<T>({ options, value, onSelect, className }: SelectProps<T> & ClassProp) {
    const classes = ['flex', className || ''].join(' ');
    return (
        <div className={classes}>
            {options.map(({ name, value: v }, idx) => {
                const classes = [
                    'py-2 px-3 mr-px text-white',
                    v == value ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-500 hover:bg-gray-700',
                    idx == 0 ? 'rounded-l' : '',
                    idx == options.length - 1 ? 'rounded-r' : '',
                ].join(' ');
                return (
                    <button key={name} onClick={() => onSelect(v)} className={classes}>
                        {name}
                    </button>
                );
            })}
        </div>
    );
}
