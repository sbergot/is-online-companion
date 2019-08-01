import * as React from "react";
import { render } from "react-dom";
import { Layout } from "./layout";
import { Providers } from "./providers";

render(
    <Providers>
        <Layout />
    </Providers>,
    document.getElementById("root")
);