import * as React from "react";

export function CheckBox({ checked, title }: { checked: boolean, title: string }) {
    return <div className="flex flex-row justify-between items-center w-full">
        <label>{title}</label>
        <input type="checkbox" checked={checked} />
    </div>
}
