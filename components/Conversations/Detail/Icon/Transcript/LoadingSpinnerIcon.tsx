import React from 'react';

const LoadingSpinner = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="animate-spin"
  >
    <path d="M12 2V6" stroke="#484848" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 18V22" stroke="#484848" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.93018 4.93018L7.76018 7.76018" stroke="#484848" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.2402 16.2402L19.0702 19.0702" stroke="#484848" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12H6" stroke="#484848" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 12H22" stroke="#484848" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.93018 19.0702L7.76018 16.2402" stroke="#484848" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.2402 7.76018L19.0702 4.93018" stroke="#484848" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default LoadingSpinner;