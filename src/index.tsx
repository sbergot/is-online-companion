import * as React from 'react';
import { render } from 'react-dom';
import { Layout } from './bootstrap/layout';
import { Providers } from './bootstrap/providers';
import { appStart } from './bootstrap/appStart';

appStart().then(() => {
    render(
        <Providers>
            <Layout />
        </Providers>,
        document.getElementById('root'),
    );
});
