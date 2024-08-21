import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { dashboardGuard } from './core/guards/Dashboard.guard';

const routes: Routes = [
  {
    path: '',
    canActivate : [dashboardGuard],
    loadChildren: () => import('./modules/layout/layout.module').then((m) => m.LayoutModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'errors',
    loadChildren: () => import('./modules/error/error.module').then((m) => m.ErrorModule),
  },
  { path: '**', redirectTo: 'errors/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), AngularSvgIconModule.forRoot()],

  exports: [RouterModule],
})
export class AppRoutingModule {}
