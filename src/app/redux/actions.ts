export interface Action {
  type: string;
  payload?: { [key: string]: any };
}

export const ADDTODO = { type: 'ADDTODO' };
export const UPDATETODO = { type: 'UPDATETODO' };
export const DELETETODO = { type: 'DELETETODO' };
