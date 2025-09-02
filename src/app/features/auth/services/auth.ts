import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  public currentUser$ = this.currentUser.asReadonly();

  // Mock data utilisateurs
  private users: User[] = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'Normal User',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
      createdAt: new Date(),
    },
  ];

  constructor() {
    // Charger l'utilisateur depuis localStorage si possible
    if (typeof localStorage !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          this.currentUser.set(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error('Impossible de récupérer l’utilisateur depuis localStorage', e);
        localStorage.removeItem('currentUser');
      }
    }
  }

  login(credentials: LoginRequest): Observable<User> {
    const user = this.users.find(
      (u) => u.email === credentials.email && u.password === credentials.password,
    );

    if (user) {
      this.setCurrentUser(user); // Sauvegarde dans localStorage
      return of(user).pipe(delay(500));
    } else {
      return throwError(() => new Error('Email ou mot de passe incorrect'));
    }
  }

  register(userData: RegisterRequest): Observable<User> {
    const existingUser = this.users.find((u) => u.email === userData.email);
    if (existingUser) {
      return throwError(() => new Error('Cet email est déjà utilisé'));
    }

    const newUser: User = {
      id: this.users.length + 1,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: 'user',
      createdAt: new Date(),
    };

    this.users.push(newUser);
    this.setCurrentUser(newUser); // Sauvegarde dans localStorage
    return of(newUser).pipe(delay(500));
  }

  logout(): void {
    this.currentUser.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  getAllUsers(): Observable<User[]> {
    return of(this.users).pipe(delay(300));
  }

  deleteUser(userId: number): Observable<void> {
    const index = this.users.findIndex((u) => u.id === userId);
    if (index !== -1) {
      this.users.splice(index, 1);
      return of(void 0).pipe(delay(300));
    }
    return throwError(() => new Error('Utilisateur non trouvé'));
  }

  getToken(): string | null {
    const user = this.currentUser();
    return user ? `mock-token-${user.id}` : null;
  }

  // Définit l'utilisateur courant et sauvegarde dans localStorage si possible
  private setCurrentUser(user: User): void {
    this.currentUser.set(user);
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } catch (e) {
        console.error('Impossible de sauvegarder l’utilisateur dans localStorage', e);
      }
    }
  }
}
