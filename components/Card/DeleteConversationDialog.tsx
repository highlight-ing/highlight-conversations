import React, { useState } from 'react'
import { TrashIcon } from '@/components/ui/icons'
import { Tooltip, TooltipState } from '@/components/Tooltip/Tooltip'
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
}

const DeleteConversationDialog: React.FC<DeleteConversationDialogProps> = ({ onDelete }) => {
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
        <button
          onClick={handleDeleteClick}
          onMouseEnter={() => setDeleteTooltipState('active')}
          onMouseLeave={() => setDeleteTooltipState('idle')}
          className="text-muted-foreground hover:text-destructive relative flex items-center justify-center transition-colors duration-200"
        >
          {/* <TrashIcon variant="Bold" width={24} height={24} className="group-hover:text-destructive" /> */}
          <Trash variant="Bold" className="group-hover:text-destructive text-primary hover:text-secondary" />
          <Tooltip type="delete" state={deleteTooltipState} />
        </button>
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
