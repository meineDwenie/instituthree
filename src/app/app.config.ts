import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  provideHttpClient,
  //withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';

import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import { withRouterConfig } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideClientHydration(withEventReplay()),
    //provideHttpClient(withFetch()),
    provideHttpClient(withInterceptorsFromDi()),
  ],
};
