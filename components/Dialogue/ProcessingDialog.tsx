import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
interface ProcessingDialogProps {
    isProcessing: boolean
}

const ProcessingDialog: React.FC<ProcessingDialogProps> = ({ isProcessing }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        console.log("isProcessing changed:", isProcessing); // Add this line
        setIsOpen(isProcessing);
      }, [isProcessing]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Processing...</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <div className="animate-spin h-6 w-6 border-2 border-brand border-t-transparent rounded-full"></div>
            </div>
          </DialogContent>
        </Dialog>
      );
};

export default ProcessingDialog;