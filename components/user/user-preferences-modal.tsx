'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import type { UserPreferences } from '@/lib/types'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'

export default function UserPreferencesModal() {
  // Default user preferences
  const [healthConditions, setHealthConditions] = useState({
    asthma: false,
    copd: false,
    heartDisease: false,
    allergies: true,
  })
  const [sensitiveGroup, setSensitiveGroup] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { open, setOpen, preferences, updatePreferences } = useAuth()

  const handleSave = async () => {
    setIsSaving(true)
    const updated: UserPreferences = {
      healthConditions,
      sensitiveGroup,
    }

    const isSuccess = await updatePreferences(updated)
    if (isSuccess) {
      toast({
        title: 'Preferences saved successfully',
        description: 'Your preferences have been updated and saved.',
      })
      setOpen((prev) => ({ ...prev, preferences: false }))
    } else {
      toast({
        title: 'Error saving preferences',
        description: 'We encountered an issue saving your preferences. Please try again.',
        variant: 'destructive',
      })
    }

    setIsSaving(false)
  }

  useEffect(() => {
    if (preferences) {
      setHealthConditions(preferences.healthConditions)
      setSensitiveGroup(preferences.sensitiveGroup)
    }
  }, [preferences])

  return (
    <Dialog
      open={open.preferences}
      onOpenChange={(open) => setOpen((prev) => ({ ...prev, preferences: open }))}
    >
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>User Preferences</DialogTitle>
          <DialogDescription>
            Customize your Breezy experience with personalized settings.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-3">
          <div>
            <Label className="font-medium mb-2 block">Health Conditions</Label>
            <p className="text-sm text-gray-500 mb-3">
              Select any conditions that apply to you or your household members
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="asthma"
                  checked={healthConditions.asthma}
                  onCheckedChange={(checked) =>
                    setHealthConditions({
                      ...healthConditions,
                      asthma: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="asthma">Asthma</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copd"
                  checked={healthConditions.copd}
                  onCheckedChange={(checked) =>
                    setHealthConditions({
                      ...healthConditions,
                      copd: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="copd">COPD</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="heart-disease"
                  checked={healthConditions.heartDisease}
                  onCheckedChange={(checked) =>
                    setHealthConditions({
                      ...healthConditions,
                      heartDisease: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="heart-disease">Heart Disease</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allergies"
                  checked={healthConditions.allergies}
                  onCheckedChange={(checked) =>
                    setHealthConditions({
                      ...healthConditions,
                      allergies: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="allergies">Allergies</Label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sensitive-group" className="font-medium">
                Sensitive Group
              </Label>
              <p className="text-sm text-gray-500">
                I am (or someone in my household is) in a sensitive group (children, elderly,
                pregnant)
              </p>
            </div>
            <Switch
              id="sensitive-group"
              checked={sensitiveGroup}
              onCheckedChange={setSensitiveGroup}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setOpen((prev) => ({ ...prev, preferences: false }))
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
