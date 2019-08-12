import * as React from 'react';
import { MainPanel, Section } from '../components/layout';
import { Configuration } from '../components/pages/configuration';
import { version } from '../bootstrap/version';

export function AboutPage() {
    return (
        <MainPanel>
            <Section title="About Ironsworn online companion">
                <p>Ironsworn online companion is developped by Simon Bergot</p>
                <p>Version {version}</p>
                <p className="mt-4">Source code is available under MIT license here:</p>
                <a href="https://github.com/sbergot/is-online-companion" className="text-blue-700">
                    https://github.com/sbergot/is-online-companion
                </a>
                <p className="mt-4">Do you have any feedback? Please create an issue here:</p>
                <a href="https://github.com/sbergot/is-online-companion/issues" className="text-blue-700">
                    https://github.com/sbergot/is-online-companion/issues
                </a>
                <p className="mt-4">
                    <a href="../versions" className="text-blue-700">
                        List of versions
                    </a>
                </p>
            </Section>
            <Section className="my-2" title="Backup & restore">
                <Configuration />
            </Section>
        </MainPanel>
    );
}
