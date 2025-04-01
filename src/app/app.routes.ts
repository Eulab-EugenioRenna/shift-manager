import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/fullwidth/fullwidth.component').then(m => m.FullwidthComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'calendario',
        loadComponent: () => import('./components/calendar/calendar.component').then(m => m.CalendarComponent)
      }
    ]
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
