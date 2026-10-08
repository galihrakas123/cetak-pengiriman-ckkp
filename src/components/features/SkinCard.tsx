const SkinCard = () => {
  return (
    <>
      <div className="absolute left-[96px] bottom-[43px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="11"
          viewBox="0 0 11 11"
          fill="none"
        >
          <circle
            cx="5.58557"
            cy="5.2"
            r="5"
            transform="rotate(180 5.58557 5.2)"
            fill="#FFD026"
          />
        </svg>
      </div>

      {/* Star */}
      <div className="absolute right-[500px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
        >
          <path
            opacity="0.5"
            d="M16 0L16.9051 15.0949L32 16L16.9051 16.9051L16 32L15.0949 16.9051L0 16L15.0949 15.0949L16 0Z"
            fill="#D9D9D9"
          />
        </svg>
      </div>
      <div className="absolute left-0 bottom-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="352"
          height="104"
          viewBox="0 0 352 104"
          fill="none"
        >
          <path
            d="M343 104L265.615 49.9746C233.641 27.6525 190.583 29.9369 161.15 55.5169V55.5169C129.158 83.3221 81.5735 83.3221 49.5808 55.5169L-0.489809 12"
            stroke="url(#paint0_linear_4638_1131)"
            strokeWidth="30"
          />
          <defs>
            <linearGradient
              id="paint0_linear_4638_1131"
              x1="-25.3766"
              y1="43.28"
              x2="265.514"
              y2="112.984"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#EEEEEE" />
              <stop offset="1" stopColor="#E6F6EC" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute right-10 top-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="221"
          height="111"
          viewBox="0 0 221 111"
          fill="none"
        >
          <circle cx="177" cy="5" r="5" fill="#1E88E5" />
          <path
            d="M221 111.5C221 96.9889 218.142 82.62 212.589 69.2135C207.036 55.807 198.896 43.6256 188.635 33.3647C178.374 23.1038 166.193 14.9645 152.787 9.41131C139.38 3.85817 125.011 0.999999 110.5 1C95.9889 1 81.6199 3.85817 68.2135 9.41131C54.807 14.9645 42.6256 23.1038 32.3647 33.3647C22.1038 43.6256 13.9645 55.807 8.41131 69.2135C2.85816 82.62 -1.2686e-06 96.9889 0 111.5H55.25C55.25 104.244 56.6791 97.06 59.4557 90.3567C62.2322 83.6535 66.3019 77.5628 71.4324 72.4324C76.5628 67.3019 82.6535 63.2322 89.3567 60.4557C96.06 57.6791 103.244 56.25 110.5 56.25C117.756 56.25 124.94 57.6791 131.643 60.4557C138.346 63.2322 144.437 67.3019 149.568 72.4324C154.698 77.5628 158.768 83.6535 161.544 90.3567C164.321 97.06 165.75 104.244 165.75 111.5H221Z"
            fill="url(#paint0_linear_4638_1132)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_4638_1132"
              x1="221"
              y1="106.5"
              x2="4.00001"
              y2="106.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#EEEEEE" />
              <stop offset="1" stopColor="#E6F6EC" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  );
};

export default SkinCard;
