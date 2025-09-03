import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../models/todo.model';
import { TodoService } from '../services/todo.service';
import { PriorityPipe } from '../../../shared/pipes/priority.pipe';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PriorityPipe, HighlightDirective],
  template: ` <!-- Dashboard des statistiques -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Statistiques en temps réel</h2>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Total</h3>
          <p class="text-2xl font-bold text-gray-900">{{ todoService.todoStats().total }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Terminé</h3>
          <p class="text-2xl font-bold text-green-600">{{ todoService.todoStats().completed }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">En cours</h3>
          <p class="text-2xl font-bold text-blue-600">{{ todoService.todoStats().inProgress }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Priorité haute</h3>
          <p class="text-2xl font-bold text-red-600">{{ todoService.todoStats().highPriority }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Taux de complétion</h3>
          <p class="text-2xl font-bold text-purple-600">
            {{ todoService.todoStats().completionRate | number: '1.0-0' }}%
          </p>
        </div>
      </div>
    </div>

    <div class="w-screen h-screen p-6 bg-gray-50">
      <h2 class="text-3xl font-bold mb-6">Mes Todos</h2>

      <!-- Loading state -->
      @if (loading()) {
        <div class="text-center py-8">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          ></div>
          <p class="mt-2 text-gray-600">Chargement des todos...</p>
        </div>
      } @else {
        <!-- Formulaire d'ajout -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-xl font-semibold mb-4">Ajouter une tâche</h3>
          <form (ngSubmit)="addTodo()" #todoForm="ngForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                [(ngModel)]="newTodo.title"
                name="title"
                placeholder="Titre de la tâche"
                class="border p-2 rounded"
                required
              />

              <input
                type="text"
                [(ngModel)]="newTodo.description"
                name="description"
                placeholder="Description (optionnel)"
                class="border p-2 rounded"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select [(ngModel)]="newTodo.priority" name="priority" class="border p-2 rounded">
                <option value="low">Basse priorité</option>
                <option value="medium">Priorité moyenne</option>
                <option value="high">Haute priorité</option>
              </select>

              <button
                type="submit"
                [disabled]="!todoForm.form.valid || addingTodo()"
                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                @if (addingTodo()) {
                  <span
                    class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                  ></span>
                  Ajout en cours...
                } @else {
                  Ajouter
                }
              </button>
            </div>
          </form>
        </div>

        <!-- Liste des todos -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Colonne Todo -->
          <div class="bg-gray-100 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-700">
              À faire ({{ getTodosByStatus('todo').length }})
            </h3>
            @for (todo of getTodosByStatus('todo'); track todo.id) {
              <div
                class="bg-white p-4 rounded-lg shadow-md border-l-4"
                [appHighlight]="
                  todo.priority === 'high'
                    ? 'rgba(239, 68, 68, 0.27)'
                    : todo.priority === 'medium'
                      ? 'rgba(239, 191, 68, 0.61)'
                      : todo.priority === 'low'
                        ? 'rgba(68, 239, 114, 0.39)'
                        : 'transparent'
                "
                [appHighlightDelay]="
                  todo.priority === 'high' || todo.priority === 'medium' || todo.priority === 'low'
                    ? 500
                    : 0
                "
                [ngClass]="{
                  'border-red-400': todo.priority === 'high',
                  'border-yellow-400': todo.priority === 'medium',
                  'border-green-400': todo.priority === 'low',
                }"
              >
                <h4 class="font-semibold">{{ todo.title }}</h4>
                @if (todo.description) {
                  <p class="text-gray-600 text-sm mt-1">{{ todo.description }}</p>
                }
                <div class="flex justify-between items-center mt-2">
                  <span
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                    [class.bg-red-100]="todo.priority === 'high'"
                    [class.text-red-800]="todo.priority === 'high'"
                    [class.bg-yellow-100]="todo.priority === 'medium'"
                    [class.text-yellow-800]="todo.priority === 'medium'"
                    [class.bg-green-100]="todo.priority === 'low'"
                    [class.text-green-800]="todo.priority === 'low'"
                  >
                    {{ todo.priority | priority }}
                  </span>
                  <div class="flex justify-between items-center text-xs text-gray-500">
                    <span>Créé le {{ todo.createdAt | date: 'dd/MM/yyyy' }}</span>
                  </div>
                  <button
                    (click)="updateStatus(todo.id, 'in-progress')"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    Commencer
                  </button>
                </div>
              </div>
            }
          </div>

          <!-- Colonne In Progress -->
          <div class="bg-gray-100 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-blue-700">
              En cours ({{ getTodosByStatus('in-progress').length }})
            </h3>
            @for (todo of getTodosByStatus('in-progress'); track todo.id) {
              <div
                class="bg-white p-4 rounded-lg shadow-sm border-l-4"
                [appHighlight]="
                  todo.priority === 'high'
                    ? 'rgba(239, 68, 68, 0.27)'
                    : todo.priority === 'medium'
                      ? 'rgba(239, 191, 68, 0.61)'
                      : todo.priority === 'low'
                        ? 'rgba(68, 239, 114, 0.39)'
                        : 'transparent'
                "
                [appHighlightDelay]="
                  todo.priority === 'high' || todo.priority === 'medium' || todo.priority === 'low'
                    ? 500
                    : 0
                "
                [ngClass]="{
                  'border-red-400': todo.priority === 'high',
                  'border-yellow-400': todo.priority === 'medium',
                  'border-green-400': todo.priority === 'low',
                }"
              >
                <h4 class="font-semibold">{{ todo.title }}</h4>
                @if (todo.description) {
                  <p class="text-gray-600 text-sm mt-1">{{ todo.description }}</p>
                }
                <div class="flex justify-between items-center mt-2">
                  <span
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                    [class.bg-red-100]="todo.priority === 'high'"
                    [class.text-red-800]="todo.priority === 'high'"
                    [class.bg-yellow-100]="todo.priority === 'medium'"
                    [class.text-yellow-800]="todo.priority === 'medium'"
                    [class.bg-green-100]="todo.priority === 'low'"
                    [class.text-green-800]="todo.priority === 'low'"
                  >
                    {{ todo.priority | priority }}
                  </span>
                  <div class="flex justify-between items-center text-xs text-gray-500">
                    <span>Mis à jour le {{ todo.updatedAt | date: 'dd/MM/yyyy' }}</span>
                  </div>
                  <button
                    (click)="updateStatus(todo.id, 'done')"
                    class="text-green-600 hover:text-green-800"
                  >
                    Terminer
                  </button>
                </div>
              </div>
            }
          </div>

          <!-- Colonne Done -->
          <div class="bg-gray-100 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-green-700">
              Terminé ({{ getTodosByStatus('done').length }})
            </h3>
            @for (todo of getTodosByStatus('done'); track todo.id) {
              <div
                class="bg-white p-4 rounded-lg shadow-sm border-l-4"
                [appHighlight]="
                  todo.priority === 'high'
                    ? 'rgba(239, 68, 68, 0.27)'
                    : todo.priority === 'medium'
                      ? 'rgba(239, 191, 68, 0.44)'
                      : todo.priority === 'low'
                        ? 'rgba(68, 239, 77, 0.19)'
                        : 'transparent'
                "
                [appHighlightDelay]="
                  todo.priority === 'high' || todo.priority === 'medium' || todo.priority === 'low'
                    ? 500
                    : 0
                "
                [ngClass]="{
                  'border-red-400': todo.priority === 'high',
                  'border-yellow-400': todo.priority === 'medium',
                  'border-green-400': todo.priority === 'low',
                }"
              >
                <h4 class="font-semibold line-through">{{ todo.title }}</h4>
                @if (todo.description) {
                  <p class="text-gray-600 text-sm mt-1 line-through">{{ todo.description }}</p>
                }
                <div class="flex justify-between items-center mt-2">
                  <span
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                    [class.bg-red-100]="todo.priority === 'high'"
                    [class.text-red-800]="todo.priority === 'high'"
                    [class.bg-yellow-100]="todo.priority === 'medium'"
                    [class.text-yellow-800]="todo.priority === 'medium'"
                    [class.bg-green-100]="todo.priority === 'low'"
                    [class.text-green-800]="todo.priority === 'low'"
                  >
                    {{ todo.priority | priority }}
                  </span>
                  <div class="flex justify-between items-center text-xs text-gray-500">
                    <span>Terminé le {{ todo.updatedAt | date: 'dd/MM/yyyy' }}</span>
                  </div>
                  <button (click)="deleteTodo(todo.id)" class="text-red-600 hover:text-red-800">
                    Supprimer
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>`,
  styles: [],
})
export class TodoListComponent implements OnInit {
  todos = signal<Todo[]>([]);
  loading = signal(true);
  addingTodo = signal(false);

