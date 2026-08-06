import React, { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error);
    console.error(errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center p-8">
          <div className="max-w-md text-center">
            <h1 className="mb-4 text-3xl font-bold">
              Nimadir xato ketdi
            </h1>

            <p className="mb-6 text-slate-400">
              Sahifani yangilab qayta urinib ko'ring.
            </p>

            <button
              className="rounded-lg bg-blue-600 px-5 py-3 text-white"
              onClick={() => window.location.reload()}
            >
              Sahifani yangilash
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}