"use client";

import { match } from "ts-pattern";

interface IInputProps {
  placeholder?: string;
  error: any;
  register: any;
  type?: string;
  textarea?: boolean;
}

export const Input = ({
  placeholder,
  error,
  register,
  type,
  textarea = false,
}: IInputProps) => {
  const properties = {
    type: type || "text",
    className: "input input-bordered bg-white w-full",
    placeholder: placeholder,
    ...register,
  };
  return (
    <div className="w-full mb-4">
      {match(textarea)
        .with(true, () => (
          <textarea
            {...properties} 
          />
        ))
        .with(false, () => (
          <input
            {...properties} 
          />
        ))
        .otherwise(() => null)}

      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
};
