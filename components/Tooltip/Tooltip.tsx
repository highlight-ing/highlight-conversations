export type TooltipType = 'copy' | 'delete' | 'save' | 'share' | 'save-attachment';
export type TooltipState = 'idle' | 'active' | 'success' | 'hiding';

interface TooltipProps {
  type: TooltipType;
  state: TooltipState;
  className?: string;
  message?: string; 
}

export const Tooltip: React.FC<TooltipProps> = ({ type, state, className = '', message }) => {
  const getMessage = () => {
    if (message) {
      return state === 'success' ? message : message;
    }

    switch (type) {
      case 'copy':
        return state === 'success' ? 'Copied' : 'Copy';
      case 'delete':
        return state === 'success' ? 'Deleted' : 'Delete';
      case 'save':
        return state === 'success' ? 'Saved' : 'Save';
      case 'share':
        return state === 'success' ? 'Shared' : 'Share';
      case 'save-attachment':
        return state === 'success' ? 'Saved' : 'Save';
    }
  };

  return (
    <span 
      className={`absolute -top-8 left-1/2 -translate-x-1/2 transform rounded bg-muted-foreground/20 px-2 py-1 text-xs text-white shadow-md z-10 transition-opacity duration-200 ${
        state === 'idle' ? 'opacity-0' :
        state === 'active' ? 'opacity-100' : 
        state === 'success' ? 'opacity-100' : 
        state === 'hiding' ? 'opacity-0' : 'hidden'
      } ${className}`}
    >
      {getMessage()}
    </span>
  );
};