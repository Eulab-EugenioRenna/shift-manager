import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/fullwidth/fullwidth.component').then(m => m.FullwidthComponent),
    canActivate: [authGuard]
  },
  {
    path: 'auth',
    loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent)

  },{
    path:'**',
    redirectTo: 'auth',
    pathMatch: 'full'
  }
];
