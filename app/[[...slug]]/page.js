"use client";

import dynamic from "next/dynamic";

// The INTENT / SHIFT single-page app (react-router) handles every non-API path.
// It runs client-side only: three.js, localStorage and the embedding worker need a browser.
const App = dynamic(() => import("@/spa/App"), {
  ssr: false,
  loading: () => <div style={{ minHeight: "100vh", background: "#0B0B0B" }} />,
});

export default function Page() {
  return <App />;
}
