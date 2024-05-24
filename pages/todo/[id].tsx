import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { formatDate } from "@/helpers";
import { FaRegTrashAlt } from "react-icons/fa";
import { match } from "ts-pattern";
import { Loader, ErrorMessage } from "@/components"

const API_URL = process.env.NEXT_PUBLIC_MOCK_API; 

export default function Todo() {
  const { query, push } = useRouter();
  const queryClient = useQueryClient();

  const {
    data: todo,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["todo", query.id],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/todos/${query.id}`);
      return response.data;
    }
  });

  const deleteTodoMutation = useMutation({
    mutationFn: () => axios.delete(`${API_URL}/todos/${query.id}`),
    onSuccess: () => {
      push("/");
    },
  });

  const markAsCompletedMutation = useMutation({
    mutationFn: () =>
      axios.put(`${API_URL}/todos/${query.id}`, {
        completed: !todo?.completed,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo", query.id] });
    },
  });

  if (isLoading) return <Loader /> 
  if (error) return <ErrorMessage /> 
  if (!todo) return <ErrorMessage error="Todo not found" /> 

  return (
    <div className="flex flex-col items-center min-h-screen py-2">
      <div className="w-full flex justify-between items-start px-4 py-2">
        <button className="text-black text-3xl font-light">
          <a href="/">{"<"}</a>
        </button>
      </div>
      <h2 className="text-4xl font-bold mb-6">Todo Detail</h2>
      <div className="flex flex-col items-center justify-center flex-grow w-1/4">
        <div className="w-full p-8 bg-white shadow-lg rounded-lg">
          <div className="mb-4">
            <div className="flex flex-row justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold">{todo.name}</h3>
              <button
                className="btn btn-error"
                onClick={() => deleteTodoMutation.mutate()}
              >
                <FaRegTrashAlt color="white" />
              </button>
            </div>
            <p className="text-gray-600">{todo.text}</p>
          </div>
          <div className="mb-4">
            <span
              className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${match(
                todo.completed,
              )
                .with(true, () => "bg-green-200 text-green-800")
                .with(false, () => "bg-red-200 text-red-800")
                .otherwise(() => null)}`}
            >
              {match(todo.completed)
                .with(true, () => "Completed")
                .with(false, () => "Incomplete")
                .otherwise(() => null)}
            </span>
          </div>
          <div className="flex flex-row items-center justify-between">
            <p className="text-gray-600">
              <strong>Deadline:</strong> {formatDate(todo.deadline)}
            </p>
            <button
              className={`btn text-white ${match(todo.completed)
                .with(true, () => "btn-error")
                .with(false, () => "btn-success")
                .otherwise(() => "btn-info")} `}
              onClick={() => markAsCompletedMutation.mutate()}
            >
              {match(todo.completed)
                .with(true, () => "Mark as Incomplete")
                .with(false, () => "Mark as Completed")
                .otherwise(() => null)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
