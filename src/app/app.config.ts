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
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import {
  provideServiceWorker,
  ServiceWorkerModule,
} from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import Aura from '@primeng/themes/aura';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { providePrimeNG } from 'primeng/config';
import { environment } from 'src/environments/environment';
import { routes } from './app.routes';
import { AutosizeDirective } from './core/directives/autosize-text-area.diective';
import { JwtInterceptor } from './core/services/jwt-interceptor.service';
// Import the functions you need from the SDKs you need
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
      ripple: true,
      zIndex: {
        modal: 1100, // dialog, sidebar
        overlay: 1000, // dropdown, overlaypanel
        menu: 1000, // overlay menus
        tooltip: 1100, // tooltip
      },
    }),
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
      NgxMaskDirective
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
    provideNgxMask(),
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
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
