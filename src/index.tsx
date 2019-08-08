import * as React from "react";
import { render } from "react-dom";
import { Layout } from "./layout";
import { Providers } from "./providers";
import { appStart } from "./appStart";

appStart().then(() => {
    render(
        <Providers>
            <Layout />
        </Providers>,
        document.getElementById("root")
    );
})

