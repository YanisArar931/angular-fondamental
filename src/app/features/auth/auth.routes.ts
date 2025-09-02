import { Routes } from '@angular/router';
import { Login } from './components/login/login.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    // TODO: Ajouter RegisterComponent dans la Partie 2
    redirectTo: '/todos',
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
