// utils/dateUtils.ts

export const formatTimestamp = (date: Date, locale?: string): string => {
    const userLocale = locale || navigator.language || 'en-US';
    
    return date.toLocaleString(userLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
  
  export const getTimeDifference = (date: Date, now: Date = new Date()): number => {
    return now.getTime() - date.getTime();
  }
  
  export const minutesDifference = (date: Date, now: Date = new Date()): number => {
    return Math.floor(getTimeDifference(date, now) / 60000);
  }
  
  export const daysDifference = (date: Date, now: Date = new Date()): number => {
    return Math.floor(getTimeDifference(date, now) / (1000 * 60 * 60 * 24));
  }