"use client";

import { ITodo } from "@/types";
import { formatDate } from "@/helpers";
import { FaChevronRight, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import Link from "next/link";
import { match } from "ts-pattern";
import { FC } from "react";

export const Todo: FC<ITodo> = ({ id, name, completed, deadline }) => {
  return (
    <Link href={`/todo/${id}`} passHref>
      <div className="w-full bg-white px-4 py-4 flex flex-row justify-between items-center my-2">
        <div className="flex flex-col items-start flex-grow">
          <div className="flex flex-row items-center">
            <p className="text-lg text-black font-medium">{name}</p>
            <p>
              {match(completed)
                .with(true, () => (
                  <FaCheckCircle className="text-green-500 ml-2" />
                ))
                .with(false, () => (
                  <FaInfoCircle className="text-yellow-500 ml-2" />
                ))
                .otherwise(() => null)}
            </p>
          </div>
          <p className="text-sm text-gray-500">{formatDate(deadline)}</p>
        </div>
        <FaChevronRight color="black" />
      </div>
    </Link>
  );
};
