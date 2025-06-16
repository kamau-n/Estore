"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function FirebaseConfigNotice() {
  const [showNotice, setShowNotice] = useState(false)

  useEffect(() => {
    const hasValidConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

    if (!hasValidConfig && process.env.NODE_ENV === "development") {
      setShowNotice(true)
    }
  }, [])

  if (!showNotice) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertTitle className="text-orange-800 dark:text-orange-200">Firebase Configuration Required</AlertTitle>
        <AlertDescription className="text-orange-700 dark:text-orange-300 mt-2">
          <p className="mb-3">To enable authentication and database features, please configure Firebase:</p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                1
              </Badge>
              <span>
                Copy <code>.env.example</code> to <code>.env.local</code>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                2
              </Badge>
              <span>Add your Firebase credentials</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                3
              </Badge>
              <span>Restart the development server</span>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button size="sm" variant="outline" onClick={() => setShowNotice(false)} className="text-xs">
              Dismiss
            </Button>
            <Button size="sm" asChild className="text-xs">
              <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Firebase Console
              </a>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
