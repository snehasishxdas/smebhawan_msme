export function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/logo.jpg"
      alt="SmeBhawan Logo"
      className={className || "h-full w-full object-cover rounded-xl"}
    />
  )
}
