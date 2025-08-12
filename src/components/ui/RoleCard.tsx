import React from 'react'
import { clsx } from 'clsx'

interface RoleCardProps {
  title: string
  icon: React.ReactNode
  description: string
  selected?: boolean
  onSelect: () => void
  disabled?: boolean
}

export function RoleCard({
  title,
  icon,
  description,
  selected = false,
  onSelect,
  disabled = false
}: RoleCardProps) {
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={clsx(
        'relative w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left group',
        'hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105',
        'backdrop-blur-sm',
        selected
          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl shadow-blue-500/20'
          : 'border-gray-200 bg-white/80 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-indigo-50/50 shadow-lg hover:shadow-xl'
      )}
    >
      <div className="flex flex-col items-start space-y-4">
        {/* Icon */}
        <div
          className={clsx(
            'p-4 rounded-2xl transition-all duration-300 shadow-lg',
            selected
              ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/30'
              : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-indigo-100 group-hover:text-blue-600'
          )}
        >
          {icon}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <h3
            className={clsx(
              'font-bold text-xl mb-2 transition-colors duration-200',
              selected
                ? 'text-blue-900'
                : 'text-gray-900 group-hover:text-blue-900'
            )}
          >
            {title}
          </h3>
          <p
            className={clsx(
              'text-sm leading-relaxed transition-colors duration-200',
              selected
                ? 'text-blue-700'
                : 'text-gray-600 group-hover:text-blue-700'
            )}
          >
            {description}
          </p>
        </div>
        
        {/* Selection indicator */}
        {selected && (
          <div className="absolute top-4 right-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Hover effect overlay */}
        {!selected && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-300"></div>
        )}
      </div>
    </button>
  )
} 