import * as amplitude from '@amplitude/analytics-browser';

// Define the event types
type BaseEventType = 'Conversations Interaction';
type EventType = BaseEventType | `DEBUG ${BaseEventType}`;

// Define a type for the event properties
interface EventProperties {
  action: string;
  [key: string]: any;
}

// Debug mode constant
export const IS_DEBUG = process.env.NEXT_PUBLIC_AMPLITUDE_DEBUG_MODE === 'true';

export const initAmplitude = (): void => {
  if (typeof window !== 'undefined') {
    amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY as string, {
      defaultTracking: true,
    });
  }
};

const trackEventInternal = (eventType: EventType, eventProperties: EventProperties): void => {
  if (typeof window !== 'undefined') {
    amplitude.track(eventType, eventProperties);
  }
};

export const trackEvent = (eventType: BaseEventType, eventProperties: EventProperties): void => {
  const finalEventType: EventType = IS_DEBUG ? `DEBUG ${eventType}` : eventType;
  trackEventInternal(finalEventType, eventProperties);
};