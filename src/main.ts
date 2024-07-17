import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import 'apexcharts/dist/apexcharts.min.js'; //add the script to the main.ts file instead of angular.json, thus the script will only run on the browser (and not on the server )

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
