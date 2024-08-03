import * as amplitude from '@amplitude/analytics-browser';

export const initAmplitude = (): void => {
  if (typeof window !== 'undefined') {
    amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY as string, {
      defaultTracking: true,
    });
  }
};

export const trackEvent = (eventName: string, eventProperties?: Record<string, any>): void => {
  if (typeof window !== 'undefined') {
    amplitude.track(eventName, eventProperties);
  }
};