'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MapPin, Loader2, RefreshCw } from 'lucide-react'
import { useLocation } from '@/contexts/location-context'
import { useAirQuality } from '@/contexts/air-quality-context'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function LocationIndicator() {
  const {
    currentLocation,
    isDetectingLocation,
    isUsingDefaultLocation,
    isLocationPermissionDenied,
    detectLocation,
  } = useLocation()
  const { refreshData } = useAirQuality()
  const [showLocationInfo, setShowLocationInfo] = useState(false)

  const handleDetectLocation = async () => {
    await detectLocation()
    await refreshData()
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 h-8"
              onClick={() => setShowLocationInfo(true)}
            >
              {isDetectingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              <span className="max-w-[150px] truncate">{currentLocation}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to manage location settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={showLocationInfo} onOpenChange={setShowLocationInfo}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Location Settings</DialogTitle>
            <DialogDescription>
              Breezy uses your location to provide accurate air quality data for your area.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">Current Location</h3>
                <p className="text-sm text-gray-500">{currentLocation}</p>
              </div>
            </div>

            {isLocationPermissionDenied && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm">
                <p className="text-amber-800">
                  Location permission has been denied. To enable location detection, please update
                  your browser settings.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Privacy Information</h3>
              <p className="text-xs text-gray-500">
                Your location data is only used to provide you with relevant air quality
                information. We do not store your precise location on our servers or share it with
                third parties.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLocationInfo(false)}>
              Close
            </Button>
            <Button onClick={handleDetectLocation} disabled={isDetectingLocation}>
              {isDetectingLocation ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Detecting...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Detect My Location
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
