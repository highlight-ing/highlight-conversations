import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

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
          <Spinner className="text-brand" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessingDialog;