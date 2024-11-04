// utils/dateUtils.ts
import { format, isToday as isTodayDate, isWithinInterval, subDays, subHours } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

export const formatTimestamp = (date: Date | string | number, locale?: string): string => {
  // Default to 'en-US' if no locale is provided
  const userLocale = locale || 'en-US'

  // Convert to Date object if it's not already
  const dateObject = date instanceof Date ? date : new Date(date)

  // Check if the date is valid
  if (isNaN(dateObject.getTime())) {
    console.error('Invalid date input:', date)
    return 'Invalid date'
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
  })

  return formatter.format(dateObject)
}

// New formatting for Header: e.g. September 9 8:24am - 10:45am PDT
export const formatHeaderTimestamp = (startDate: Date | string | number, endDate: Date | string | number): string => {
  const startDateObj = startDate instanceof Date ? startDate : new Date(startDate)
  const endDateObj = endDate instanceof Date ? endDate : new Date(endDate)

  // check if dates are valid
  if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
    console.error('Invalid date input:', { startDate, endDate })
    return 'Invalid date range'
  }

  // get the user's time zone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  // format the date part
  const datePart = format(startDateObj, 'MMMM d')

  const startTimePart = formatInTimeZone(startDateObj, userTimeZone, 'h:mma')
  const endTimePart = formatInTimeZone(endDateObj, userTimeZone, 'h:mma')

  const timeZoneAbbr = formatInTimeZone(startDateObj, userTimeZone, 'zzz')

  return `${datePart} ${startTimePart} - ${endTimePart} ${timeZoneAbbr}`
}

// Helper function to get standard timezone abbreviation
const getStandardTimezoneAbbr = (timeZone: string): string => {
  const timezoneMap: { [key: string]: string } = {
    // North America
    'America/Los_Angeles': 'PST',
    'America/New_York': 'EST',
    'America/Chicago': 'CST',
    'America/Denver': 'MST',
    'America/Phoenix': 'MST',
    'America/Anchorage': 'AKST',
    'Pacific/Honolulu': 'HST',
    'America/Halifax': 'AST',
    'America/St_Johns': 'NST',
    
    // South America
    'America/Sao_Paulo': 'BRT',
    'America/Argentina/Buenos_Aires': 'ART',
    'America/Caracas': 'VET',
    'America/Santiago': 'CLT',
    
    // Europe
    'Europe/London': 'GMT',
    'Europe/Paris': 'CET',
    'Europe/Moscow': 'MSK',
    'Europe/Istanbul': 'TRT',
    'Europe/Berlin': 'CET',
    'Europe/Rome': 'CET',
    'Europe/Madrid': 'CET',
    
    // Asia
    'Asia/Tokyo': 'JST',
    'Asia/Seoul': 'KST',
    'Asia/Shanghai': 'CST', 
    'Asia/Singapore': 'SGT',
    'Asia/Dubai': 'GST',
    'Asia/Bangkok': 'ICT',
    'Asia/Kolkata': 'IST',
    'Asia/Tehran': 'IRST',
    'Asia/Karachi': 'PKT',
    'Asia/Hong_Kong': 'HKT',
    
    // Oceania
    'Australia/Sydney': 'AEST',
    'Australia/Perth': 'AWST',
    'Australia/Adelaide': 'ACST',
    'Pacific/Auckland': 'NZST',
    'Pacific/Fiji': 'FJT',
    
    // Africa
    'Africa/Cairo': 'EET',
    'Africa/Johannesburg': 'SAST',
    'Africa/Lagos': 'WAT',
    'Africa/Nairobi': 'EAT',
    
    // Additional regions with 30/45-minute offsets
    'Asia/Kathmandu': 'NPT',    // UTC+5:45
    'Asia/Colombo': 'SLT',      // UTC+5:30
    'Asia/Kabul': 'AFT',        // UTC+4:30
    'Australia/Darwin': 'ACST',  // UTC+9:30
    'Pacific/Chatham': 'CHAST', // UTC+12:45
  }
  
  return timezoneMap[timeZone] || 'UTC'
}

export const formatTimestampWithTimer = (startTime: Date, elapsedMs: number): string => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  
  // Fixed start time (e.g. "10:50am") - use the passed in startTime
  const timeStr = formatInTimeZone(startTime, userTimeZone, 'h:mma').toLowerCase()
  const tzAbbr = getStandardTimezoneAbbr(userTimeZone)
  
  // Use the passed in elapsedMs to show elapsed time
  const totalSeconds = Math.floor(elapsedMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const timerStr = `${minutes}:${seconds.toString().padStart(2, '0')}`
  
  return `Started ${timeStr} ${tzAbbr} — ${timerStr}`
}

export const getTimeDifference = (date: Date, now: Date = new Date()): number => {
  return now.getTime() - date.getTime()
}

export const minutesDifference = (date: Date, now: Date = new Date()): number => {
  return Math.floor(getTimeDifference(date, now) / 60000)
}

export const daysDifference = (date: Date, now: Date = new Date()): number => {
  // Reset the time part of both dates to midnight
  const dateNormalized = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const nowNormalized = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // Calculate the difference in days
  const millisecondsPerDay = 1000 * 60 * 60 * 24
  const differenceMs = nowNormalized.getTime() - dateNormalized.getTime()
  const days = Math.floor(differenceMs / millisecondsPerDay)

  return days
}

export function getRelativeTimeString(date: Date | unknown): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.error('Invalid date input:', date)
    console.error('Type:', typeof date)
    console.error('JSON representation:', JSON.stringify(date))
    return 'Invalid date'
  }

  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 300) {
    // Less than 5 minutes
    return 'Moments ago'
  } else if (diffInSeconds < 3600) {
    // Less than 1 hour
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    // Less than 1 day
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
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
