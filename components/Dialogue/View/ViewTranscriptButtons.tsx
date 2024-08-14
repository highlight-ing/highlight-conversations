import { ClipboardIcon } from '@/components/ui/icons';
import { Export } from "iconsax-react";
import { Tooltip, TooltipState} from '@/components/Tooltip/Tooltip'
import DeleteConversationDialog from '@/components/Card/DeleteConversationDialog';

interface CopyButtonProps {
    onClick: () => void
    copyState: TooltipState
    setCopyTooltipState: (state: TooltipState) => void
  }
  
  export const CopyButton: React.FC<CopyButtonProps> = ({ onClick, copyState, setCopyTooltipState }) => (
    <div className='relative'>
      <button
        onClick={onClick}
        onMouseEnter={() => setCopyTooltipState('active')}
        onMouseLeave={() => setCopyTooltipState('idle')}
        className="text-muted-foreground transition-colors duration-200 flex items-center justify-center hover:text-brand"
      >
        <ClipboardIcon width={24} height={24} />
        <Tooltip type='copy' state={copyState} />
      </button>
    </div>
  );
  
  interface DeleteButtonProps {
    onDelete: () => void;
  }
  
  export const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete }) => (
    <DeleteConversationDialog onDelete={onDelete} />
  );

interface ShareButtonProps {
  onClick: () => void
  shareState: TooltipState
  setShareTooltipState: (state: TooltipState) => void
}

export const ShareButton: React.FC<ShareButtonProps> = ({ onClick, shareState, setShareTooltipState }) => (
  <div className='relative'>
    <button
      onClick={onClick}
      onMouseEnter={() => setShareTooltipState('active')}
      onMouseLeave={() => setShareTooltipState('idle')}
      className="text-muted-foreground transition-colors duration-200 flex items-center justify-center hover:text-brand"
    >
      <Export size={24} />
      <Tooltip type='share' state={shareState} />
    </button>
  </div>
);