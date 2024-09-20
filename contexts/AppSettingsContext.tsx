import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  saveBooleanInAppStorage, 
  saveNumberInAppStorage, 
  getBooleanFromAppStorage,
  getNumberFromAppStorage,
  AUDIO_ENABLED_KEY 
} from '@/services/highlightService';

interface AppSettingsContextType {
  isAudioOn: boolean;
  setIsAudioOn: (isOn: boolean) => Promise<void>;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAudioOn, setIsAudioOn] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      const audioEnabled = await getBooleanFromAppStorage(AUDIO_ENABLED_KEY, true);
      setIsAudioOn(audioEnabled);
    };

    loadSettings();
  }, []);

  const setIsAudioOnAndSave = async (isOn: boolean) => {
    setIsAudioOn(isOn);
    await saveBooleanInAppStorage(AUDIO_ENABLED_KEY, isOn);
  };

  return (
    <AppSettingsContext.Provider 
      value={{
        isAudioOn,
        setIsAudioOn: setIsAudioOnAndSave,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};