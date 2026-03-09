'use client'

import { useState } from 'react'
import { AlertCircle, Info, X } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface AlertBannerProps {
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
}

export default function AlertBanner({ message, type }: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const getAlertStyles = () => {
    switch (type) {
      case 'info':
        return 'bg-sky-50 text-sky-800 border-sky-200'
      case 'warning':
        return 'bg-amber-50 text-amber-800 border-amber-200'
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200'
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200'
      default:
        return 'bg-sky-50 text-sky-800 border-sky-200'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4" />
      case 'warning':
      case 'error':
        return <AlertCircle className="h-4 w-4" />
      case 'success':
        return <Info className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <Alert className={`mb-6 ${getAlertStyles()}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {getIcon()}
          <AlertDescription className="ml-2">{message}</AlertDescription>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close alert"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </Alert>
  )
}
