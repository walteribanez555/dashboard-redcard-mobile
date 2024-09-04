import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app/presentation/app-routing.module';
import { environment } from './environments/environment.development';
import { errorInterceptor } from './app/presentation/core/interceptor/error.interceptor';
import { sessionInterceptor } from './app/presentation/core/interceptor/session.interceptor';
import { AppComponent } from './app/presentation/app.component';
import { provideStore } from '@ngxs/store';
import { CoverageState } from './app/application/states/coverage/coverage.state';
import { CoverageRepository } from './app/domain/repositories/coverage.repository';
import { ApiCoverageService } from './app/infraestructure/api/api-coverage.service';
import { DiscountRepository } from './app/domain/repositories/discount.repository';
import { ApiDiscountsService } from './app/infraestructure/api/api-discounts.service';

if (environment.production) {
  enableProdMode();
  //show this warning only on prod mode
  if (window) {
    selfXSSWarning();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppRoutingModule),
    provideAnimations(),
    provideHttpClient(withInterceptors([errorInterceptor, sessionInterceptor])),
  ],
}).catch((err) => console.error(err));

function selfXSSWarning() {
  setTimeout(() => {
    console.log(
      '%c** STOP **',
      'font-weight:bold; font: 2.5em Arial; color: white; background-color: #e11d48; padding-left: 15px; padding-right: 15px; border-radius: 25px; padding-top: 5px; padding-bottom: 5px;'
    );
    console.log(
      `\n%cThis is a browser feature intended for developers. Using this console may allow attackers to impersonate you and steal your information sing an attack called Self-XSS. Do not enter or paste code that you do not understand.`,
      'font-weight:bold; font: 2em Arial; color: #e11d48;'
    );
  });
}
