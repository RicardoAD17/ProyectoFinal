import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { enableProdMode, isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

import { initializeApp } from "firebase/app";
import { environment } from './environments/environments';

const app = initializeApp(environment.firebase);

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent,  {
  providers: [
    provideHttpClient(), 
    provideRouter(routes), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })
  ]
})