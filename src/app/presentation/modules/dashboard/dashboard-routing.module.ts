import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ServiceMobileComponent } from './pages/service-mobile/service-mobile.component';
import { LinksComponent } from './pages/links/links.component';
import { CoveragesComponent } from './pages/coverages/coverages.component';
import { DiscountsComponent } from './pages/discounts/discounts.component';
// import { ListComponent } from "./pages/list/list.component";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'services', component: ServiceMobileComponent },
      { path: 'links', component: LinksComponent },
      { path: 'coverages', component: CoveragesComponent },
      { path : 'discounts' , component : DiscountsComponent},
      { path: '', redirectTo: 'services', pathMatch: 'full' },

      // { path : '', redirectTo : 'list', pathMatch : 'full' },
    ],
  },

  { path: '**', redirectTo: 'errors/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
