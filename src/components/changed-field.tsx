import { ArrowRight } from "lucide-react"

export const changedField = (
  icon: React.ReactNode,
  label: string,
  oldValue: string,
  newValue: string,
  isDirty: boolean
) => {
  if (!isDirty) return null
  return (
    <div className="bg-muted p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <div className="items-center gap-4 grid grid-cols-[1fr,auto,1fr]">
        <span className="text-muted-foreground text-sm text-center">{oldValue}</span>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-primary text-sm text-center">{newValue}</span>
      </div>
    </div>
  )
}