import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <div className="flex items-center space-x-3">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            ref={ref}
            {...props}
          />
          <div
            className={cn(
              "block h-6 w-11 rounded-full transition-colors",
              props.checked
                ? "bg-blue-600"
                : "bg-gray-200"
            )}
          >
            <div
              className={cn(
                "block h-5 w-5 rounded-full bg-white shadow transform transition-transform",
                props.checked ? "translate-x-5" : "translate-x-0"
              )}
            />
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label className="text-sm font-medium text-gray-900">
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }
