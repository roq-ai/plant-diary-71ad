import { Icon, IconProps } from '@chakra-ui/react';

export const LightBulbIcon = ({ bg, color, ...props }: IconProps & { bg: string; color: string }) => (
  <Icon width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clip-path="url(#clip0_3058_7521)">
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 19C11.17 19 10.5 18.33 10.5 17.5H13.5C13.5 18.33 12.83 19 12 19ZM15 16.5H9V15H15V16.5ZM14.97 14H9.03C7.8 13.09 7 11.64 7 10C7 7.24 9.24 5 12 5C14.76 5 17 7.24 17 10C17 11.64 16.2 13.09 14.97 14Z"
        fill="white"
        fill-opacity="0.92"
      />
    </g>
    <defs>
      <clipPath id="clip0_3058_7521">
        <rect width="24" height="24" fill="currentColor" />
      </clipPath>
    </defs>
  </Icon>
);
