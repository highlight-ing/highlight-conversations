export interface IconPropTypes {
    color?: string
    size?: number | string
    width?: number
    height?: number
    onClick?: (event: MouseEvent) => void
  }
  
export const ConversationsIcon = ({ width = 32, height = 32, color = '#4D8C6E' }: IconPropTypes) => (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_conversations)">
        <rect width={width} height={height} rx={width / 6} fill="#A2A6A7" />
        <rect width={width} height={height} rx={width / 3.6} fill="white" />
        <rect width={width} height={height} rx={width / 3.6} fill="url(#paint0_linear_conversations)" fillOpacity="0.2" />
        <path
          d={`M${width * 0.258} ${height * 0.303}C${width * 0.258} ${height * 0.275} ${width * 0.285} ${height * 0.252} ${width * 0.306} ${height * 0.252}C${width * 0.327} ${height * 0.252} ${width * 0.354} ${height * 0.275} ${width * 0.354} ${height * 0.303}V${height * 0.697}C${width * 0.354} ${height * 0.725} ${width * 0.327} ${height * 0.748} ${width * 0.306} ${height * 0.748}C${width * 0.285} ${height * 0.748} ${width * 0.258} ${height * 0.725} ${width * 0.258} ${height * 0.697}V${height * 0.303}Z`}
          fill={color}
        />
        <path
          d={`M${width * 0.642} ${height * 0.303}C${width * 0.642} ${height * 0.275} ${width * 0.669} ${height * 0.252} ${width * 0.69} ${height * 0.252}C${width * 0.711} ${height * 0.252} ${width * 0.738} ${height * 0.275} ${width * 0.738} ${height * 0.303}V${height * 0.697}C${width * 0.738} ${height * 0.725} ${width * 0.711} ${height * 0.748} ${width * 0.69} ${height * 0.748}C${width * 0.669} ${height * 0.748} ${width * 0.642} ${height * 0.725} ${width * 0.642} ${height * 0.697}V${height * 0.303}Z`}
          fill={color}
        />
        <path
          d={`M${width * 0.621} ${height * 0.5}C${width * 0.621} ${height * 0.567} ${width * 0.567} ${height * 0.622} ${width * 0.5} ${height * 0.622}C${width * 0.433} ${height * 0.622} ${width * 0.379} ${height * 0.567} ${width * 0.379} ${height * 0.5}C${width * 0.379} ${height * 0.433} ${width * 0.433} ${height * 0.378} ${width * 0.5} ${height * 0.378}C${width * 0.567} ${height * 0.378} ${width * 0.621} ${height * 0.433} ${width * 0.621} ${height * 0.5}Z`}
          fill={color}
        />
        <path
          d={`M${width * 0.125} ${height * 0.429}C${width * 0.125} ${height * 0.401} ${width * 0.148} ${height * 0.378} ${width * 0.175} ${height * 0.378}C${width * 0.202} ${height * 0.378} ${width * 0.225} ${height * 0.401} ${width * 0.225} ${height * 0.429}V${height * 0.571}C${width * 0.225} ${height * 0.599} ${width * 0.202} ${height * 0.622} ${width * 0.175} ${height * 0.622}C${width * 0.148} ${height * 0.622} ${width * 0.125} ${height * 0.599} ${width * 0.125} ${height * 0.571}L${width * 0.125} ${height * 0.429}Z`}
          fill={color}
        />
        <path
          d={`M${width * 0.775} ${height * 0.429}C${width * 0.775} ${height * 0.401} ${width * 0.798} ${height * 0.378} ${width * 0.825} ${height * 0.378}C${width * 0.852} ${height * 0.378} ${width * 0.875} ${height * 0.401} ${width * 0.875} ${height * 0.429}V${height * 0.571}C${width * 0.875} ${height * 0.599} ${width * 0.852} ${height * 0.622} ${width * 0.825} ${height * 0.622}C${width * 0.798} ${height * 0.622} ${width * 0.775} ${height * 0.599} ${width * 0.775} ${height * 0.571}V${height * 0.429}Z`}
          fill={color}
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_conversations"
          x1={width / 2}
          y1="0"
          x2={width / 2}
          y2={height}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#AFAFAF" stopOpacity="0.5" />
          <stop offset="1" />
        </linearGradient>
        <clipPath id="clip0_conversations">
          <rect width={width} height={height} rx={width / 3.6} fill="white" />
        </clipPath>
      </defs>
    </svg>
  )