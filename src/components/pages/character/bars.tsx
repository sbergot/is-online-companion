import * as React from 'react';
import { Lens } from '../../../framework/contracts';
import { ClassProp } from '../../../contracts/component';
import { range } from '../../../services/barHelpers';

interface ResourceMeterProps {
    lens: Lens<number>;
    minVal: number;
    maxVal: number;
}

export function ResourceMeter({ minVal, maxVal, lens: { state: level, setState: setLevel } }: ResourceMeterProps) {
    return (
        <div className="flex flex-row flex-wrap">
            {range(minVal, maxVal).map(v => {
                const slotClass = [v <= level ? 'btn-secondary' : ''].join(' ');
                return <Slot key={v} className={slotClass} level={v} onClick={() => setLevel(() => v)} />;
            })}
        </div>
    );
}

interface SlotProps extends ClassProp {
    level: number;
    disabled?: boolean;
    onClick(): void;
}

export function Slot({ level, onClick, className, disabled }: SlotProps) {
    const slotClass = [
        `w-8 h-8 mr-1 mt-1 py-1
         border border-gray-200 rounded-sm
         text-center text-base leading-tight
         `,
        className || '',
        disabled ? 'disabled' : 'cursor-pointer hover:shadow'
    ].join(' ');
    return (
        <div className={slotClass} onClick={onClick}>
            {level}
        </div>
    );
}

interface MomentumMeterProps extends ResourceMeterProps {
    reset: number;
    tempMax: number;
}

export function MomentumMeter({ minVal, maxVal, reset, tempMax, lens }: MomentumMeterProps) {
    const current = lens.state;
    return (
        <>
            <div className="flex flex-row flex-wrap">
                {range(minVal, -1).map(value => {
                    const slotClass = [value >= current ? 'btn-danger' : ''].join(' ');
                    return (
                        <Slot
                            key={value}
                            className={slotClass}
                            level={value}
                            onClick={() => lens.setState(() => value)}
                        />
                    );
                })}
                {range(0, tempMax).map(value => {
                    const slotClass = [value <= current ? 'btn-secondary' : ''].join(' ');
                    return (
                        <Slot
                            key={value}
                            className={slotClass}
                            level={value}
                            onClick={() => lens.setState(() => value)}
                        />
                    );
                })}
                {range(tempMax + 1, maxVal).map(v => {
                    return <Slot key={v} disabled level={v} onClick={() => {}} />;
                })}
            </div>
            <span className="mr-2">reset: {reset}</span>
            <span>max: {tempMax}</span>
        </>
    );
}
