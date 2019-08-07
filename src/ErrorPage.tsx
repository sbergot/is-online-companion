import * as React from "react";
import { Section, MainPanel } from "./components/layout";

interface ErrorBoundaryProps { children: React.ReactNode }

interface ErrorBoundaryState { hasError: boolean }

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {}

    render() {
        if (this.state.hasError) {
            // Vous pouvez afficher n'importe quelle UI de repli.
            return <MainPanel><ErrorMessage /></MainPanel>;
        }

        return this.props.children;
    }
}

function ErrorMessage() {
    return <Section title="An error has occured">
        <p className="mt-4">
            If this error persists, please create an issue here:
        </p>
        <a href="https://github.com/sbergot/is-online-companion/issues" className="text-blue-700">
            https://github.com/sbergot/is-online-companion/issues
        </a>
    </Section>
}