import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Lock1 } from "iconsax-react";
import { setAudioSuperpowerEnabled } from "@/services/highlightService"
import { error } from "console";

interface AudioPermissionDialogProps {
    isAudioPermissionGranted: boolean | null
}

const AudioPermissionDialog: React.FC<AudioPermissionDialogProps> = ({ isAudioPermissionGranted }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isAudioPermissionGranted === false) {
            setIsOpen(true);
        } else if (isAudioPermissionGranted === true) {
            setIsOpen(false);
        }
    }, [isAudioPermissionGranted]);

    const handleEnableAudioTranscript = () => {
        try { 
            setAudioSuperpowerEnabled(true)
        } catch (error) {
            console.log('Error handle Enable Audio Transcript: ', error)
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent isAudioPermissionDialog>
            <DialogHeader>
                <div className="flex items-center gap-2">
                    <Lock1 size={24} color="#FF3333" />
                    <DialogTitle>Permissions Locked</DialogTitle>
                </div>
            </DialogHeader>
            <DialogDescription className="text-foreground/80">
                To use Conversations, you need to enable Audio Transcript permissions for Highlight.
            </DialogDescription>
            <Button onClick={handleEnableAudioTranscript} className="mt-4">
                Enable Audio Transcript Detection
            </Button>
          </DialogContent>
        </Dialog>
    );
}

export default AudioPermissionDialog;