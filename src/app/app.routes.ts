import { Routes } from '@angular/router';
import { canActivatePath } from './services/guards/authentication.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./authentication/login/login.page').then(m => m.LoginPage),
  },
  {
    path: '',
    redirectTo: '/login', 
    pathMatch: 'full',
  },
  {
    path: 'home',
    canActivate: [canActivatePath], 
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
  },
  {
    path: 'reset',
    loadComponent: () => import('./authentication/reset/reset.page').then(m => m.ResetPage),
  },
  {
    path: 'update-password',
    loadComponent: () => import('./authentication/updatePassword/updatePassword.page').then(m => m.UpdatePasswordPage),
  },
  {
    path: 'qr', 
    loadComponent: () => import('./generar-qr/generar-qr.page').then(m => m.GenerarQRPage),
  },
  {
    path: '**',
    redirectTo: '/login', 
    pathMatch: 'full',
  },
];
