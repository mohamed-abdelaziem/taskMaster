import { Routes } from '@angular/router';
import { authenticationGuard } from './core/guards/authentication-guard';

export const routes: Routes = [

  {
    path : "",
    redirectTo : "/home",
    pathMatch : "full"
  }
  ,
  {
    path: 'home',
    loadComponent: () =>
      import('./core/layout/not-logged-user/not-logged-user').then((f) => f.NotLoggedUser),
    title: 'Home',
    children: [
      {
        path: '',
        loadComponent: () => import('./core/pages/home/home').then((f) => f.Home),
      },
      {
        path: 'login',
        loadComponent: () => import('./core/pages/login/login').then((f) => f.Login),
        title: 'Login',
      },
      {
        path: 'register',
        loadComponent: () => import('./core/pages/register/register').then((f) => f.Register),
        title: 'Register',
      },
    ],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./core/layout/logged-user/logged-user').then((f) => f.LoggedUser),
    title: 'Dashboard',
    canActivate: [authenticationGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./core/pages/dashboard/dashboard').then((f) => f.Dashboard),
        title: 'Dashboard',
      },
      {
        path: 'tasks',
        loadComponent: () => import('./core/pages/tasks/tasks').then((f) => f.Tasks),
        title: 'Tasks',
      },
      {
        path: 'reminders',
        loadComponent: () => import('./core/pages/reminders/reminders').then((f) => f.Reminders),
        title: 'Reminders',
      },

      {
        path: 'task-details/:id',
        loadComponent: () => import('./core/pages/task-details/task-details').then((f) => f.TaskDetails),
        title: 'Task Details',
      },

        {
        path: 'reminder-details/:id',
        loadComponent: () => import('./core/pages/reminder-details/reminder-details').then((f) => f.ReminderDetails),
        title: 'Reminder Details',
      },

      
      {
        path: 'goals',
        loadComponent: () => import('./core/pages/goal/goal').then((f) => f.Goal),
        title: 'Goals',
      },

      {
        path: 'new-goal',
        loadComponent: () => import('./core/pages/new-goal/new-goal').then((f) => f.NewGoal),
        title: 'New Goal',
      },

        {
        path: 'update-goal/:id',
        loadComponent: () => import('./core/pages/update-goal/update-goal').then((f) => f.UpdateGoal),
        title: 'Update Goal',
      }
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./core/pages/not-found/not-found').then((f) => f.NotFound),
    title: 'Not Found',
  },
];
