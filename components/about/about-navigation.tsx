'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronUp } from 'lucide-react'

export default function AboutNavigation() {
  const [activeSection, setActiveSection] = useState('')
  const [showScrollTop, setShowScrollTop] = useState(false)

  const sections = [
    { id: 'aqi-methodology', label: 'AQI Methodology' },
    { id: 'aqi-scales', label: 'AQI Scales' },
    { id: 'pollutants', label: 'Pollutants' },
    { id: 'data-sources', label: 'Data Sources' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      // Show/hide scroll to top button
      setShowScrollTop(window.scrollY > 300)

      // Determine active section
      const currentPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const top = element.offsetTop
          const bottom = top + element.offsetHeight

          if (currentPosition >= top && currentPosition <= bottom) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth',
      })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div className="sticky top-4 z-10">
      <div className="bg-white rounded-lg shadow-md border border-sky-100 overflow-hidden">
        <div className="p-4 bg-sky-50 border-b border-sky-100">
          <h3 className="font-semibold text-sky-800">On This Page</h3>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    activeSection === section.id
                      ? 'bg-sky-100 text-sky-800 font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          size="sm"
          variant="outline"
          className="fixed bottom-4 right-4 h-10 w-10 rounded-full p-0 shadow-md border-sky-200"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
