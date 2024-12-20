import {
  IMAGE_CONFIG,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  LOCALE_ID,
} from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import {
  provideServiceWorker,
  ServiceWorkerModule,
} from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgxMaskModule } from 'ngx-mask';
import { environment } from 'src/environments/environment';
import { routes } from './app.routes';
import { AutosizeDirective } from './core/directives/autosize-text-area.diective';
import { JwtInterceptor } from './core/services/jwt-interceptor.service';
// Import the functions you need from the SDKs you need
export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true,
      },
    },
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

      ServiceWorkerModule.register('custom-sw.js', {
        enabled: environment.production,
      }),
      // AngularFireModule.initializeApp(environment.firebaseConfig),

      // provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
      // provideFirestore(() => getFirestore()),

      // Módulo que configura Flatpickr, una librería de selección de fechas y horas
      FlatpickrModule.forRoot(),
      // Módulo para realizar peticiones HTTP
      // HttpClientModule,
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

    // providerClientHydration(withEventReplay()),

    provideHttpClient(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
  ],
};
