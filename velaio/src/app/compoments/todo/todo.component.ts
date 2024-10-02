import { Component, signal } from '@angular/core';
import { FilterType, TodoModel } from '../../models/todo';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent {
  TodoList = signal<TodoModel[]>([])
  Filter = signal<FilterType>('all')
  changeFilter(FilterString: FilterType){
      this.Filter.set(FilterString)
  }
}
