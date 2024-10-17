import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './account/login/login.component';
import { DashboardComponent } from './pages/pages/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layouts/layout.component';
import { loginGuard } from './core/guards/login.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/account/login', pathMatch: 'full' },
  {
    path: 'pages',
    component: LayoutComponent,
    loadChildren: () =>
      import('./pages/pages/pages.module').then((m) => m.PagesModule),
    canActivate: [authGuard],
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./account/account.module').then((m) => m.AccountModule),
    canActivate: [loginGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
