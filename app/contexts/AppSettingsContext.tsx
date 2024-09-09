import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  saveBooleanInAppStorage, 
  saveNumberInAppStorage, 
  getBooleanFromAppStorage,
  getNumberFromAppStorage,
  AUDIO_ENABLED_KEY, 
  AUTO_CLEAR_VALUE_KEY, 
  AUTO_SAVE_SEC_KEY 
} from '@/services/highlightService';
import { AUTO_CLEAR_DAYS, AUTO_SAVE_SEC } from '@/constants/appConstants';

interface AppSettingsContextType {
  isAudioOn: boolean;
  setIsAudioOn: (isOn: boolean) => Promise<void>;
  autoClearValue: number;
  setAutoClearValue: (value: number) => Promise<void>;
  autoSaveValue: number;
  setAutoSaveValue: (value: number) => Promise<void>;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [autoClearValue, setAutoClearValue] = useState(AUTO_CLEAR_DAYS);
  const [autoSaveValue, setAutoSaveValue] = useState(AUTO_SAVE_SEC);

  useEffect(() => {
    const loadSettings = async () => {
      const audioEnabled = await getBooleanFromAppStorage(AUDIO_ENABLED_KEY, true);
      const storedAutoClearValue = await getNumberFromAppStorage(AUTO_CLEAR_VALUE_KEY, AUTO_CLEAR_DAYS);
      const storedAutoSaveValue = await getNumberFromAppStorage(AUTO_SAVE_SEC_KEY, AUTO_SAVE_SEC);

      setIsAudioOn(audioEnabled);
      setAutoClearValue(storedAutoClearValue);
      setAutoSaveValue(storedAutoSaveValue);
    };

    loadSettings();
  }, []);

  const setIsAudioOnAndSave = async (isOn: boolean) => {
    setIsAudioOn(isOn);
    await saveBooleanInAppStorage(AUDIO_ENABLED_KEY, isOn);
  };

  const setAutoClearValueAndSave = async (value: number) => {
    setAutoClearValue(value);
    await saveNumberInAppStorage(AUTO_CLEAR_VALUE_KEY, value);
  };

  const setAutoSaveValueAndSave = async (value: number) => {
    setAutoSaveValue(value);
    await saveNumberInAppStorage(AUTO_SAVE_SEC_KEY, value);
  };

  return (
    <AppSettingsContext.Provider 
      value={{
        isAudioOn,
        setIsAudioOn: setIsAudioOnAndSave,
        autoClearValue,
        setAutoClearValue: setAutoClearValueAndSave,
        autoSaveValue,
        setAutoSaveValue: setAutoSaveValueAndSave,
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