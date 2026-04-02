export default function LoadingSpinner({ size = "large" }) {
  const sizeClass = size === "small" ? "w-6 h-6" : "w-12 h-12";

  return (
    <div className="flex justify-center py-12">
      <div className={`animate-spin ${sizeClass} border-4 border-blue-600 border-t-transparent rounded-full`}></div>
    </div>
  );
}