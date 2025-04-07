import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { EmployeeListComponent } from './components/employee/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee/employee-form/employee-form.component';
import { EmployeeDetailsComponent } from './components/employee/employee-details/employee-details.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'employees',
    component: EmployeeListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'employees/add',
    component: EmployeeFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'employees/edit/:id',
    component: EmployeeFormComponent,
    canActivate: [authGuard],
    data: { renderMode: 'browser' }
  },
  {
    path: 'employees/details/:id',
    component: EmployeeDetailsComponent,
    canActivate: [authGuard],
    data: { renderMode: 'browser' }
  },
  { path: '**', redirectTo: '/employees' }
];
