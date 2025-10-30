import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-md p-6',
        hover && 'transition-shadow hover:shadow-lg cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;