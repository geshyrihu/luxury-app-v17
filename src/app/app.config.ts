import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  LOCALE_ID,
  importProvidersFrom,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgxMaskModule } from 'ngx-mask';
import { routes } from './app.routes';
import { AutosizeDirective } from './core/directives/autosize-text-area.diective';
import { JwtInterceptor } from './core/services/jwt-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      // Módulo de traducción que configura el idioma predeterminado como español
      TranslateModule.forRoot({
        defaultLanguage: 'es',
      }),

      // Directiva que ajusta automáticamente el tamaño de los elementos de formulario
      AutosizeDirective,

      // Módulo que proporciona funcionalidades de animación para Angular
      BrowserAnimationsModule,

      // Módulo que contiene funcionalidades básicas de Angular para el navegador
      BrowserModule,

      // Módulo que configura Flatpickr, una librería de selección de fechas y horas
      FlatpickrModule.forRoot(),

      // Módulo para realizar peticiones HTTP
      HttpClientModule,

      // Módulo para aplicar máscaras a los campos de entrada
      NgxMaskModule.forRoot()
    ),

    {
      // Proveedor para interceptores de HTTP, en este caso, se utiliza JwtInterceptor
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },

    {
      // Proveedor para la estrategia de ubicación basada en hash
      provide: LocationStrategy,
      // useClass: HashLocationStrategy,
      // Dentro de tu lista de providers
      useClass: PathLocationStrategy,
    },

    {
      // Proveedor para establecer el LOCALE_ID en español de México
      provide: LOCALE_ID,
      useValue: 'es-MX',
    },

    // Proveedor para configurar el cliente HTTP con los interceptores desde DI (Inyección de Dependencias)
    provideHttpClient(withInterceptorsFromDi()),

    // Proveedor para configurar las animaciones personalizadas
    provideAnimations(),

    // Proveedor para configurar el enrutador con las rutas definidas
    provideRouter(routes),
  ],
};
