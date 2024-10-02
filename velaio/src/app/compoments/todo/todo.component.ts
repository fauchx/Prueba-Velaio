import { Component, computed, effect, signal } from '@angular/core';
import { FilterType, TodoModel } from '../../models/todo';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent {
  TodoList = signal<TodoModel[]>([
    
  ])

  constructor(){
    effect(()=>{
      localStorage.setItem('todos', JSON.stringify(this.TodoList()))
    })
  }
  ngOnInit(): void{
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const storage = localStorage.getItem('todos')
    if(storage){
      this.TodoList.set(JSON.parse(storage))
    }
  }

  todoListFiltered = computed(()=>{
    const filter = this.Filter()
    const todos = this.TodoList()

    switch(filter){
      case 'active':
        return todos.filter((todo) => !todo.completed)
      case 'completed':
        return todos.filter((todo)=> todo.completed)
      default:
        return todos
    }
  })
  Filter = signal<FilterType>('all')
  changeFilter(FilterString: FilterType){
      this.Filter.set(FilterString)
  }
  newTodo = new FormControl('',{
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)]
  })
  addTodo(){
    const newTaskTitle = this.newTodo.value.trim();
    if(this.newTodo.valid && newTaskTitle !== ''){
      this.TodoList.update((prev_todos)=>{
        return[
          ...prev_todos,
          {id: Date.now(), title: newTaskTitle, completed:false},
        ];
        
      });
      this.newTodo.reset();
    }else{
      this.newTodo.reset();
    }
  }
  toggleTodo(todoId: number){
    this.TodoList.update((prev_todos)=>prev_todos.map((todo)=>{
      return todo.id === todoId ? {...todo, completed: !todo.completed} : todo
    }))
  }
  removeTodo(todoId: number){
    this.TodoList.update((prev_todos)=>
      prev_todos.filter((todo) => todo.id !== todoId)
    )
  }
  updateTodoEditingModel(todoId: number){
    return this.TodoList.update((prev_todos)=>prev_todos.map((todo)=>{
      return todo.id === todoId ? {...todo, editing:true}:{...todo, editing:false}
    }))
  }
  saveTitleTodo(todoId:number, event: Event){
    const title = (event.target as HTMLInputElement).value
    return this.TodoList.update((prev_todos)=>prev_todos.map((todo)=>{
      return todo.id === todoId ? {...todo, title:title, editing:false} : todo
    }))
  }
}