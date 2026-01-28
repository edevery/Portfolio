"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ backgroundColor: "black", margin: 0 }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: "1.5rem",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Something went wrong
          </h1>
          <button
            onClick={reset}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              color: "black",
              backgroundColor: "white",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
