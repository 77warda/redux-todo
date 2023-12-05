import { Component } from '@angular/core';
import { Todo } from '../redux/todo.service';
import { ADDTODO } from '../redux/actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoData } from '../redux/reducer';

@Component({
  selector: 'app-todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.scss'],
})
export class TodoAppComponent {
  get todoData() {
    return this.todo.select('todoData');
  }

  todos: TodoData[] = [
    { id: 1, todo: 'First', completed: true },
    { id: 2, todo: 'Second', completed: false },
    { id: 3, todo: 'Third', completed: false },
    { id: 4, todo: 'Fourth', completed: true },
  ];
  constructor(private fb: FormBuilder, private todo: Todo) {}

  todoForm: FormGroup;
  ngOnInit(): void {
    this.todoForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  onSubmit() {
    console.log(this.todoForm.value);
    this.todo.dispatch({
      type: ADDTODO.type,
      payload: { todo: this.todoForm.value.name },
    });
    this.todoForm.reset();
  }
}
