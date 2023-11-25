import {
  ApplicationConfig,
  LOCALE_ID,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgxMaskModule } from 'ngx-mask';
// import { environment } from 'src/environments/environment';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { AutosizeDirective } from './core/directives/autosize-text-area.diective';
import { JwtInterceptor } from './core/services/jwt-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      AutosizeDirective,
      HttpClientModule,
      TranslateModule.forRoot({
        defaultLanguage: 'es',
      }),
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        registrationStrategy: 'registerWhenStable:30000',
      }),
      FlatpickrModule.forRoot(),
      BrowserModule,
      NgxMaskModule.forRoot()
    ),
    { provide: LOCALE_ID, useValue: 'es-MX' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: LOCALE_ID,
      useValue: 'es-MX',
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    importProvidersFrom([BrowserModule, BrowserAnimationsModule]),
    provideRouter(routes),
  ],
};
