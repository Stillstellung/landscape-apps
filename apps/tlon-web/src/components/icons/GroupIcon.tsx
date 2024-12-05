import React from 'react';

import { IconProps } from './icon';

export default function GroupIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        className="fill-current"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 6c0-1.10457.8954-2 2-2s2 .89543 2 2-.8954 2-2 2-2-.89543-2-2Zm2-4C9.79086 2 8 3.79086 8 6c0 .02335.0002.04665.0006.0699C5.60906 7.45305 4 10.0386 4 13c0 .1765.00572.3517.01698.5254C2.81202 14.2145 2 15.5124 2 17c0 2.2091 1.79086 4 4 4 .91984 0 1.76716-.3105 2.44287-.8324C9.51434 20.7004 10.7222 21 12 21s2.4857-.2996 3.5571-.8324C16.2328 20.6895 17.0802 21 18 21c2.2091 0 4-1.7909 4-4 0-1.4876-.812-2.7855-2.017-3.4746.0113-.1737.017-.3489.017-.5254 0-2.9614-1.6091-5.54695-4.0006-6.9301C15.9998 6.04665 16 6.02335 16 6c0-2.20914-1.7909-4-4-4Zm3.4226 6.07131C14.7214 9.22748 13.4509 10 12 10s-2.72144-.77253-3.42263-1.9287C7.01961 9.15509 6 10.9585 6 13c2.20914 0 4 1.7909 4 4 0 .5459-.10935 1.0662-.30733 1.5403C10.403 18.8365 11.1824 19 12 19c.8176 0 1.597-.1635 2.3073-.4597C14.1093 18.0662 14 17.5459 14 17c0-2.2091 1.7909-4 4-4 0-2.0415-1.0196-3.8449-2.5774-4.92869ZM4 17c0-1.1046.89543-2 2-2s2 .8954 2 2-.89543 2-2 2-2-.8954-2-2Zm14-2c-1.1046 0-2 .8954-2 2s.8954 2 2 2 2-.8954 2-2-.8954-2-2-2Z"
      />
    </svg>
  );
}