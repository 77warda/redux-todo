export interface Action {
  type: string;
  payload?: { [key: string]: any };
}

export const ADDTODO = (todo: string): Action => ({
  type: 'ADDTODO',
  payload: { todo },
});

export const DELETETODO = (id: number): Action => ({
  type: 'DELETETODO',
  payload: { id },
});

export const MARKCOMPLETED = (id: number): Action => ({
  type: 'MARKCOMPLETED',
  payload: { id },
});
export const UPDATETODO = (id: number, todo: string): Action => ({
  type: 'UPDATETODO',
  payload: { id, todo },
});
