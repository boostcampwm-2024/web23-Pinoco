import React, { ButtonHTMLAttributes } from 'react';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonText?: string;
}
function Button({ onClick, className, buttonText, ...props }: ButtonProps) {
  return (
    <button
      className={`w-[400px] h-14 rounded ${className} transition transform active:bg-grayscale-100`}
      onClick={onClick}
      {...props}
    >
      {buttonText}
    </button>
  );
}
export default Button;
