"use client";

export default function StaffError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <p>Something went wrong.</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
