import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { TodoComponent } from './compoments/todo/todo.component';

export const routes: Routes = [
    {path: 'todo', component: TodoComponent},
    {path: '**', pathMatch:'full', redirectTo:'todo'}
];
