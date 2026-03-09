'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bell, LogIn, LogOut, Settings, User, AlertCircle, KeyRound } from 'lucide-react'
import LoginModal from './login-modal'
import RegisterModal from './register-modal'
import NotificationSettingsModal from './notification-settings-modal'
import UserPreferencesModal from './user-preferences-modal'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/auth-context'
import DeleteAccountModel from './delete-account-model'
import InformationSettingsModal from './information-settings-model'

export default function UserAccountButton() {
  const { toast } = useToast()
  const { setOpen, logout, userName } = useAuth()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            {userName ? (
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">{userName}</span>
              </div>
            ) : (
              <div className="flex items-center">
                <LogIn className="h-4 w-4 mr-2" />
                <span>Account</span>
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        {/* dropdown underneath, going from left to right */}
        <DropdownMenuContent className="w-56" side="bottom" align="start">
          {userName ? (
            <>
              <DropdownMenuLabel>{userName}</DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => setOpen((prev) => ({ ...prev, preferences: true }))}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Preferences</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setOpen((prev) => ({ ...prev, notifications: true }))}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notification Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                {/* <DropdownMenuItem
                  onClick={() => setOpen((prev) => ({ ...prev, information: true }))}
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  <span>Information Settings</span>
                </DropdownMenuItem> */}
                <DropdownMenuItem
                  className=" text-red-700"
                  onClick={() => setOpen((prev) => ({ ...prev, deleteAccount: true }))}
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  <span>Delete Account</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={async () => {
                  await logout()
                  toast({
                    title: 'Logged out successfully',
                    description: 'You have been signed out. See you again soon!',
                  })
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={() => setOpen((prev) => ({ ...prev, login: true }))}>
                <LogIn className="mr-2 h-4 w-4" />
                <span>Log In</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpen((prev) => ({ ...prev, register: true }))}>
                <User className="mr-2 h-4 w-4" />
                <span>Create Account</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <LoginModal />

      <RegisterModal />

      <NotificationSettingsModal />

      <UserPreferencesModal />

      <InformationSettingsModal />

      <DeleteAccountModel />
    </>
  )
}
