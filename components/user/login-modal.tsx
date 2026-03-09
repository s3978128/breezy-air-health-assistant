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
import ChangePasswordModel from './change-password-modal'
import { signIn } from 'next-auth/react'
import { validateEmail, validatePassword } from '@/utils/input-validator'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'
import { Info } from 'lucide-react'

export default function LoginModal() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { login, open, setOpen } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    if (!email || !password) {
      setErrorMessage('All fields are required.')
      setIsLoading(false)
      return
    }

    if (!validateEmail(email) || !validatePassword(password)) {
      setErrorMessage('Invalid email or password.')
      setIsLoading(false)
      return
    }

    try {
      const isLogin = await login(email, password)
      if (isLogin) {
        toast({
          title: 'Login successful',
          description:
            'You’ve successfully signed in. Access your air quality data and preferences.',
        })

        setOpen((prev) => ({ ...prev, login: false }))
        clearInputs()
      } else {
        setErrorMessage('Invalid email or password.')
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearInputs = () => {
    setEmail('')
    setPassword('')
    setErrorMessage('')
  }

  return (
    <>
      <Dialog
        open={open.login}
        onOpenChange={(open) => setOpen((prev) => ({ ...prev, login: open }))}
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
            <DialogTitle>Welcome Back to Breezy</DialogTitle>
            <DialogDescription>
              Please enter your email and password to access your account.
            </DialogDescription>
          </DialogHeader>

          {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-3">
              <div className="grid gap-2">
                <Label htmlFor="email" className="flex gap-1">
                  Email
                  <div className="relative inline-block">
                    <div className="peer inline-block">
                      <Info className="h-4 w-4 hover:cursor-pointer" />
                    </div>
                    <span className="absolute bottom-full -left-2 mb-2 p-3 text-xs text-white bg-black rounded opacity-0 peer-hover:opacity-100 transition-opacity w-[250px] pointer-events-none">
                      Only valid emails are accepted (e.g., no spaces, must include @ and a domain)
                      <span className="absolute top-full left-[11px] w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-t-black border-l-transparent border-r-transparent"></span>
                    </span>
                  </div>
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrorMessage('')
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="flex gap-1">
                  Password
                  <div className="relative inline-block">
                    <div className="peer inline-block">
                      <Info className="h-4 w-4 hover:cursor-pointer" />
                    </div>
                    <span className="absolute bottom-full -left-2 mb-2 p-3 text-xs text-white bg-black rounded opacity-0 peer-hover:opacity-100 transition-opacity w-[250px] pointer-events-none">
                      Password must be 8-16 characters long, include at least one uppercase letter,
                      one lowercase letter, one number, and one special character, and cannot
                      contain spaces.
                      <span className="absolute top-full left-[11px] w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-t-black border-l-transparent border-r-transparent"></span>
                    </span>
                  </div>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrorMessage('')
                  }}
                />
              </div>
              <p className="text-right text-sm">
                <span
                  className="hover:underline cursor-pointer"
                  onClick={() => setOpen((prev) => ({ ...prev, changePassword: true }))}
                >
                  Forgot password?
                </span>
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen((prev) => ({ ...prev, login: false }))
                  clearInputs()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Log in'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ChangePasswordModel />
    </>
  )
}
