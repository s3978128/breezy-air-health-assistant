'use client'

import Image from 'next/image'
import { useMobile } from '@/hooks/use-mobile'
import { MessageCircle } from 'lucide-react'

export default function BreezyMascot() {
  const isMobile = useMobile()

  const handleStartConversation = () => {
    // Scroll to the chat input and focus it
    const chatInput = document.querySelector(
      'input[placeholder*="Ask me anything"]',
    ) as HTMLInputElement
    if (chatInput) {
      chatInput.scrollIntoView({ behavior: 'smooth' })
      chatInput.focus()
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="relative">
          <Image
            src="../public/breezy-avatar.png"
            alt="Breezy Mascot"
            width={isMobile ? 200 : 250}
            height={isMobile ? 200 : 250}
            className="mx-auto rounded-full shadow-lg border-4 border-sky-100"
            priority
          />
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sky-700 font-medium mb-3">Hi, I'm Breezy! Ask me about air quality.</p>
        <button
          onClick={handleStartConversation}
          className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-600 hover:to-sky-700 shadow-md transition-colors"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Start a conversation
        </button>
      </div>
    </div>
  )
}
