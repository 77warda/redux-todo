import { Component } from '@angular/core';
// import { Todo } from '../redux/todo.service';
import {
  ADDTODO,
  CLEARCOMPLETED,
  DELETETODO,
  FILTERDATA,
  MARKCOMPLETED,
  UPDATETODO,
} from '../redux/actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TodoData } from '../redux/reducer';
import { Store } from '@ngrx/store';
import {
  selectAllTodos,
  incompleteTodosLength,
  selectFilteredTodos,
} from '../redux/state';

@Component({
  selector: 'app-todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.scss'],
})
export class TodoAppComponent {
  allTodos$: Observable<TodoData[]>;
  incompleteTodosLength$: Observable<number>;
  activeFilter: 'all' | 'active' | 'completed' = 'all';

  constructor(private fb: FormBuilder, private store: Store) {
    // this.allTodos$ = this.store.select(selectAllTodos);
    this.allTodos$ = this.store.select(selectFilteredTodos);
    this.incompleteTodosLength$ = this.store.select(incompleteTodosLength);
  }

  todoForm: FormGroup;
  updateTodo: number | null = null;

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  onSubmit() {
    console.log(this.todoForm.value);
    if (this.updateTodo !== null) {
      const updatedTodo: TodoData = {
        id: this.updateTodo,
        name: this.todoForm.value.name,
        completed: false,
      };

      this.store.dispatch(
        UPDATETODO({ id: this.updateTodo, todo: updatedTodo })
      );
      this.updateTodo = null;
    } else {
      const todo: any = {
        name: this.todoForm.value.name,
        completed: false,
      };
      console.log(todo);
      this.store.dispatch(ADDTODO({ todo }));
    }
    this.todoForm.reset();
  }
  deleteTodo(id: number): void {
    // this.todo.dispatch(DELETETODO(todoId));
    this.store.dispatch(DELETETODO({ id }));
  }
  markAsComplete(id: number) {
    // this.todo.dispatch(MARKCOMPLETED(todoId));
    this.store.dispatch(MARKCOMPLETED({ id }));
  }
  updateTodoText(todoId: number, todoText: string) {
    this.updateTodo = todoId;
    this.todoForm.setValue({ name: todoText });
  }
  clearCompleted() {
    this.store.dispatch(CLEARCOMPLETED());
  }
  setFilter(filter: 'all' | 'active' | 'completed'): void {
    this.activeFilter = filter;
    this.store.dispatch(FILTERDATA({ filter }));
  }
}
