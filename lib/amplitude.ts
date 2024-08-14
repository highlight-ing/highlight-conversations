import * as amplitude from '@amplitude/analytics-browser';

// Debug mode constant
export const IS_DEBUG = process.env.NEXT_PUBLIC_AMPLITUDE_DEBUG_MODE === 'true';

// Define a type for the event properties
interface EventProperties {
  [key: string]: any;
}

export const initAmplitude = (userId: string): void => {
  if (typeof window !== 'undefined') {
    amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY as string, {
      defaultTracking: true,
      userId: userId,
    });
  }
};

const formatEventName = (eventName: string): string => {
  return `hl_conversations_${eventName.replace(/\s+/g, '_').toLowerCase()}`;
};

const trackEventInternal = (eventName: string, eventProperties: EventProperties): void => {
  if (typeof window !== 'undefined') {
    const formattedEventName = formatEventName(eventName);
    amplitude.track(formattedEventName, eventProperties);
  }
};

export const trackEvent = (eventName: string, eventProperties: EventProperties): void => {
  const finalEventName = IS_DEBUG ? `DEBUG ${eventName}` : eventName;
  trackEventInternal(finalEventName, eventProperties);
};