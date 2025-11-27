import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode };

const Button: React.FC<Props> = ({ children, ...rest }) => {
  return (
    <button {...rest} className={`px-4 py-2 rounded ${rest.className || ""}`}>
      {children}
    </button>
  );
};

export default Button;
