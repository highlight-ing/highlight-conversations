interface TooltipProps {
    message: string;
    state: 'idle' | 'copying' | 'copied' | 'hiding';
    className?: string;
  }
  
  const Tooltip: React.FC<TooltipProps> = ({ message, state, className = '' }) => {
    return (
      <span 
        className={`absolute -top-8 left-1/2 -translate-x-1/2 transform rounded bg-neutral-700 px-2 py-1 text-xs text-white shadow-md z-10 transition-opacity duration-200 ${
          state === 'copying' ? 'opacity-0' :
          state === 'copied' ? 'opacity-100' : 
          state === 'hiding' ? 'opacity-0' : 'hidden'
        } ${className}`}
      >
        {message}
      </span>
    );
  };
  
  export default Tooltip;