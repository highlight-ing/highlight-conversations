import React from 'react';
import { Icon, IconProps } from '../Icon'

const SaveIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M9 11V17L11 15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
	<path d="M9 17L7 15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
	<path d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
	<path d="M22 10H18C15 10 14 9 14 6V2L22 10Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
  </Icon>
);

export default SaveIcon
