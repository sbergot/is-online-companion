import * as React from "react";
import { useContainer } from "./containers/character";
import { Character } from "./components/character";

export function App() {
    const characCont = useContainer();
    return <Character character={characCont.character} />
}