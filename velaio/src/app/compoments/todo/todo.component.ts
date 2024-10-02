import { Component, computed, effect, signal } from '@angular/core';
import { FilterType, Person, TodoModel } from '../../models/todo';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';  
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule], 
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent {
  TodoList = signal<TodoModel[]>([]);

  newPersonName = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(5)] });
  newPersonAge = new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(18)] });
  newPersonSkill = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] });
  newSkill = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }); 
  newTodo = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)]
  });

  constructor() {
    effect(() => {
      localStorage.setItem('todos', JSON.stringify(this.TodoList()));
    });
  }

  ngOnInit(): void {
    const storage = localStorage.getItem('todos');
    if (storage) {
      this.TodoList.set(JSON.parse(storage));
    }
  }

  trackById(index: number, todo: TodoModel): number {
    return todo.id;
  }

  todoListFiltered = computed(() => {
    const filter = this.Filter();
    const todos = this.TodoList();

    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  });

  Filter = signal<FilterType>('all');
  changeFilter(FilterString: FilterType) {
    this.Filter.set(FilterString);
  }


  addTodo() {
    const newTaskTitle = this.newTodo.value.trim();
    if (this.newTodo.valid && newTaskTitle !== '') {
      this.TodoList.update((prev_todos) => {
        return [
          ...prev_todos,
          { id: Date.now(), title: newTaskTitle, completed: false },
        ];
      });
      this.newTodo.reset();
    } else {
      this.newTodo.reset();
    }
  }

  toggleTodo(todoId: number) {
    this.TodoList.update((prev_todos) =>
      prev_todos.map((todo) => {
        return todo.id === todoId ? { ...todo, completed: !todo.completed } : todo;
      })
    );
  }

  removeTodo(todoId: number) {
    this.TodoList.update((prev_todos) =>
      prev_todos.filter((todo) => todo.id !== todoId)
    );
  }

  updateTodoEditingModel(todoId: number) {
    return this.TodoList.update((prev_todos) =>
      prev_todos.map((todo) => {
        return todo.id === todoId ? { ...todo, editing: true } : { ...todo, editing: false };
      })
    );
  }

  saveTitleTodo(todoId: number, event: Event) {
    const title = (event.target as HTMLInputElement).value;
    return this.TodoList.update((prev_todos) =>
      prev_todos.map((todo) => {
        return todo.id === todoId ? { ...todo, title: title, editing: false } : todo;
      })
    );
  }

  
  addPersonToTask(taskId: number) {
    if (this.newPersonName.valid && this.newPersonAge.valid && this.newPersonSkill.valid) {
      const newPerson: Person = {
        id: Date.now(),
        fullName: this.newPersonName.value.trim(),
        age: this.newPersonAge.value!,
        skills: [this.newPersonSkill.value.trim()],
      };

      this.TodoList.update(prevTodos =>
        prevTodos.map(todo => todo.id === taskId ? { ...todo, people: [...(todo.people || []), newPerson] } : todo)
      );

      this.newPersonName.reset();
      this.newPersonAge.reset();
      this.newPersonSkill.reset();
    }
  }

  removePersonFromTask(taskId: number, personId: number) {
    this.TodoList.update(prevTodos =>
      prevTodos.map(todo => todo.id === taskId ? { ...todo, people: todo.people?.filter(person => person.id !== personId) } : todo)
    );
  }

  addSkillToPerson(taskId: number, personId: number, skill: string) {
    if (this.newSkill.valid) {
      this.TodoList.update(prevTodos =>
        prevTodos.map(todo => {
          if (todo.id === taskId) {
            const updatedPeople = todo.people?.map(person =>
              person.id === personId ? { ...person, skills: [...person.skills, skill.trim()] } : person
            );
            return { ...todo, people: updatedPeople };
          }
          return todo;
        })
      );
      this.newSkill.reset();
    }
  }

  removeSkillFromPerson(taskId: number, personId: number, skill: string) {
    this.TodoList.update(prevTodos =>
      prevTodos.map(todo => {
        if (todo.id === taskId) {
          const updatedPeople = todo.people?.map(person =>
            person.id === personId ? { ...person, skills: person.skills.filter(s => s !== skill) } : person
          );
          return { ...todo, people: updatedPeople };
        }
        return todo;
      })
    );
  }
}
