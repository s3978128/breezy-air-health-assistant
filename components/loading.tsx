import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export function LoadingAQI() {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-5 w-40" />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <Skeleton className="h-12 w-20 mb-2" />
              <Skeleton className="h-6 w-32" />
            </div>

            <div className="w-full md:w-2/3">
              <Skeleton className="h-8 w-full rounded-full" />
              <div className="flex justify-between mt-1">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
