import * as React from "react";

import { Stats } from "../contracts/character";

export function Stat({ title, level }: { title: string, level: number }) {
    return <div className="flex flex-col border border-gray-500 mr-4 w-16">
        <span className="text-2xl text-center">{level}</span>
        <span className="text-center">{title}</span>
    </div>
}

export function StatsBoxes({ stats }: { stats: Stats }) {
    return <div className="flex flex-row">
        <Stat title="edge" level={stats.edge} />
        <Stat title="heart" level={stats.heart} />
        <Stat title="iron" level={stats.iron} />
        <Stat title="shadow" level={stats.shadow} />
        <Stat title="wits" level={stats.wits} />
    </div>
}