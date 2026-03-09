'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LogIn, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import LoginModal from '@/components/user/login-modal'
import RegisterModal from '@/components/user/register-modal'
import { useAuth } from '@/contexts/auth-context'

interface LoginPromptProps {
  message: string
  feature: string
  className?: string
  variant?: 'inline' | 'card' | 'subtle' | 'banner'
  showDismiss?: boolean
}

export default function LoginPrompt({
  message,
  feature,
  className,
  variant = 'card',
  showDismiss = true,
}: LoginPromptProps) {
  const [dismissed, setDismissed] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const { open, setOpen, login, register } = useAuth()

  if (dismissed) {
    return null
  }

  const handleLogin = () => {
    setLoginModalOpen(true)
  }

  const handleRegister = () => {
    setRegisterModalOpen(true)
  }

  const handleLoginSuccess = () => {
    setLoginModalOpen(false)
  }

  const handleRegisterSuccess = () => {
    setRegisterModalOpen(false)
  }

  if (variant === 'inline') {
    return (
      <>
        <div
          className={cn(
            'flex items-center justify-between text-sm text-sky-700 bg-sky-50 rounded-md p-2.5',
            className,
          )}
        >
          <div className="flex items-center">
            <LogIn className="h-4 w-4 mr-2 flex-shrink-0" />
            <p>{message}</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              onClick={() => setOpen((prev) => ({ ...prev, login: true }))}
            >
              Log in
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-xs"
              onClick={() => setOpen((prev) => ({ ...prev, register: true }))}
            >
              Sign up
            </Button>
            {showDismiss && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-gray-400 hover:text-gray-500"
                onClick={() => setDismissed(true)}
              >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Dismiss</span>
              </Button>
            )}
          </div>
        </div>

        <LoginModal />
        <RegisterModal />
      </>
    )
  }

  if (variant === 'subtle') {
    return (
      <>
        <div
          className={cn('flex items-center justify-between text-sm text-sky-700 p-2', className)}
        >
          <div className="flex items-center">
            <LogIn className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <p className="text-xs">{message}</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-xs"
            onClick={() => setOpen((prev) => ({ ...prev, login: true }))}
          >
            Log in
          </Button>
        </div>

        <LoginModal />
        <RegisterModal />
      </>
    )
  }

  if (variant === 'banner') {
    return (
      <>
        <div
          className={cn(
            'flex items-center justify-between text-sm bg-gradient-to-r from-sky-50 to-blue-50 p-3 rounded-lg border border-sky-100',
            className,
          )}
        >
          <div className="flex items-center">
            <LogIn className="h-4 w-4 mr-2 text-sky-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-sky-800">{feature}</p>
              <p className="text-xs text-sky-600 mt-0.5">{message}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              size="sm"
              variant="outline"
              className="h-8 bg-white"
              onClick={() => setOpen((prev) => ({ ...prev, login: true }))}
            >
              Log in
            </Button>
            {showDismiss && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-500"
                onClick={() => setDismissed(true)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Dismiss</span>
              </Button>
            )}
          </div>
        </div>

        <LoginModal />
        <RegisterModal />
      </>
    )
  }

  // Default card variant
  return (
    <>
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <LogIn className="h-4 w-4 mr-2 mt-0.5 text-sky-600 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-sky-800">{feature}</h4>
                <p className="text-xs text-gray-600 mt-1">{message}</p>
              </div>
            </div>
            {showDismiss && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-500"
                onClick={() => setDismissed(true)}
              >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Dismiss</span>
              </Button>
            )}
          </div>
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              variant="default"
              className="w-full"
              onClick={() => setOpen((prev) => ({ ...prev, login: true }))}
            >
              Log in
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => setOpen((prev) => ({ ...prev, register: true }))}
            >
              Sign up
            </Button>
          </div>
        </CardContent>
      </Card>

      <LoginModal />
      <RegisterModal />
    </>
  )
}
