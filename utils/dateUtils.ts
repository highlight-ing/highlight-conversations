// utils/dateUtils.ts
import { format, isToday as isTodayDate, isWithinInterval, subDays, subHours } from 'date-fns'

export const formatTimestamp = (date: Date | string | number, locale?: string): string => {
  // Default to 'en-US' if no locale is provided
  const userLocale = locale || 'en-US';

  // Convert to Date object if it's not already
  const dateObject = date instanceof Date ? date : new Date(date);

  // Check if the date is valid
  if (isNaN(dateObject.getTime())) {
    console.error('Invalid date input:', date);
    return 'Invalid date';
  }

  // Use Intl.DateTimeFormat for consistent formatting in all environments
  const formatter = new Intl.DateTimeFormat(userLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short'
  });

  return formatter.format(dateObject);
};
  
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
      
  // Calculate the difference in days
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const differenceMs = nowNormalized.getTime() - dateNormalized.getTime();
  const days = Math.floor(differenceMs / millisecondsPerDay);
      
  return days;
};

export function getRelativeTimeString(date: Date | unknown): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.error('Invalid date input:', date);
    console.error('Type:', typeof date);
    console.error('JSON representation:', JSON.stringify(date));
    return 'Invalid date';
  }

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

export function formatTimestampSimple(date: Date): string {
  return format(date, 'PPpp')
}
  
export function isToday(date: Date): boolean {
  return isTodayDate(date)
}
  
export function isPast7Days(date: Date): boolean {
  return isWithinInterval(date, { start: subDays(new Date(), 7), end: new Date() })
}

export function isOlderThan7Days(date: Date): boolean {
  return date < subDays(new Date(), 7)
}

export function isLast24Hours(date: Date): boolean {
  return isWithinInterval(date, { start: subHours(new Date(), 24), end: new Date() })
}