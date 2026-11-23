// loading.tsx = automatic <Suspense> boundary for every page in (app).
// The shell (header, bottom bar) is prerendered and shown instantly; this
// skeleton fills the content area until the page is ready, then Next
// streams in the real content.

function Block({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-surface-container ${className}`} />;
}

export default function Loading() {
  return (
    <div className="space-y-8" aria-busy="true">
      <span className="sr-only" role="status">
        Loading…
      </span>
      <div className="space-y-3">
        <Block className="h-10 w-full max-w-sm" />
        <Block className="h-5 w-full max-w-lg" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Block key={i} className="h-28" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Block key={i} className="h-52" />
        ))}
      </div>
    </div>
  );
}
