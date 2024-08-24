export default function HeroGradient({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="691"
      height="691"
      viewBox="0 0 691 691"
      fill="none"
    >
      <g filter="url(#filter0_f_3154_7592)">
        <circle cx="345.5" cy="345.5" r="245.5" fill="#CF70E9" />
      </g>
      <g filter="url(#filter1_f_3154_7592)">
        <circle cx="346" cy="345" r="145" fill="#E9B170" />
      </g>
      <g filter="url(#filter2_f_3154_7592)">
        <path
          d="M341.5 194L363.353 291.714L447.212 238.227L394.257 322.928L491 345L394.257 367.072L447.212 451.773L363.353 398.286L341.5 496L319.647 398.286L235.788 451.773L288.743 367.072L192 345L288.743 322.928L235.788 238.227L319.647 291.714L341.5 194Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_3154_7592"
          x="0"
          y="0"
          width="691"
          height="691"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="50"
            result="effect1_foregroundBlur_3154_7592"
          />
        </filter>
        <filter
          id="filter1_f_3154_7592"
          x="101"
          y="100"
          width="490"
          height="490"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="50"
            result="effect1_foregroundBlur_3154_7592"
          />
        </filter>
        <filter
          id="filter2_f_3154_7592"
          x="147"
          y="149"
          width="389"
          height="392"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="22.5"
            result="effect1_foregroundBlur_3154_7592"
          />
        </filter>
      </defs>
    </svg>
  );
}
