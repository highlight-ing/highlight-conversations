import { Meeting } from '@/data/conversations'
import VoiceSquareIcon from './PanelIcons/ConversationEntry/VoiceSquareIcon'

const MeetingIcon = ({ meeting, size = 24 }: { meeting: Meeting; size: number }) => {
  switch (meeting.app.name) {
    case 'Google Meet':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_3598_55)">
            <mask
              id="mask0_3598_55"
              contentStyleType="mask-type:luminance"
              maskUnits="userSpaceOnUse"
              x="1"
              y="1"
              width="22"
              height="22"
            >
              <path d="M23 1H1V23H23V1Z" fill="white" />
            </mask>
            <g mask="url(#mask0_3598_55)">
              <path
                d="M16.8125 14.9736V14.4399V13.7028V10.2333V9.49617L17.3804 8.31424L20.2201 6.06479C20.5987 5.74707 21.1667 6.01396 21.1667 6.5096V17.2612C21.1667 17.7569 20.5861 18.0238 20.2075 17.706L16.8125 14.9736Z"
                fill="#00AC47"
              />
              <path d="M7.41666 4.4375L2.83333 9.02083H7.41666V4.4375Z" fill="#FE2C25" />
              <path d="M7.41665 9.02084H2.83332V14.9792H7.41665V9.02084Z" fill="#2684FC" />
              <path
                d="M2.83332 14.9792V18.0347C2.83332 18.875 3.52082 19.5625 4.36111 19.5625H7.41665V14.9792H2.83332Z"
                fill="#0066DA"
              />
              <path
                d="M17.3854 5.94775C17.3854 5.11712 16.7125 4.4375 15.8901 4.4375H12.8995H7.41666V9.02083H13.0312V12L17.3854 11.8629V5.94775Z"
                fill="#FFBA00"
              />
              <path
                d="M13.0312 14.9792H7.41666V19.5625H12.8995H15.8901C16.7125 19.5625 17.3854 18.8839 17.3854 18.0544V12H13.0312V14.9792Z"
                fill="#00AC47"
              />
              <path d="M17.3854 8.33334V15.4375L13.0312 12L17.3854 8.33334Z" fill="#00832D" />
            </g>
          </g>
          <defs>
            <clipPath id="clip0_3598_55">
              <rect width="22" height="22" fill="white" transform="translate(1 1)" />
            </clipPath>
          </defs>
        </svg>
      )

    case 'Zoom':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_3598_48)">
            <path
              d="M22 12C22 13.0694 21.9143 14.1179 21.75 15.1404C21.2064 18.5251 18.525 21.2061 15.14 21.7498C14.1179 21.914 13.0693 22 12 22C10.9307 22 9.88212 21.914 8.86 21.7498C5.475 21.2061 2.79359 18.5251 2.24998 15.1404C2.08571 14.1179 2 13.0694 2 12C2 10.9306 2.08571 9.88207 2.24998 8.85964C2.79359 5.47493 5.47499 2.79386 8.86 2.25021C9.88212 2.086 10.9307 2 12 2C13.0693 2 14.1179 2.086 15.14 2.25021C18.525 2.79386 21.2064 5.47493 21.75 8.85964C21.9143 9.88207 22 10.9306 22 12Z"
              fill="#0B5CFF"
            />
            <path
              d="M22 12C22 13.0694 21.9143 14.1179 21.75 15.1404C21.2064 18.5251 18.525 21.2061 15.14 21.7498C14.1179 21.914 13.0693 22 12 22C10.9307 22 9.88212 21.914 8.86 21.7498C5.475 21.2061 2.79359 18.5251 2.24998 15.1404C2.08571 14.1179 2 13.0694 2 12C2 10.9306 2.08571 9.88207 2.24998 8.85964C2.79359 5.47493 5.47499 2.79386 8.86 2.25021C9.88212 2.086 10.9307 2 12 2C13.0693 2 14.1179 2.086 15.14 2.25021C18.525 2.79386 21.2064 5.47493 21.75 8.85964C21.9143 9.88207 22 10.9306 22 12Z"
              fill="url(#paint0_radial_3598_48)"
            />
            <path
              d="M22 12C22 13.0694 21.9143 14.1179 21.75 15.1404C21.2057 18.5251 18.525 21.2061 15.14 21.7498C14.1179 21.914 13.0693 22 12 22C10.9307 22 9.88212 21.914 8.85931 21.7498C5.475 21.2061 2.79359 18.5251 2.24998 15.1404C2.08571 14.1179 2 13.0694 2 12C2 10.9307 2.08571 9.88207 2.24998 8.85957C2.79359 5.47493 5.47499 2.79379 8.85931 2.25014C9.88212 2.08593 10.9307 2 12 2C13.0693 2 14.1179 2.08593 15.14 2.25014C18.525 2.79378 21.2064 5.47493 21.75 8.85957C21.9143 9.88207 22 10.9306 22 12Z"
              fill="url(#paint1_radial_3598_48)"
            />
            <path
              d="M14.1429 14.5C14.1429 15.0917 13.6629 15.5714 13.0714 15.5714H8.42857C7.24501 15.5714 6.28571 14.6121 6.28571 13.4286V9.5C6.28571 8.90829 6.76571 8.42857 7.35714 8.42857H12C13.1836 8.42857 14.1429 9.38793 14.1429 10.5714V14.5ZM16.8571 9.07136L15.2857 10.2499C15.0157 10.4523 14.8571 10.7699 14.8571 11.1071V12.8928C14.8571 13.2301 15.0157 13.5476 15.2857 13.7499L16.8571 14.9285C17.21 15.1934 17.7143 14.9414 17.7143 14.4999V9.49993C17.7143 9.0585 17.21 8.8065 16.8571 9.07136Z"
              fill="white"
            />
          </g>
          <defs>
            <radialGradient
              id="paint0_radial_3598_48"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(12 10.8379) scale(13.4826 11.2685)"
            >
              <stop offset="0.82" stopColor="#365CFA" stopOpacity="0" />
              <stop offset="0.98" stopColor="#233EAD" />
            </radialGradient>
            <radialGradient
              id="paint1_radial_3598_48"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(12.0003 13.158) scale(13.4781 11.2647)"
            >
              <stop offset="0.8" stopColor="#365CFA" stopOpacity="0" />
              <stop offset="1" stopColor="#80A2ED" />
            </radialGradient>
            <clipPath id="clip0_3598_48">
              <rect width="20" height="20" fill="white" transform="translate(2 2)" />
            </clipPath>
          </defs>
        </svg>
      )

    default:
      return <VoiceSquareIcon />
  }
}

export default MeetingIcon
