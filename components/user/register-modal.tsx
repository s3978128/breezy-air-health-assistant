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
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import {
  validatePasswordConfirmation,
  validateEmail,
  validatePassword,
} from '@/utils/input-validator'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'
import { Info } from 'lucide-react'

export default function RegisterModal() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { open, setOpen, register, isUserExisted } = useAuth()
  // all, email, password, confirm, user, register
  const [error, setError] = useState<Record<string, { isError: boolean; message: string }>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent submit + set loading for submit btn + set error empty
    e.preventDefault()
    setIsLoading(true)
    setError({})

    let hasError = false

    // Check all fields
    if (!name || !email || !password || !passwordConfirmation) {
      setError((prev) => ({
        ...prev,
        all: { isError: true, message: 'All fields are required' },
      }))
      setIsLoading(false)
      return
    }

    // Email format check
    if (!validateEmail(email)) {
      setError((prev) => ({
        ...prev,
        email: { isError: true, message: 'Email has an invalid format.' },
      }))
      hasError = true
    }

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
      // Check existed user
      const isExisted = await isUserExisted(email, 'credentials')
      // Return error when user is existed
      if (isExisted) {
        setError((prev) => ({
          ...prev,
          user: {
            isError: true,
            message: 'Email is already existed. Please try another email.',
          },
        }))
      } else {
        // Create new user
        const isRegister = await register(name, email, password)
        if (isRegister) {
          toast({
            title: 'Register successful',
            description:
              'Your account has been created. You can now personalize your air quality alerts and preferences.',
          })

          setOpen((prev) => ({ ...prev, register: false }))
          clearInputs()
        } else {
          setError((prev) => ({
            ...prev,
            register: {
              isError: true,
              message: 'Something went wrong. Please try login again.',
            },
          }))
          return
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithGG = () => {
    // Login with Google
    signIn('google')
  }

  const handleWithGH = () => {
    // Login with Github
    signIn('github')
  }

  const clearInputs = () => {
    setName('')
    setEmail('')
    setPassword('')
    setPasswordConfirmation('')
    setError({})
  }

  return (
    <Dialog
      open={open.register}
      onOpenChange={(open) => setOpen((prev) => ({ ...prev, register: open }))}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          {/* <div className="text-center mb-2">
            <Button
              className="p-2 group bg-transparent text-black hover:bg-gray-100 hover:p-3 shadow-md rounded-full"
              onClick={handleWithGG}
            >
              <Image
                src="/google-logo.png?"
                alt="Google logo"
                width={30}
                height={30}
                priority
                className="group-hover:mr-2"
              />
              <span className="text-[0px] group-hover:text-sm">Continue with Google</span>
            </Button>
          </div> */}
          {/* <div className="text-center mb-2">
              <Button
                className="p-2 group bg-transparent text-black hover:bg-gray-100 hover:p-3 shadow-md rounded-full"
                onClick={handleWithGH}
              >
                <Image
                  src="/github-logo.png?"
                  alt="Github logo"
                  width={30}
                  height={30}
                  priority
                  className="group-hover:mr-2"
                />
                <span className="text-[0px] group-hover:text-sm">Continue with Github</span>
              </Button>
            </div> */}
          <DialogTitle>Create an account</DialogTitle>
          <DialogDescription>
            Sign up for a Breezy account to save your preferences and receive personalized air
            quality alerts.
          </DialogDescription>
        </DialogHeader>

        {['all', 'user', 'register'].map((key) =>
          error[key]?.isError ? (
            <p key={key} className="text-red-600">
              {error[key].message}
            </p>
          ) : null,
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-3">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                className={`${error['all']?.isError ? 'border-red-600' : ''}`}
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError({})
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="flex gap-1">
                Email
                <div className="relative inline-block">
                  <div className="peer inline-block">
                    <Info
                      className={`h-4 w-4 ${error['email']?.isError ? 'text-red-600' : ''} hover:cursor-pointer`}
                    />
                  </div>
                  <span className="absolute bottom-full -left-2 mb-2 p-3 text-xs text-white bg-black rounded opacity-0 peer-hover:opacity-100 transition-opacity w-[250px] pointer-events-none z-10">
                    Only valid emails are accepted (e.g., no spaces, must include @ and a domain)
                    <span className="absolute top-full left-[11px] w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-t-black border-l-transparent border-r-transparent"></span>
                  </span>
                </div>
              </Label>
              <Input
                id="email"
                type="text"
                placeholder="your.email@example.com"
                className={`${error['email']?.isError || error['all']?.isError ? 'border-red-600' : ''}`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError({})
                }}
              />
              {error['email']?.isError && <p className="text-red-600">{error['email'].message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="flex gap-1">
                Password
                <div className="relative inline-block">
                  <div className="peer inline-block">
                    <Info
                      className={`h-4 w-4 ${error['password']?.isError ? 'text-red-600' : ''} hover:cursor-pointer`}
                    />
                  </div>
                  <span className="absolute bottom-full -left-2 mb-2 p-3 text-xs text-white bg-black rounded opacity-0 peer-hover:opacity-100 transition-opacity w-[250px] pointer-events-none z-10">
                    Password must be 8–16 characters long, include an uppercase letter, lowercase
                    letter, number, special character, and no spaces.
                    <span className="absolute top-full left-[11px] w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-t-black border-l-transparent border-r-transparent"></span>
                  </span>
                </div>
              </Label>
              <Input
                id="password"
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
              <Label htmlFor="password-confirmation">Password confirmation</Label>
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
                setOpen((prev) => ({ ...prev, register: false }))
                clearInputs()
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
