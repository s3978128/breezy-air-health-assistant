'use client'

import type React from 'react'
import { useState } from 'react'
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
import { validatePassword, validatePasswordConfirmation } from '@/utils/input-validator'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'
import { Info } from 'lucide-react'

export default function InformationSettingsModal() {
  const { open, setOpen, userName, updateInformation } = useAuth()
  const [name, setName] = useState(userName)
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  // all, password, confirm
  const [error, setError] = useState<Record<string, { isError: boolean; message: string }>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError({})

    if (!password || !passwordConfirmation || !name) {
      setError((prev) => ({
        ...prev,
        all: { isError: true, message: 'All fields are required' },
      }))
      setIsLoading(false)
      return
    }

    let hasError = false

    // Password format check
    if (!validatePassword(password)) {
      setError((prev) => ({
        ...prev,
        password: { isError: true, message: 'Password has an invalid format.' },
      }))
      hasError = true
    }

    // Password confirmation check
    if (!validatePasswordConfirmation(password, passwordConfirmation)) {
      setError((prev) => ({
        ...prev,
        confirm: {
          isError: true,
          message: 'Password and confirmation do not match.',
        },
      }))
      hasError = true
    }

    // If any validation failed, stop here
    if (hasError) {
      setIsLoading(false)
      return
    }

    try {
      const isSuccess = await updateInformation(name, password)
      if (isSuccess) {
        toast({
          title: 'Personal Information saved successfully',
          description: 'Your information have been updated and saved.',
        })
        setOpen((prev) => ({ ...prev, notifications: false }))
      } else {
        toast({
          title: 'Error saving personal information',
          description: 'We encountered an issue saving your information. Please try again.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Change information error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearInputs = () => {
    setPassword('')
    setPasswordConfirmation('')
    setError({})
  }

  return (
    <>
      <Dialog
        open={open.information}
        onOpenChange={(open) => setOpen((prev) => ({ ...prev, information: open }))}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Log in to your Breezy account</DialogTitle>
            <DialogDescription>Enter your email and password to continue.</DialogDescription>
          </DialogHeader>

          {error['all']?.isError && <p className="text-red-600">{error['all'].message}</p>}

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-3">
              <div className="grid gap-2">
                <Label htmlFor="name">Change Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  className={`${!name && error['all']?.isError ? 'border-red-600' : ''}`}
                  value={userName as string}
                  onChange={(e) => {
                    setName(e.target.value)
                  }}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="flex gap-1">
                  New Password
                  <div className="relative inline-block">
                    <Info
                      className={`peer h-4 w-4 ${error['password']?.isError ? 'text-red-600' : ''} hover:cursor-pointer`}
                    />
                    <span className="absolute bottom-full mb-2 p-3 text-xs text-white bg-black rounded opacity-0 peer-hover:opacity-100 transition-opacity w-[250px]">
                      Password must be 8-16 characters long, include at least one uppercase letter,
                      one lowercase letter, one number, and one special character, and cannot
                      contain spaces.
                      <span className="absolute top-full left-[3px] w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-t-black border-l-transparent border-r-transparent"></span>
                    </span>
                  </div>
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  className={`${error['password']?.isError || error['all']?.isError ? 'border-red-600' : ''}`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError({})
                  }}
                />
                {error['password']?.isError && (
                  <p className="text-red-600">{error['password'].message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">New Password confirmation</Label>
                <Input
                  id="password-confirmation"
                  type="password"
                  className={`${error['confirm']?.isError || error['all']?.isError ? 'border-red-600' : ''}`}
                  value={passwordConfirmation}
                  onChange={(e) => {
                    setPasswordConfirmation(e.target.value)
                    setError({})
                  }}
                />
                {error['confirm']?.isError && (
                  <p className="text-red-600">{error['confirm'].message}</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen((prev) => ({ ...prev, information: false }))
                  clearInputs()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save change'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
