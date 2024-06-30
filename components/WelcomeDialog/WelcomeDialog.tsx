// components/WelcomeDialog.tsx
import React, { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

const WelcomeDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  useEffect(() => {
    const shouldShow = localStorage.getItem('showWelcomeDialog') !== 'false'
    if (shouldShow) {
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    if (dontShowAgain) {
      localStorage.setItem('showWelcomeDialog', 'false')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Welcome to Conversations by Highlight</DialogTitle>
          {/* <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <FaTimes className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button> */}
        </DialogHeader>
        <DialogDescription className="space-y-4">
          <p>
            Conversations listens to your microphone and continuously captures your speech, transcribing it into text. For optimal accuracy, Highlight delivers a transcript every 30 seconds. After a period of inactivity, Conversations automatically saves the conversation.
          </p>
          <p>
            Conversations prioritizes your privacy. It does not store voice data; transcripts are generated using a locally running LLM. Only the transcript is saved locally on your computer. No transcripts are sent to any server or service without your explicit permission. Conversations is designed with your privacy at the forefront.
          </p>
          <p>Coming soon:</p>
          <ul className="list-disc list-inside">
            <li>Attach your conversation to Highlight to be further processed by your app of choice.</li>
          </ul>
        </DialogDescription>
        <div className="flex items-center space-x-2 justify-center mt-4">
          <Checkbox
            id="dontShowAgain"
            checked={dontShowAgain}
            onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
          />
          <label
            htmlFor="dontShowAgain"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Don&apos;t show this again
          </label>
        </div>
        <Button onClick={handleClose} className="mt-4 w-full bg-brand">Close</Button>
      </DialogContent>
    </Dialog>
  )
}

export default WelcomeDialog