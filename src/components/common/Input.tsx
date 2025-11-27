import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<Props> = (props) => {
  return <input {...props} className={`border p-2 rounded ${props.className || ""}`} />;
};

export default Input;
