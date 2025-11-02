import React from 'react';
import logo from '/assets/Logo.png'; // ✅ adjust the path to your image

const Logo = ({ size = 'md', showText = true }) => {
  const sizes = {
    sm: { img: 24, text: 'text-lg' },
    md: { img: 40, text: 'text-xl' },
    lg: { img: 56, text: 'text-2xl' },
  };

  return (
    <div className="flex items-center gap-2">
      <img
        src={logo}
        alt="Logo"
        className="rounded-full"
        width={sizes[size].img}
        height={sizes[size].img}
      />
      {showText && (
        <span
          className={`${sizes[size].text} font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text`}
        >
            MindMirror
        </span>
      )}
    </div>
  );
};

export default Logo;
