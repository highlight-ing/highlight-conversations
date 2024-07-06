import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ProcessingDialogProps {
  isOpen: boolean;
}

const ProcessingDialog: React.FC<ProcessingDialogProps> = ({ isOpen }) => {
  return (
    <Dialog open={isOpen}>
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