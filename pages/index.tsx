import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import { Todo, Tab, Modal, Loader, Input } from "@/components";
import { IList, ITodo } from "@/types";
import { match } from "ts-pattern";
import * as y from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const API_URL = process.env.NEXT_PUBLIC_MOCK_API;

const todoSchema = y.object({
  name: y.string().required("Name is required"),
  text: y.string().required("Text is required"),
  deadline: y.string().required("Deadline is required"),
  time: y.string().required("Time is required"),
});

const listSchema = y.object({
  name: y.string().required(),
});

type IListInputs = {
  name: string;
};

type ITodoInputs = {
  name: string;
  text: string;
  deadline: string;
  time: string;
};

enum TabFilter {
  All = "all",
  Completed = "completed",
  Incompleted = "incompleted",
}

export default function Home() {
  const queryClient = useQueryClient();
  const [lists, setLists] = useState<IList[]>([]);
  const [activeList, setActiveList] = useState<IList | null>(null);
  const [activeTab, setActiveTab] = useState<string>(TabFilter.All);
  const [textFilter, setTextFilter] = useState<{
    text: string;
    list: IList | null;
  }>({ text: "", list: null });

  const queryTodoLists = useQuery({
    queryKey: ["todo_lists"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/todo_lists`);
      return response.data;
    },
  });

  const queryTodos = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/todos`);
      return response.data;
    },
  });

  const listsData = queryTodoLists.data;
  const todosData = queryTodos.data;

  const {
    register: registerList,
    handleSubmit: handleSubmitList,
    reset: resetList,
    formState: { errors: listErrors },
  } = useForm<IListInputs>({
    resolver: yupResolver(listSchema),
  });

  const {
    register: registerTodo,
    handleSubmit: handleSubmitTodo,
    reset: resetTodo,
    formState: { errors: todoErrors },
  } = useForm<ITodoInputs>({
    resolver: yupResolver(todoSchema),
  });

  const onSubmitList: SubmitHandler<IListInputs> = async (data) => {
    await axios.post(`${API_URL}/todo_lists`, { list_name: data.name });
    queryClient.invalidateQueries({
      queryKey: ["todo_lists"],
    });
    resetList();
    (document.getElementById("my_modal_2") as HTMLDialogElement).close();
  };

  const onSubmitTodo: SubmitHandler<ITodoInputs> = async (data) => {
    const combinedDatetimeStr = `${data.deadline}T${data.time}:00`;
    await axios.post(`${API_URL}/todos`, {
      list_id: activeList?.list_id,
      name: data.name,
      text: data.text,
      deadline: String(new Date(combinedDatetimeStr).getTime() / 1000),
      completed: false,
    });
    queryClient.invalidateQueries({
      queryKey: ["todos"],
    });
    resetTodo();
    (document.getElementById("my_modal_3") as HTMLDialogElement).close();
  };

  useEffect(() => {
    if (listsData && todosData) {
      setLists(() => {
        return listsData.map((list: IList) => {
          return {
            ...list,
            todos: todosData.filter(
              (todo: ITodo) => todo.list_id === list.list_id,
            ),
          };
        });
      });
    }
  }, [listsData, todosData]);

  if (queryTodoLists.isLoading || queryTodos.isLoading) {
    return <Loader />;
  }

  if (queryTodoLists.error || queryTodos.error) {
    return;
  }

  return (
    <div className="flex justify-center">
      <div className="mx-auto">
        <h2 className="text-4xl text-center font-bold my-16">
          Your Todo Lists
        </h2>
        <div className="mb-10 flex items-center w-full justify-center">
          <Tab
            filter="All"
            onClick={() => setActiveTab(TabFilter.All)}
            active={activeTab === TabFilter.All}
          />
          <Tab
            filter="Incompleted"
            onClick={() => setActiveTab(TabFilter.Incompleted)}
            active={activeTab === TabFilter.Incompleted}
          />
          <Tab
            filter="Completed"
            onClick={() => setActiveTab(TabFilter.Completed)}
            active={activeTab === TabFilter.Completed}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 gap-y-10">
          {lists?.map((list: IList) => (
            <div
              key={list.list_id}
              className="border-2 rounded-md px-4 flex flex-col"
            >
              <div className="bg-white px-4 w-96 rounded-md py-5">
                <h3 className="text-xl text-black text-center">
                  {list.list_name}
                </h3>
              </div>
              <div className="flex justify-center text-white">
                <button
                  className="btn btn-success text-white"
                  onClick={() => {
                    setActiveList(list);
                    (
                      document.getElementById("my_modal_3") as HTMLDialogElement
                    ).showModal();
                  }}
                >
                  Add Todo
                </button>
              </div>
              <ul className="mt-4 min-h-24">
                {list.todos
                  .filter((todo) => {
                    const matchesFilter = match(activeTab)
                      .with(TabFilter.All, () => true)
                      .with(TabFilter.Incompleted, () => !todo.completed)
                      .with(TabFilter.Completed, () => todo.completed)
                      .run();

                    return matchesFilter;
                  })
                  .filter((todo) => {
                    if (textFilter.list?.list_id !== list.list_id) {
                      return true;
                    }

                    const matchesTextFilter = todo.name
                      .toLowerCase()
                      .trim()
                      .includes(textFilter.text.toLowerCase().trim());
                    return matchesTextFilter;
                  })
                  .map((todo) => (
                    <Todo key={todo.id} {...todo} />
                  ))}
              </ul>
              <input
                type="text"
                className="input input-bordered bg-white w-full mx-auto mb-4 mt-auto"
                placeholder="Search Todo"
                onChange={(e) => setTextFilter({ text: e.target.value, list })}
              />
            </div>
          ))}
        </div>
        <Modal
          id="my_modal_2"
          title="Add New List"
          onSubmit={handleSubmitList(onSubmitList)}
        >
          <Input
            placeholder="New List Name"
            register={registerList("name", { required: true })}
            error={listErrors.name}
          />
        </Modal>
        <Modal
          id="my_modal_3"
          title={`Add New Todo to ${activeList?.list_name}`}
          onSubmit={handleSubmitTodo(onSubmitTodo)}
        >
          <Input
            placeholder="Todo Name"
            register={registerTodo("name", { required: true })}
            error={todoErrors.name}
          />
          <Input
            placeholder="Todo Text"
            register={registerTodo("text", { required: true })}
            error={todoErrors.text}
            textarea
          />
          <div className="w-full flex flex-row items-center">
            <Input
              type="date"
              register={registerTodo("deadline", { required: true })}
              error={todoErrors.deadline}
            />
            <Input
              type="time"
              register={registerTodo("time", { required: true })}
              error={todoErrors.time}
            />
          </div>
        </Modal>
        <div className="flex justify-center my-10">
          <button
            className="btn btn-success text-white"
            onClick={() =>
              (
                document.getElementById("my_modal_2") as HTMLDialogElement
              ).showModal()
            }
          >
            Add List
          </button>
        </div>
      </div>
    </div>
  );
}
