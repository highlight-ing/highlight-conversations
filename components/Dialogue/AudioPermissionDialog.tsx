import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Lock1 } from "iconsax-react";

interface AudioPermissionDialogProps {
    isAudioPermissionGranted: boolean
}

const AudioPermissionDialog: React.FC<AudioPermissionDialogProps> = ({ isAudioPermissionGranted }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!isAudioPermissionGranted) {
            setIsOpen(true);
        }
    }, [isAudioPermissionGranted]);

    const handleEnableAudioTranscript = () => {
        // Implement the logic to enable audio transcript here
        console.log("Enable Audio Transcript Detection clicked");
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