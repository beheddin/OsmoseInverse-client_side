import { Routes } from '@angular/router';
import { LoginComponent } from './Pages/login/login.component';
import { RegistrationComponent } from './Pages/registration/registration.component';
import { ProfileComponent } from './Pages/profile/profile.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { FilialesComponent } from './Pages/filiale/filiales/filiales.component';
import { AteliersComponent } from './Pages/atelier/ateliers/ateliers.component';
import { StationsComponent } from './Pages/station/stations/stations.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'filiales', component: FilialesComponent },
  { path: 'ateliers', component: AteliersComponent },
  { path: 'stations', component: StationsComponent },
  { path: '**', component: DashboardComponent },
];
