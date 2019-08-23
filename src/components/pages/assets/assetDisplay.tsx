import * as React from 'react';
import { PerkResult, Move, MoveResultTable, MoveResultType, Asset } from '../../../contracts/asset';

interface AssetDisplayProps {
    asset: Asset;
}

export function AssetDisplay({ asset }: AssetDisplayProps) {
    return <div className="border max-w-sm mb-2 mr-2">
        <div className="text-sm font-bold mb-1 color-primary p-1">
            {asset["asset-type"]}
        </div>
        <div className="p-1">
            <div className="text-sm font-bold mb-1">
                {asset.name}
            </div>
            {asset["custom-note"] ? <div>
                {asset["custom-note"].title}:
                <span className="text-gray-500 ml-1">
                    {asset["custom-note"].placeholder}
                </span>
            </div> : null}
            {asset.description ? <div>{asset.description}</div> : null}
            <ul className="mt-1">
                {asset.perks.map(p => {
                    return (<li key={p.id} className="flex">
                        <PerkActivation enabled={p.enabled} />
                        <PerkResultDisplay result={p.result} />
                    </li>)
                })}
            </ul>
        </div>
    </div>
}

interface PerkActivationProps {
    enabled: boolean;
    onClick?: () => void;
}

function PerkActivation({ onClick, enabled }: PerkActivationProps) {
    const classes = [
        "stroke-current",
        enabled ? "fill-current" : ""
    ].join(" ")
    return <svg width="15" height="15" onClick={onClick} className={classes} >
        <circle cx="8" cy="6" r="5" fill={enabled ? undefined : "transparent"} />
    </svg>
}

interface PerkResultDisplayProps {
    result: PerkResult;
}

function PerkResultDisplay({ result }: PerkResultDisplayProps) {
    return <div>
        <div className="max-w-sm w-full pl-1">
            {result.description ? <div>{result.description}</div> : null}
            {result.options ? <ul className="ml-4 list-outside list-disc">
                {result.options.map(opt => <li key={opt.name}>
                    <OptionDisplay name={opt.name} description={opt.description} />
                </li>)}
            </ul> : null}
            {result.move ? <MoveDisplay move={result.move} /> : null}
        </div>
    </div>
}

interface MoveDisplayProps {
    move: Move;
}

function MoveDisplay({ move }: MoveDisplayProps) {
    return <div>
        {move.description}
        <ol className="ml-4 list-outside list-disc">
            <li><MoveResultDisplay results={move.results} type="Strong Hit" /></li>
            <li><MoveResultDisplay results={move.results} type="Weak Hit" /></li>
            <li><MoveResultDisplay results={move.results} type="Miss" /></li>
        </ol>
    </div>
}

interface MoveResultDisplayProps {
    results: MoveResultTable;
    type: MoveResultType;
}

function MoveResultDisplay({results, type}: MoveResultDisplayProps) {
    const res = results[type];
    return <>
        <OptionDisplay name={type} description={res.description} />
        {res.options ? <ul className="ml-4 list-outside list-disc">
            {res.options.map(o => <li key={o.name}>
                <OptionDisplay name={o.name} description={o.description} />
            </li>)}
        </ul> : null}
    </>
}

interface OptionDisplayProps {
    name: string;
    description: string;
}

function OptionDisplay({name, description}: OptionDisplayProps) {
    return <><span className="font-bold">{name}</span>: {description}</>
}
