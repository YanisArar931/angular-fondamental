import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.components';
// import { TodoListComponent } from './features/todos/components/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  // template: `
  //   <app-header></app-header>
  //   <main class="container mx-auto p-4">
  //     <app-todo-list></app-todo-list>
  //     <router-outlet></router-outlet>
  //   </main>
  // `,
  templateUrl: './app.html',
  styles: [],
})
export class AppComponent {
  title = 'todo-list-app';
}
