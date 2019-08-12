import * as React from 'react';

import { Stats, StatKey } from '../../../contracts/character';
import { Selectable } from '../../layout';

interface StatProps {
    title: string;
    level: number;
    onClick(): void;
    selected: boolean;
}

function Stat({ title, level, onClick, selected }: StatProps) {
    return (
        <Selectable onClick={onClick} selected={selected}>
            <div className="flex flex-col w-16">
                <span className="text-2xl text-center">{level}</span>
                <span className="text-center">{title}</span>
            </div>
        </Selectable>
    );
}

interface StatsBoxesProps {
    stats: Stats;
    selectedStat: StatKey | null;
    onSelectStat(stat: StatKey | null): void;
}

export function StatsBoxes({ stats, selectedStat, onSelectStat }: StatsBoxesProps) {
    function toggleStat(key: StatKey) {
        return () => onSelectStat(selectedStat == key ? null : key);
    }
    const statsKeys: StatKey[] = ['edge', 'heart', 'iron', 'shadow', 'wits'];
    return (
        <div className="flex flex-row">
            {statsKeys.map(k => {
                return (
                    <div key={k} className="mr-2">
                        <Stat title={k} level={stats[k]} onClick={toggleStat(k)} selected={selectedStat == k} />
                    </div>
                );
            })}
        </div>
    );
}
