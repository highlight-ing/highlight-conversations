import { Metadata } from 'next'
import { meta } from '@/config/meta'
import DownloadButton from '@/components/Share/DownloadButton'
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"

export const metadata: Metadata = {
  title: `${meta.title} - Page Not Found`,
  description: meta.description,
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground leading-tight">
            This conversation has been made private
          </h1>
        </CardHeader>
        <CardContent>
          <p className="text-sm sm:text-base text-muted-foreground">
            Download Conversations to securely create and share your own transcripts
          </p>
        </CardContent>
        <CardFooter className="flex justify-start">
          <DownloadButton />
        </CardFooter>
      </Card>
    </div>
  )
}