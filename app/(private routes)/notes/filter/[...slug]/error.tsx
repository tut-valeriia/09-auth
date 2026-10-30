"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div>
      <p>Something went wrong: {error.message || "Failed to load notes"}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
