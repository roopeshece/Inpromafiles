import { getCategoryColor, getCategoryIcon } from "@/lib/categories"

export function CategoryLabel({ name }: { name: string }) {
  const Icon = getCategoryIcon(name)
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className="flex size-6 items-center justify-center rounded-md"
        style={{
          backgroundColor: `color-mix(in oklch, ${getCategoryColor(name)} 18%, transparent)`,
          color: getCategoryColor(name),
        }}
      >
        <Icon className="size-3.5" />
      </span>
      <span>{name}</span>
    </span>
  )
}
