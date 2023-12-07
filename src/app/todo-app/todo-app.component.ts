import { Component } from '@angular/core';
import { Todo } from '../redux/todo.service';
import {
  ADDTODO,
  Action,
  CLEARCOMPLETED,
  DELETETODO,
  MARKCOMPLETED,
  UPDATETODO,
} from '../redux/actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.scss'],
})
export class TodoAppComponent {
  get allTodos() {
    return this.todo.select('todos');
  }

  constructor(private fb: FormBuilder, private todo: Todo) {}

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
      const editTodoAction: Action = UPDATETODO(
        this.updateTodo,
        this.todoForm.value.name
      );
      this.todo.dispatch(editTodoAction);
      this.updateTodo = null;
    } else {
      this.todo.dispatch(ADDTODO(this.todoForm.value.name));
    }
    this.todoForm.reset();
  }
  deleteTodo(todoId: number): void {
    this.todo.dispatch(DELETETODO(todoId));
  }
  markAsComplete(todoId: number): void {
    this.todo.dispatch(MARKCOMPLETED(todoId));
  }
  updateTodoText(todoId: number, todoText: string) {
    this.updateTodo = todoId;
    this.todoForm.setValue({ name: todoText });
  }
  clearCompleted() {
    this.todo.dispatch(CLEARCOMPLETED());
    console.log('warda', this.todo.dispatch(CLEARCOMPLETED()));
  }
}
