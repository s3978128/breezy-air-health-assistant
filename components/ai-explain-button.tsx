'use client'

import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import { useAi } from '@/contexts/ai-context'

interface AiExplainButtonProps {
  id: string
  content: string
  variant?: 'icon' | 'text' | 'minimal'
}

export default function AiExplainButton({
  id,
  content,
  variant = 'minimal',
}: AiExplainButtonProps) {
  const { showExplanation } = useAi()

  const handleClick = () => {
    showExplanation(id, content)
  }

  if (variant === 'icon') {
    return (
      <Button
        onClick={handleClick}
        variant="outline"
        size="sm"
        className="h-8 gap-1 border-sky-200 bg-gradient-to-r from-sky-50 to-sky-100 text-sky-700 hover:from-sky-100 hover:to-sky-200 shadow-sm"
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span>Explain</span>
      </Button>
    )
  }

  if (variant === 'text') {
    return (
      <Button
        onClick={handleClick}
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-sky-600 hover:text-sky-700 hover:bg-sky-50"
      >
        <Sparkles className="h-3.5 w-3.5 mr-1" />
        <span>Explain this</span>
      </Button>
    )
  }

  // Minimal version - just the icon with a pulse animation
  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center rounded-full w-6 h-6 bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-600 hover:to-sky-700 transition-colors shadow-sm relative"
      title="Get AI explanation"
    >
      <Sparkles className="h-3.5 w-3.5" />
      <span
        className="absolute inset-0 rounded-full animate-ping bg-sky-400 opacity-75"
        style={{ animationDuration: '3s' }}
      ></span>
      <span className="sr-only">Get AI explanation</span>
    </button>
  )
}
