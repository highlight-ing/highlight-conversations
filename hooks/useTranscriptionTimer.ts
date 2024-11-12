/**
 * @fileoverview Transcription Timer Hook for ConversationDetail.tsx
 * @author Jungyoon Lim, Joanne <joanne@highlight.ing>
 */

import { useState, useEffect } from 'react'

// 
interface TranscriptionTimerConfig {
    isAudioOn: boolean
    micActivity: number
    onSave: () => void
    transcribeTimeout?: number
    saveTimeout?: number
}

export const useTranscriptionTimer = ({
    isAudioOn,
    micActivity,
    onSave,
    transcribeTimeout = 30000,
    saveTimeout = 60000
}: TranscriptionTimerConfig) => {
    const [isTranscribing, setIsTranscribing] = useState<boolean>(false)
    const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null)

    useEffect(() => {
        let transcribeTimer: NodeJS.Timeout | null = null

        // check if sound is detected
        const isSoundDetected = isAudioOn && micActivity > 0

        // silent if Audio On and Mic Activity are both 0 
        const isSilent = isAudioOn && micActivity === 0

        
        if (isSoundDetected) {
            setIsTranscribing(true)

            // clear any existing timers
            if (transcribeTimer) clearTimeout(transcribeTimer)
            
            // If it is saving timer, clear the timer and set it to null
            if (saveTimer){
                clearTimeout(saveTimer)
                setSaveTimer(null)
            }
        } else if (isSilent) {
            // Set a timer to stop transcribing after 30 sec of silence
            transcribeTimer = setTimeout(() => {
                setIsTranscribing(false)
            }, transcribeTimeout)

            // if not save Timer 
            if (!saveTimer){
                const newSaveTimer = setTimeout(() => {
                    onSave()
                    setSaveTimer(null)
                }, saveTimeout)
                setSaveTimer(newSaveTimer)
            }
        } else {
            // If audio is off
            setIsTranscribing(false)
            if (saveTimer) {
                clearTimeout(saveTimer)
                setSaveTimer(null)
            }
        }
        return () => {
            if (transcribeTimer) clearTimeout(transcribeTimer)
            if (saveTimer) clearTimeout(saveTimer)
        }
    }, [isAudioOn, micActivity, saveTimer, onSave, transcribeTimeout, saveTimeout])
    return isTranscribing
}