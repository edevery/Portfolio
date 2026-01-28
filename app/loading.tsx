export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span className="w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:300ms]" />
      </div>
    </div>
  );
}
