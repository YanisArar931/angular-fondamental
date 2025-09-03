import { Routes } from '@angular/router';
import { Login } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.components';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
