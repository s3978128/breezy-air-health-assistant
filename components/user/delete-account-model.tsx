'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'

export default function DeleteAccountModel() {
  const { open, setOpen, deleteAccount } = useAuth()

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount()

      setOpen((prev) => ({ ...prev, deleteAccount: false }))
      toast({
        title: 'Account deleted successfully.',
        description: 'Your Breezy account has been permanently removed.',
      })
    } catch (err) {
      toast({
        title: 'Error deleting account',
        description: 'Something went wrong while deleting your account. Please try again later.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog
      open={open.deleteAccount}
      onOpenChange={(open) => setOpen((prev) => ({ ...prev, deleteAccount: open }))}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>You're about to delete your account.</DialogTitle>
          <DialogDescription>
            <p>
              This will erase your data <span className="font-bold">forever</span>. Are you sure you
              want to continue?
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen((prev) => ({ ...prev, deleteAccount: false }))}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteAccount}>
            Continue delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
