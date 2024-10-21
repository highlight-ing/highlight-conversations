import React, { useEffect, useState, useCallback, useRef } from 'react';
import Summary from '../../Components/Summary';
import { ConversationData } from '@/data/conversations';
import { useConversations } from '@/contexts/ConversationContext';
import { formatHeaderTimestamp, getRelativeTimeString } from '@/utils/dateUtils';
import TrashIcon from '../Icon/TrashIcon';
import { Pencil1Icon } from '@radix-ui/react-icons';
import DeleteConversationDialog from '@/components/Card/DeleteConversationDialog';
import VoiceSquareIcon from '../Icon/VoiceSquareIcon';

interface HeaderProps {
  conversation?: ConversationData;
  icon?: React.ReactNode;
  onTitleUpdate: (newTitle: string) => void;
}

const CompletedConversation: React.FC<HeaderProps> = ({ conversation }) => {
  const { updateConversation, deleteConversation } = useConversations();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // title update
  const updateTitle = useCallback(() => {
    if (!conversation) {
      setTitle('');
      return;
    }
    if (!conversation.title || conversation.title.trim() === '' || conversation.title.startsWith('Conversation ended at')) {
      setTitle(getRelativeTimeString(conversation.startedAt));
    } else {
      setTitle(conversation.title);
    }
  }, [conversation]);

  // update the title
  useEffect(() => {
    updateTitle();
  }, [updateTitle]);

  // Update every minute
  useEffect(() => {
    const timer = setInterval(updateTitle, 60000);
    return () => clearInterval(timer);
  }, [updateTitle]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const formattedTimestamp =
    conversation && conversation.startedAt && conversation.endedAt
      ? formatHeaderTimestamp(conversation.startedAt, conversation.endedAt)
      : '';

  // delete function for the trash icon
  const handleDelete = () => {
    if (conversation) {
      deleteConversation(conversation.id);
    }
  };

  // Open the delete confirmation dialog
  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  // Close the delete confirmation dialog
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  // Handle the title blur
  const handleTitleBlur = () => {
    setIsEditing(false);
    if (!conversation) return;
    if (title.trim() === '') {
      setTitle(getRelativeTimeString(conversation.startedAt));
    } else {
      updateConversation({ ...conversation, title });
    }
  };

  // Handle the title key down
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    }
  };

  return (
    <div className="h-[900px] relative">
      {/* Wrapped in a single parent element */}
      <>
        <div className="w-[624px] left-[64px] top-[104px] absolute text-[#484848] text-[15px] font-normal font-inter leading-normal">
          {formattedTimestamp}
        </div>

        {/* Delete, Open, Copy Link buttons */}
        <div className="absolute left-[549px] top-[48px] inline-flex items-center gap-4">
          <div className="flex items-center justify-center w-6 h-6 opacity-40">
            <div className="relative w-6 h-6" onClick={openDeleteDialog}>
              <TrashIcon />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-[10px] bg-white/10">
            <div className="text-[15px] font-medium leading-tight text-[#b4b4b4]">Open</div>
          </div>
          <div className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-[10px] bg-white/10">
            <div className="text-[15px] font-medium leading-tight text-[#b4b4b4]">Copy Link</div>
          </div>
        </div>

        {/* Title and Editable Logic */}
        <div className="left-[63px] top-[48px] absolute flex items-center gap-[13px]">
          <div className="w-8 h-8 flex justify-center items-center">
            <VoiceSquareIcon />
          </div>

          {/* Title (Editable or Static) */}
          <div className="text-white text-2xl font-semibold font-inter leading-[31px]">
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleKeyDown}
                className="text-white text-2xl font-semibold font-inter leading-[31px] bg-transparent outline-none"
              />
            ) : (
              <h1
                className="text-white text-2xl font-semibold font-inter leading-[31px] cursor-pointer flex items-center"
                onClick={() => setIsEditing(true)}
              >
                {title}
                <Pencil1Icon className="ml-2 h-4 w-4 text-white/50 hover:text-white" />
              </h1>
            )}
          </div>
        </div>

         {/* Summary Component */}
         <div className="w-[624px] left-[64px] top-[176px] absolute">
         {conversation && (
          <Summary summary={conversation.summary} transcript={conversation.transcript} />
        )}
        </div>

        {/* Delete Confirmation Dialog */}
        {isDeleteDialogOpen && (
          <DeleteConversationDialog
            onDelete={handleDelete}
            onCancel={closeDeleteDialog}
          />
        )}
      </>
    </div>
  );
};

export default CompletedConversation;
