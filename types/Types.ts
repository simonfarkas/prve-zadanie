export interface IList {
  list_id: string;
  list_name: string;
  todos: ITodo[];
}

export interface ITodo {
  id: string;
  list_id: string;
  name: string;
  text: string;
  deadline: string;
  completed: boolean;
}