  newTodo = {
    title: '',
    description: '',
    priority: 'medium' as const,
  };

  // constructor(public todoService: TodoService) {}
  public todoService = inject(TodoService);

  async ngOnInit() {
    await this.loadTodos();
  }

  async loadTodos() {
    try {
      this.loading.set(true);
      const todos = await this.todoService.getAllTodos();
      this.todos.set(todos);
    } catch (error) {
      console.error('Erreur lors du chargement des todos:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async addTodo() {
    if (this.newTodo.title.trim()) {
      try {
        this.addingTodo.set(true);
        await this.todoService.createTodo({
          title: this.newTodo.title,
          description: this.newTodo.description,
          priority: this.newTodo.priority,
        });

        // Recharger les todos
        await this.loadTodos();

        // Réinitialiser le formulaire
        this.newTodo.title = '';
        this.newTodo.description = '';
      } catch (error) {
        console.error("Erreur lors de l'ajout du todo:", error);
      } finally {
        this.addingTodo.set(false);
      }
    }
  }

  async updateStatus(id: number, status: Todo['status']) {
    try {
      await this.todoService.updateTodo(id, { status });
      await this.loadTodos();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  }

  async deleteTodo(id: number) {
    try {
      await this.todoService.deleteTodo(id);
      await this.loadTodos();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  }

  // Méthodes utilitaires
  getTodosByStatus(status: Todo['status']): Todo[] {
    return this.todos().filter((todo) => todo.status === status);
  }
}
