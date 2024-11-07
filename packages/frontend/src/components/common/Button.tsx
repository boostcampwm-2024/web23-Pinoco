import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonText?: string;
}

function Button({ onClick, className, buttonText, ...props }: ButtonProps) {
  return (
    <button
      className={`w-full min-h-16 rounded-md ${className} transition-all active:bg-grayscale-200`}
      onClick={onClick}
      {...props}
    >
      {buttonText}
    </button>
  );
}
export default Button;
