import { Injectable } from '@angular/core';
import { initialState, State, reducer } from './reducer';
import { Action } from './actions';

const win = window as any;

/**
 * Simple State Management using Redux WITHOUT reactivity
 */
@Injectable({
  providedIn: 'root',
})
export class Todo {
  private state: State = initialState;

  /**
   * Ignore the constructor code
   * @ignore Redux Dev Tools setup
   */
  constructor() {
    // Redux Dev Tools
    if (win.__REDUX_DEVTOOLS_EXTENSION__) {
      win.devTools = win.__REDUX_DEVTOOLS_EXTENSION__.connect();
      // Set Initial State for Redux DevTools
      win.devTools.init(this.state);
      // Time Travel Debugging
      win.devTools.subscribe((message) => {
        if (
          message.type === 'DISPATCH' &&
          message.payload.type === 'JUMP_TO_ACTION'
        ) {
          this.state = JSON.parse(message.state);
        }

        if (message.type === 'ACTION') {
          this.dispatch({ type: message.payload });
        }
      });
    }
  }

  dispatch(action: Action) {
    this.state = reducer(this.state, action);

    /**
     * @ignore Send action, state info to Redux Dev Tools
     */
    win.devTools?.send(action, this.state);
  }

  select(path: string) {
    if (this.state[path] !== undefined) {
      return this.state[path];
    } else {
      return null;
    }
  }
}
