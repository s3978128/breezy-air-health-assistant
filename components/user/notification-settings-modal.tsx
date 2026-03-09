'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import type { NotificationSettings } from '@/lib/types'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'
import { MapPin } from 'lucide-react'

export default function NotificationSettingsModal() {
  // Default notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [email, setEmail] = useState('user@example.com')
  const [location, setLocation] = useState('Ho Chi Minh City')
  const [dailyUpdates, setDailyUpdates] = useState(true)
  const [alertThreshold, setAlertThreshold] = useState(100) // AQI threshold
  const [alertFrequency, setAlertFrequency] = useState('immediate')
  const [isSaving, setIsSaving] = useState(false)
  const { open, setOpen, notifications, updateNotifications } = useAuth()
  const [suggestions, setSuggestions] = useState<string[]>([])
  const skipSuggestionFetch = useRef(false)

  const handleSave = async () => {
    if (emailNotifications) {
      if (!email || !email.trim()) {
        alert('Please enter a valid email address.')
        return
      }
      if (!location || !location.trim()) {
        alert('Please enter a valid location.')
        return
      }
    }

    setIsSaving(true)
    const updated: NotificationSettings = {
      emailNotifications,
      email,
      location,
      dailyUpdates,
      alertThreshold,
      alertFrequency: alertFrequency as 'immediate' | 'hourly' | 'daily',
    }

    const isSuccess = await updateNotifications(updated)
    if (isSuccess) {
      toast({
        title: 'Notification settings saved successfully',
        description: 'Your notification settings have been updated and saved.',
      })
      setOpen((prev) => ({ ...prev, notifications: false }))
    } else {
      toast({
        title: 'Error saving notification settings',
        description: 'We encountered an issue saving your notification settings. Please try again.',
        variant: 'destructive',
      })
    }

    setIsSaving(false)

    let message = ''

    switch (alertFrequency) {
      case 'immediate':
        break

      default:
        break
    }

    if (alertFrequency === 'immediate') {
      message = 'immediately'
    } else if (alertFrequency === 'hourly') {
      message = 'hourly'
    } else if (alertFrequency === 'daily') {
      message = 'daily'
    }

    try {
      const res = await fetch('/api/email/sendAirQuality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })

      if (!res.ok) {
        throw new Error('Failed to send email')
      }

      const statusMessages = {
        200: {
          title: 'Air Quality Sent',
          description: 'The air quality data has been successfully sent to your email.',
        },
        201: {
          title: 'Air Quality Not Sent',
          description:
            'The air quality is currently below your alert threshold, so no email was sent.',
        },
      }

      const toastContent = statusMessages[res.status as 200 | 201]
      if (toastContent) {
        setTimeout(() => {
          toast(toastContent)
        }, 1500)
      }
    } catch (error) {
      setTimeout(() => {
        toast({
          title: 'Error Sending Email',
          description:
            error.message ||
            'There was an issue sending the air quality data to your email. Please try again.',
          variant: 'destructive',
        })
      }, 1500)
    }
  }

  useEffect(() => {
    if (skipSuggestionFetch.current) {
      skipSuggestionFetch.current = false
      return
    }

    const fetchSuggestions = async () => {
      if (!location || location.trim().length < 2) {
        setSuggestions([])
        return
      }

      try {
        const res = await fetch(`/api/geocoding/search?q=${encodeURIComponent(location.trim())}`)
        const data = await res.json()
        if (data?.suggestions) {
          setSuggestions(data.suggestions)
        }
      } catch (err) {
        console.error('Failed to fetch suggestions:', err)
      }
    }

    const timeout = setTimeout(fetchSuggestions, 300)

    // ✅ Only return the cleanup function (not JSX!)
    return () => clearTimeout(timeout)
  }, [location])

  const handleSelect = (value: string) => {
    skipSuggestionFetch.current = true
    setLocation(value)
    setSuggestions([])
    setLocation(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const match = suggestions.find((s) => s.toLowerCase() === location.toLowerCase())
      if (match) {
        handleSelect(match)
      }
    }
  }

  useEffect(() => {
    if (notifications) {
      setEmailNotifications(notifications.emailNotifications)
      setEmail(notifications.email)
      setLocation(notifications.location)
      setDailyUpdates(notifications.dailyUpdates)
      setAlertThreshold(notifications.alertThreshold)
      setAlertFrequency(notifications.alertFrequency)
    }
    handleSelect(location)
  }, [notifications])

  return (
    <Dialog
      open={open.notifications}
      onOpenChange={(open) => setOpen((prev) => ({ ...prev, notifications: open }))}
    >
      <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Notification Settings</DialogTitle>
          <DialogDescription>
            Customize how and when you receive air quality alerts and updates.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications" className="font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-gray-500">Receive air quality alerts via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          {emailNotifications && (
            <div className="grid gap-2">
              <Label htmlFor="email">Notification Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          {emailNotifications && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="default-location">Notification Location</Label>
                <div className="relative flex space-x-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="default-location"
                      className={`pl-9 transition-opacity duration-300 ${
                        emailNotifications
                          ? 'opacity-100'
                          : 'opacity-0 pointer-events-none h-0 overflow-hidden'
                      }`}
                      type="text"
                      placeholder="City name"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    {emailNotifications && suggestions.length > 0 && (
                      <ul className="absolute z-10 w-full bg-white border border-sky-200 mt-1 rounded-md shadow-md max-h-56 overflow-y-auto text-sm">
                        {suggestions.map((s, i) => (
                          <li
                            key={i}
                            onClick={() => handleSelect(s)}
                            className="px-3 py-2 cursor-pointer hover:bg-sky-100"
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Enter the city name for which you want to receive air quality updates
                </p>
              </div>
            </>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="daily-updates" className="font-medium">
                Daily Air Quality Updates
              </Label>
              <p className="text-sm text-gray-500">
                Receive a daily summary of air quality in your area
              </p>
            </div>
            <Switch id="daily-updates" checked={dailyUpdates} onCheckedChange={setDailyUpdates} />
          </div>

          <div>
            <Label className="font-medium mb-2 block">Alert Threshold</Label>
            <p className="text-sm text-gray-500 mb-3">
              Receive alerts when AQI exceeds: {alertThreshold}
              {alertThreshold <= 50
                ? ' (Good)'
                : alertThreshold <= 100
                  ? ' (Moderate)'
                  : alertThreshold <= 150
                    ? ' (Unhealthy for Sensitive Groups)'
                    : alertThreshold <= 200
                      ? ' (Unhealthy)'
                      : alertThreshold <= 300
                        ? ' (Very Unhealthy)'
                        : ' (Hazardous)'}
            </p>
            <Slider
              value={[alertThreshold]}
              min={0}
              max={300}
              step={10}
              onValueChange={(value) => setAlertThreshold(value[0])}
              className="mb-2"
            />
            <div className="relative w-full h-4 mt-2">
              {[0, 50, 100, 150, 200, 250, 300].map((val) => (
                <span
                  key={val}
                  className="absolute text-xs text-gray-500"
                  style={{ left: `${(val / 300) * 100}%`, transform: 'translateX(-50%)' }}
                >
                  {val}
                </span>
              ))}
            </div>
          </div>

          <div>
            <Label className="font-medium mb-2 block">Alert Frequency</Label>
            <RadioGroup
              value={alertFrequency}
              onValueChange={(value) => {
                setAlertFrequency(value as 'immediate' | 'hourly' | 'daily')
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="immediate" id="immediate" />
                <Label htmlFor="immediate">Immediate (as soon as threshold is exceeded)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hourly" id="hourly" />
                <Label htmlFor="hourly">Hourly (max one alert per hour)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily">Daily (max one alert per day)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setOpen((prev) => ({ ...prev, notifications: false }))
            }}
          >
            Cancel
          </Button>

          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
