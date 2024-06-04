import { Routes } from '@angular/router';
import { LoginComponent } from './Pages/login/login.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { UserProfileComponent } from './Pages/user-profile/user-profile.component';
import { ManageUsersComponent } from './Pages/manage-users/manage-users.component';
import { RegistrationComponent } from './Pages/registration/registration.component';
import { ManageRolesComponent } from './Pages/manage-roles/manage-roles.component';
import { ManageFilialesComponent } from './Pages/manage-filiales/manage-filiales.component';
import { ManageAteliersComponent } from './Pages/manage-ateliers/manage-ateliers.component';
import { ManageStationsComponent } from './Pages/manage-stations/manage-stations.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, //default route
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'users', component: ManageUsersComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'roles', component: ManageRolesComponent },
  { path: 'filiales', component: ManageFilialesComponent },
  { path: 'ateliers', component: ManageAteliersComponent },
  { path: 'stations', component: ManageStationsComponent },
  { path: '**', component: DashboardComponent },
];
