export default function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-mint-500 border-r-transparent ${className}`}
      role="status"
    >
      <span className="sr-only">加载中...</span>
    </div>
  );
}
