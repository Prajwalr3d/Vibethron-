"use client";

import { Component } from "react";

// Keeps a rendering bug in one section from blanking the whole page.
export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error(`${this.props.label} failed to render`, error);
  }

  componentDidUpdate(prev) {
    // A new result gets a fresh attempt.
    if (this.state.failed && prev.resetKey !== this.props.resetKey) this.setState({ failed: false });
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" className="rounded-[6px] border border-dashed border-redpen/40 px-4 py-6 text-center text-sm text-ink-soft">
        The {this.props.label.toLowerCase()} couldn&apos;t be displayed. Your draft is safe; try transforming again.
      </div>
    );
  }
}
