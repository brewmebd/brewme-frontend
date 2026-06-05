export default function Skeleton({ className, variant = "rect" }) {
  return (
    <div
      className={`animate-pulse bg-brew-text/5 border-2 border-brew-text/5 ${
        variant === "circle" ? "rounded-full" : "rounded-xl"
      } ${className}`}
    />
  );
}
