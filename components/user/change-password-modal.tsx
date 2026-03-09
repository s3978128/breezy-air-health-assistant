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
import { ArrowLeftToLineIcon, Info } from 'lucide-react'
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validateUuidCode,
} from '@/utils/input-validator'
import { v4 as uuidv4 } from 'uuid'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/auth-context'

export default function ChangePasswordModal() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSentEmail, setIsSentEmail] = useState(false)
  const [isCorrectCode, setIsCorrectCode] = useState(false)
  const [verification, setVerification] = useState({
    uuid: '',
    expires: -1, // new Date().getTime() + 1000 * 60 * 60 * 24 -> 24 hours
  })
  const { toast } = useToast()
  const { changePassword, open, setOpen, isUserExisted } = useAuth()
  // email, all, password, confirm, code
  const [error, setError] = useState<Record<string, { isError: boolean; message: string }>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent submit + set loading for submit btn + set error empty
    e.preventDefault()
    setIsLoading(true)
    setError({})

    // All fields are empty -> return error and reset submit btn
    if (!code || !password || !passwordConfirmation) {
      setError((prev) => ({
        ...prev,
        all: { isError: true, message: 'All fields are required' },
      }))
      setIsLoading(false)
      return
    }

    let hasError = false

    // Validate inputs
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

    if (!validateUuidCode(code)) {
      setError((prev) => ({
        ...prev,
        code: {
          isError: true,
          message: 'The verification code is invalid. Please check the code and try again.',
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
      // todo add code conditions later
      const isChangePassword = await changePassword(email, password, code, verification)
      if (isChangePassword) {
        toast({
          title: 'Password changed successfully',
          description: 'You have been logged in with your new password.',
        })

        setOpen((prev) => ({ ...prev, changePassword: false, login: false }))
        clearInputs()
      } else {
        setError((prev) => ({
          ...prev,
          code: {
            isError: true,
            message:
              'The verification code is incorrect. Please check your email and try again, or request a new code if needed.',
          },
        }))
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendEmail = async () => {
    setIsLoading(true)

    // Email is empty -> return error and reset submit btn
    if (!email) {
      setError((prev) => ({
        ...prev,
        email: { isError: true, message: 'Email is required.' },
      }))
      setIsLoading(false)
      return
    }
    // Validate email -> return error and reset submit btn
    if (!validateEmail(email)) {
      setError((prev) => ({
        ...prev,
        email: { isError: true, message: 'Email has an invalid format.' },
      }))
      setIsLoading(false)
      return
    }

    // Check user existed
    const isExisted = await isUserExisted(email, 'credentials')

    // if user is not existed -> return error and reset submit btn
    if (!isExisted) {
      setError((prev) => ({
        ...prev,
        email: {
          isError: true,
          message: 'This email does not exist. Please try a different one.',
        },
      }))
      setIsLoading(false)
      return
    }

    try {
      // Send code to user's email
      const isSent = await sendEmail()

      if (isSent) {
        // After sent email
        setIsSentEmail(true)
        setError({})
      } else {
        setError((prev) => ({
          ...prev,
          email: {
            isError: true,
            message:
              'Something went wrong. Please try sending the email again or use a different address.',
          },
        }))
      }
    } catch (error) {
      console.error('Send email error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Return boolean
  const sendEmail = async () => {
    // Get verification code
    const verificationCode = uuidv4()

    // Send email with verification code
    const res = await fetch('/api/email/sendVerification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        verificationCode,
      }),
    })

    const { success, data } = await res.json()

    if (success) {
      setVerification({
        uuid: verificationCode,
        expires: Date.now() + 1000 * 60 * 5, // 5 minutes
      })

      toast({
        title: `Verification code sent to ${email}`,
        description: 'Please check your inbox and enter the code to continue.',
      })

      return true
    }

    return false
  }

  const clearInputs = () => {
    setEmail('')
    setCode('')
    setPassword('')
    setPasswordConfirmation('')
    setIsSentEmail(false)
    setIsCorrectCode(false)
    setError({})
    setIsLoading(false)
    setVerification({ uuid: '', expires: -1 })
  }

  return (
    <Dialog
      open={open.changePassword}
      onOpenChange={(open) => setOpen((prev) => ({ ...prev, changePassword: open }))}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Forgot Password?</DialogTitle>
          <DialogDescription>
            {isSentEmail ? (
              <span>
                <span>We've sent a verification code to your email. </span>
                <span className="text-blue-700">
                  Didn’t receive it?{' '}
                  <span className="font-bold hover:underline cursor-pointer" onClick={sendEmail}>
                    Resend Email
                  </span>
                </span>
              </span>
            ) : (
              <span>
                Enter your email to receive a <span className="font-bold">verification code</span>{' '}
                to reset your password.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {['email', 'all'].map((key) =>
          error[key]?.isError ? (
            <p key={key} className="text-red-600">
              {error[key].message}
            </p>
          ) : null,
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-3">
            <div className="grid gap-2">
              <Label htmlFor="email" className="flex gap-1 ">
                Email
                <div className="relative inline-block">
                  {!isSentEmail && (
                    <div className="peer inline-block">
                      <Info
                        className={`h-4 w-4 ${error['email']?.isError ? 'text-red-600' : ''} hover:cursor-pointer`}
                      />
                    </div>
                  )}
                  <span className="absolute bottom-full -left-2 mb-2 p-3 text-xs text-white bg-black rounded opacity-0 peer-hover:opacity-100 transition-opacity w-[250px] pointer-events-none z-10">
                    Only valid emails are accepted (e.g., no spaces, must include @ and a domain)
                    <span className="absolute top-full left-[11px] w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-t-black border-l-transparent border-r-transparent"></span>
                  </span>
                </div>
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                className={`${(error['email']?.isError || error['all']?.isError) && !isSentEmail ? 'border-red-600' : ''}`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError({})
                }}
                disabled={isSentEmail && true}
              />
            </div>
            <div className={isSentEmail ? 'grid gap-2' : 'hidden'}>
              <Label htmlFor="code" className="flex gap-1">
                Enter code
                <div className="relative inline-block">
                  <div className="peer inline-block">
                    <Info
                      className={`h-4 w-4 ${error['code']?.isError ? 'text-red-600' : ''} hover:cursor-pointer`}
                    />
                  </div>
                  <span className="absolute bottom-full -left-2 mb-2 p-3 text-xs text-white bg-black rounded opacity-0 peer-hover:opacity-100 transition-opacity w-[250px] pointer-events-none z-10">
                    Please enter the UUID code sent to your email address.
                    <span className="absolute top-full left-[11px] w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-t-black border-l-transparent border-r-transparent"></span>
                  </span>
                </div>
              </Label>
              <Input
                id="code"
                type="text"
                className={`${error['code']?.isError || error['all']?.isError ? 'border-red-600' : ''}`}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  setError({})
                }}
              />
              {error['code']?.isError && <p className="text-red-600">{error['code'].message}</p>}
            </div>
            <div className={isSentEmail ? 'grid gap-2' : 'hidden'}>
              <Label htmlFor="password" className="flex gap-1">
                New Password
                <div className="relative inline-block">
                  <div className="peer inline-block">
                    <Info
                      className={` h-4 w-4 ${error['password']?.isError ? 'text-red-600' : ''} hover:cursor-pointer`}
                    />
                  </div>
                  <span className="absolute bottom-full -left-2 mb-2 p-3 text-xs text-white bg-black rounded opacity-0 peer-hover:opacity-100 transition-opacity w-[250px] pointer-events-none z-10">
                    Password must be 8-16 characters long, include at least one uppercase letter,
                    one lowercase letter, one number, and one special character, and cannot contain
                    spaces.
                    <span className="absolute top-full left-[11px] w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-t-black border-l-transparent border-r-transparent"></span>
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
            <div className={isSentEmail ? 'grid gap-2' : 'hidden'}>
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
                clearInputs()
              }}
              className={isSentEmail ? 'mr-7' : 'hidden'}
            >
              <ArrowLeftToLineIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen((prev) => ({ ...prev, changePassword: false }))
                clearInputs()
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isLoading}
              className={isSentEmail ? 'hidden' : ''}
              onClick={handleSendEmail}
            >
              {isLoading ? 'Sending email...' : 'Send email'}
            </Button>
            <Button type="submit" disabled={isLoading} className={isSentEmail ? '' : 'hidden'}>
              {isLoading ? 'Processing...' : 'Change password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
