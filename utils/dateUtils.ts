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
    // Reset the time part of both dates to midnight
    const dateNormalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowNormalized = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    console.log(`Normalized dates - Conversation: ${dateNormalized.toISOString()}, Now: ${nowNormalized.toISOString()}`);
    
    // Calculate the difference in days
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const differenceMs = nowNormalized.getTime() - dateNormalized.getTime();
    const days = Math.floor(differenceMs / millisecondsPerDay);
    
    console.log(`Calculated difference: ${days} days`);
    
    return days;
  };

  export function getRelativeTimeString(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    if (diffInSeconds < 300) { // Less than 5 minutes
      return "Moments ago";
    } else if (diffInSeconds < 3600) { // Less than 1 hour
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) { // Less than 1 day
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }