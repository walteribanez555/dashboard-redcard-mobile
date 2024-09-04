import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { dashboardGuard } from './core/guards/Dashboard.guard';
import { NgxsModule } from '@ngxs/store';
import { CoverageState } from '../application/states/coverage/coverage.state';
import { CoverageRepository } from '../domain/repositories/coverage.repository';
import { ApiCoverageService } from '../infraestructure/api/api-coverage.service';
import { FileRepository } from '../domain/repositories/file.repository';
import { ApiFilesS3Service } from '../infraestructure/api/api-files-s3.service';
import { DiscountRepository } from '../domain/repositories/discount.repository';
import { ApiDiscountsService } from '../infraestructure/api/api-discounts.service';
import { DiscountState } from '../application/states/discount/discount.state';

const routes: Routes = [
  {
    path: '',
    canActivate: [dashboardGuard],
    loadChildren: () =>
      import('./modules/layout/layout.module').then((m) => m.LayoutModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'errors',
    loadChildren: () =>
      import('./modules/error/error.module').then((m) => m.ErrorModule),
  },
  { path: '**', redirectTo: 'errors/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AngularSvgIconModule.forRoot(),
    NgxsModule.forRoot([CoverageState, DiscountState]),
  ],
  providers: [
    { provide: CoverageRepository, useClass: ApiCoverageService },
    { provide: FileRepository, useClass: ApiFilesS3Service },
    { provide: DiscountRepository, useClass : ApiDiscountsService},
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
