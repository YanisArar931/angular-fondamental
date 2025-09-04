import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.components';
import { PwaPromptComponent } from './shared/components/pwa-prompt/pwa-prompt.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, PwaPromptComponent],
  templateUrl: './app.html',
  styles: [],
})
export class App {
  title = 'todo-list-app';
}
