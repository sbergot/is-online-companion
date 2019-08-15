import * as React from 'react';

import { KeyEntry, LensProps, Lens } from '../framework/contracts';
import { Link } from 'react-router-dom';
import { ChildrenProp, ClassProp } from '../contracts/component';
import { TrackProgress } from '../contracts/challenge';
import { SmallDangerButton, SmallPrimaryButton } from './buttons';
import { range } from '../services/barHelpers';

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
        <div className="flex mt-2 py-2 px-4 justify-between rounded-sm border bg-gray-200 hover:shadow">
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
    const classes = ['link', className || ''].join(' ');
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
    const classes = [to === current ? 'link-active' : '', className || ''].join(' ');
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
    shadow border rounded-sm
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

interface TextAreaProps {
    value: string;
    onChange(s: string): void;
    onKeyDown?(e: React.KeyboardEvent): void;
    rows: number;
    cols: number;
}

export function TextArea({ value, onChange, rows, cols, onKeyDown }: TextAreaProps) {
    return <div>
        <textarea
            className="resize-none border"
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={rows}
            cols={cols}
            onKeyPress={onKeyDown ? onKeyDown : undefined}
        />
    </div>
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
                    v == value ? 'btn-primary' : 'btn-secondary',
                    idx == 0 ? 'rounded-l-sm' : '',
                    idx == options.length - 1 ? 'rounded-r-sm' : '',
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

function Ticks({ t }: { t: number }) {
    const boxClasses = `
        w-8 h-8 mr-1 p-1
        flex flex-row flex-wrap items-center justify-between content-between
        border border-gray-400 rounded
    `;
    const capped = Math.min(t, 4);
    return (
        <div className={boxClasses}>
            {range(1, capped).map(i => (
                <div key={i} className="w-1/3 h-2 mx-px bg-gray-600 rounded-sm" />
            ))}
        </div>
    );
}

interface TrackMeterProps {
    lens: Lens<TrackProgress>;
    progressStep: number;
    finished: boolean;
}

export function TrackMeter({ progressStep, finished, lens }: TrackMeterProps) {
    const { state: progress, setState } = lens;
    const capped = Math.min(progress, 40);
    const progressLevels = Math.floor(capped / 4);
    const rest = capped % 4;
    const buttonClasses = ['ml-2', finished ? 'hidden' : ''].join(' ');

    function setProgress(e: React.SyntheticEvent<unknown>, step: number) {
        e.stopPropagation();
        setState(p => p + step);
    }

    return (
        <div className="flex flex-row flex-wrap justify-between">
            <div className="flex flex-row">
                {range(1, progressLevels).map(i => (
                    <Ticks t={4} key={i} />
                ))}
                {rest > 0 && <Ticks t={rest} />}
                {range(1, 10 - progressLevels - (rest > 0 ? 1 : 0)).map(i => (
                    <Ticks t={0} key={i + progressLevels + 1} />
                ))}
            </div>
            <div className={buttonClasses}>
                <SmallDangerButton className="mr-2 text-base w-8 h-8" onClick={e => setProgress(e, -progressStep)}>
                    -
                </SmallDangerButton>
                <SmallPrimaryButton className="text-base w-8 h-8" onClick={e => setProgress(e, progressStep)}>
                    +
                </SmallPrimaryButton>
            </div>
        </div>
    );
}
