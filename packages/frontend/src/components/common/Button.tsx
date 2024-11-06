import React from 'react';
interface ButtonProps {
  onClick?: () => void;
  className?: string;
  buttonText?: string;
}
function Button({ onClick, className, buttonText }: ButtonProps) {
  return (
    <button
      className={`w-[400px] h-14 rounded ${className} transition transform active:bg-grayscale-100`}
      onClick={onClick}
    >
      {buttonText}
    </button>
  );
}
export default Button;
