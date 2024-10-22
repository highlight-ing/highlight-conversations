import { Metadata } from 'next'
import { meta } from '@/config/meta'
import DownloadButton from '@/components/Share/DownloadButton'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'

export const metadata: Metadata = {
  title: `${meta.title} - Page Not Found`,
  description: meta.description
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="inline-block">
        <Card>
          <CardHeader>
            <h1 className="whitespace-nowrap text-xl font-semibold leading-tight text-foreground sm:text-2xl">
              This conversation has been made private
            </h1>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground break-words text-sm sm:text-base">
              To gain access, ask the sender to share another link.
              <br />
              <br /> To securely create and share your own transcripts, <br /> download Conversations for free.
            </p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <DownloadButton page="NotFoundPage" />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
