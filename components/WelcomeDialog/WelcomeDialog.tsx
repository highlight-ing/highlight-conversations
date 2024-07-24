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
    if (shouldShow) setIsOpen(true)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    if (dontShowAgain) localStorage.setItem('showWelcomeDialog', 'false')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Welcome to Conversations by Highlight</DialogTitle>
        </DialogHeader>
        <DialogDescription className="space-y-3 text-foreground text-sm">
          <p className="font-medium">Conversations transcribes your speech in real-time, delivering updates every 30 seconds for optimal accuracy.</p>
          <p className="font-semibold text-base">Privacy First:</p>
          <ul className="list-disc list-inside font-normal">
            <li>No voice data stored</li>
            <li>Transcripts generated locally</li>
            <li>Data saved only on your device</li>
          </ul>
        </DialogDescription>
        <div className="flex items-center space-x-2 justify-center mt-4">
          <Checkbox
            id="dontShowAgain"
            checked={dontShowAgain}
            onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
          />
          <label htmlFor="dontShowAgain" className="text-sm font-medium">
            Don&apos;t show this again
          </label>
        </div>
        <Button onClick={handleClose} className="mt-4 w-full bg-brand font-semibold">Close</Button>
      </DialogContent>
    </Dialog>
  )
}

export default WelcomeDialog