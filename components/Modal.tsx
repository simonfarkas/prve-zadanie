'use client'

import { FC, ReactNode } from "react";

interface IModal {
  id: string;
  title: string;
  onSubmit: any;
  children: ReactNode;
}

export const Modal: FC<IModal> = ({ id, title, onSubmit, children }) => {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box bg-white">
        <h2 className="text-2xl mb-10 font-bold">{title}</h2>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col items-center">
            {children}
            <div className="flex items-center justify-between w-full">
              <button type="submit" className="btn btn-success text-white">
                {title}
              </button>
              <button
                className="btn btn-error text-white"
                onClick={() =>
                  (document.getElementById(id) as HTMLDialogElement).close()
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
};
