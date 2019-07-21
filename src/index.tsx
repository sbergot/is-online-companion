import * as React from "react";
import { render } from "react-dom";
import { App } from "./app";
import { Provider } from "./containers/character";

render(
    <Provider>
        <App />
    </Provider>,
    document.getElementById("root")
);