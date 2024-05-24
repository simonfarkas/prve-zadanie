"use client";
import { FC } from "react";

interface ITabProps {
  filter: string;
  active: boolean;
  onClick: () => void;
}

export const Tab: FC<ITabProps> = ({ filter, onClick, active }) => {
  return (
    <button
      className={`w-32 text-black btn ${active ? "btn-info" : "btn-ghost"}`}
      onClick={onClick}
    >
      {filter}
    </button>
  );
};
