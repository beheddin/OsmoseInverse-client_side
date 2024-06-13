import { Routes } from '@angular/router';
import { LoginComponent } from './Pages/login/login.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { CompteDetailsComponent } from './Pages/compte-details/compte-details.component';
import { ManageComptesComponent } from './Pages/manage-comptes/manage-comptes.component';
import { RegistrationComponent } from './Pages/registration/registration.component';
import { ManageRolesComponent } from './Pages/manage-roles/manage-roles.component';
import { ManageFilialesComponent } from './Pages/manage-filiales/manage-filiales.component';
import { ManageAteliersComponent } from './Pages/manage-ateliers/manage-ateliers.component';
import { ManageStationsComponent } from './Pages/manage-stations/manage-stations.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, //default route
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  //{ path: 'compte', component: CompteDetailsComponent },
  { path: 'comptes', component: ManageComptesComponent },
  { path: 'roles', component: ManageRolesComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'parametrage/filiales', component: ManageFilialesComponent },
  { path: 'parametrage/ateliers', component: ManageAteliersComponent },
  { path: 'parametrage/stations', component: ManageStationsComponent },
  { path: '**', component: DashboardComponent },
];
