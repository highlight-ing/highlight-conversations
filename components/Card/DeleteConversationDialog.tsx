import React, { useState } from 'react'
import { TooltipState } from '@/components/Tooltip/Tooltip'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Trash } from 'iconsax-react'

interface DeleteConversationDialogProps {
  onDelete: () => void
  size?: number
  colorVariant?: 'default' | 'tertiary'
}

const DeleteConversationDialog: React.FC<DeleteConversationDialogProps> = ({
  onDelete,
  size = 24,
  colorVariant = 'default'
}) => {
  const [deleteTooltipState, setDeleteTooltipState] = useState<TooltipState>('idle')
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const handleDeleteClick = () => {
    setIsAlertOpen(true)
  }

  const handleConfirmDelete = () => {
    onDelete()
    setDeleteTooltipState('success')
    setTimeout(() => setDeleteTooltipState('hiding'), 1500)
    setTimeout(() => setDeleteTooltipState('idle'), 1700)
    setIsAlertOpen(false)
  }

  return (
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
      <AlertDialogTrigger asChild>
        <Trash
          variant="Bold"
          className="text-[#484848] hover:text-gray-300 transition-colors"
          color={'currentColor'}
          size={size}
          onClick={handleDeleteClick}
          onMouseEnter={() => setDeleteTooltipState('active')}
          onMouseLeave={() => setDeleteTooltipState('idle')}
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>Deleting this conversation will delete it forever.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            className="hover:bg-destructive hover:text-destructive-foreground bg-foreground text-background transition-colors duration-200"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteConversationDialog
