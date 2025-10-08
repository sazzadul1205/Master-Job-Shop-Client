const Loading = () => {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 via-indigo-600 to-indigo-800 text-white">
      {/* SVG Loader */}
      <svg
        viewBox="0 0 100 100"
        className="w-[120px] h-[120px] drop-shadow-lg mb-6"
      >
        <g
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="6"
        >
          <path d="M 21 40 V 59">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              values="0 21 59; 180 21 59"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M 79 40 V 59">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              values="0 79 59; -180 79 59"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M 50 21 V 40">
            <animate
              attributeName="d"
              values="M 50 21 V 40; M 50 59 V 40"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M 50 60 V 79">
            <animate
              attributeName="d"
              values="M 50 60 V 79; M 50 98 V 79"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M 50 21 L 79 40 L 50 60 L 21 40 Z">
            <animate
              attributeName="stroke"
              values="rgba(255,255,255,1); rgba(150,150,150,0.2)"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M 50 40 L 79 59 L 50 79 L 21 59 Z" />
          <path d="M 50 59 L 79 78 L 50 98 L 21 78 Z">
            <animate
              attributeName="stroke"
              values="rgba(150,150,150,0.2); rgba(255,255,255,1)"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            values="0 0; 0 -19"
            dur="2s"
            repeatCount="indefinite"
          />
        </g>
      </svg>

      {/* Text Feedback */}
      <h2 className="text-2xl font-semibold tracking-wide mb-2">Loading...</h2>
      <p className="text-sm text-blue-100 opacity-80">
        Please wait while we prepare everything for you.
      </p>
    </div>
  );
};

export default Loading;
