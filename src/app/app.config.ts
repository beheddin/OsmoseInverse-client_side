import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { BarController, Legend, Colors } from 'chart.js';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),

    //chart.js
    provideCharts(withDefaultRegisterables()),
    //OR
    //provide a minimal configuration to reduce the bundle size
    // provideCharts({ registerables: [BarController, Legend, Colors] }),
  ],
};
