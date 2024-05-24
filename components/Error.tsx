"use client";

import { FC } from "react";

interface IError {
  error?: string;
}

export const ErrorMessage: FC<IError> = ({ error }) => {
  return (
    <div
      className="
        fixed top-0 left-0 w-full h-full 
        flex items-center justify-center
        bg-white bg-opacity-80 z-50 
      "
    >
      <p className="text-red-500">
        {error ? error : "An error occurred. Please try again later."}
      </p>
    </div>
  );
};
