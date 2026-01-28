"use client";

import { useEffect } from "react";

export default function Error({
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
      <h1 className="text-white text-2xl font-[family-name:var(--font-inter)]">
        Something went wrong
      </h1>
      <button
        onClick={reset}
        className="px-4 py-2 text-sm text-black bg-white rounded-md hover:bg-white/90 transition-colors font-[family-name:var(--font-inter)]"
      >
        Try again
      </button>
    </div>
  );
}
