import { Routes } from '@angular/router';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { ErrorPageComponent } from './Components/error-page/error-page.component';
import { LoginComponent } from './Components/login/login.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { ChangePasswordFormComponent } from './Components/Module-Paramétrage/comptes/change-password-form/change-password-form.component';
import { ComptesComponent } from './Components/Module-Paramétrage/comptes/comptes.component';
import { CompteFormComponent } from './Components/Module-Paramétrage/comptes/compte-form/compte-form.component';
import { FilialeFormComponent } from './Components/Module-Paramétrage/filiales/filiale-form/filiale-form.component';
import { AtelierFormComponent } from './Components/Module-Paramétrage/ateliers/atelier-form/atelier-form.component';
import { StationFormComponent } from './Components/Module-Paramétrage/stations/station-form/station-form.component';
import { FilialesComponent } from './Components/Module-Paramétrage/filiales/filiales.component';
import { AteliersComponent } from './Components/Module-Paramétrage/ateliers/ateliers.component';
import { StationsComponent } from './Components/Module-Paramétrage/stations/stations.component';
import { SourcesEauComponent } from './Components/Module-Paramétrage/sources-eau/sources-eau.component';
import { BassinsComponent } from './Components/Module-Paramétrage/sources-eau/bassins/bassins.component';
import { BassinFormComponent } from './Components/Module-Paramétrage/sources-eau/bassins/bassin-form/bassin-form.component';
import { PuitsComponent } from './Components/Module-Paramétrage/sources-eau/puits/puits.component';
import { PuitFormComponent } from './Components/Module-Paramétrage/sources-eau/puits/puit-form/puit-form.component';
import { StationsEntretiensComponent } from './Components/Module-Gestion-Entretiens-Et-Lavages/entretiens-stations/entretiens-stations.component';
import { EntretienStationFormComponent } from './Components/Module-Gestion-Entretiens-Et-Lavages/entretiens-stations/entretien-station-form/entretien-station-form.component';
import { SourcesEauEntretiensComponent } from './Components/Module-Gestion-Entretiens-Et-Lavages/entretiens-sources-eau/entretiens-sources-eau.component';
import { EntretienSourceEauFormComponent } from './Components/Module-Gestion-Entretiens-Et-Lavages/entretiens-sources-eau/entretien-source-eau-form/entretien-source-eau-form.component';
import { FournisseursComponent } from './Components/Module-Paramétrage/fournisseurs/fournisseurs.component';
import { FournisseurFormComponent } from './Components/Module-Paramétrage/fournisseurs/fournisseur-form/fournisseur-form.component';
import { EquipementsComponent } from './Components/Module-Gestion-Équipements/equipments/equipements.component';
import { EquipementFormComponent } from './Components/Module-Gestion-Équipements/equipments/equipement-form/equipement-form.component';
import { NaturesEquipementsComponent } from './Components/Module-Gestion-Équipements/natures-equipements/natures-equipements.component';
import { NatureEquipementFormComponent } from './Components/Module-Gestion-Équipements/natures-equipements/nature-equipement-form/nature-equipement-form.component';
import { TypesEquipementsComponent } from './Components/Module-Gestion-Équipements/types-equipements/types-equipements.component';
import { TypeEquipementFormComponent } from './Components/Module-Gestion-Équipements/types-equipements/type-equipement-form/type-equipement-form.component';
import { MembraneFormComponent } from './Components/Module-Gestion-Produits-Consommés/membranes/membrane-form/membrane-form.component';
import { MembranesComponent } from './Components/Module-Gestion-Produits-Consommés/membranes/membranes.component';
import { CartouchesComponent } from './Components/Module-Gestion-Produits-Consommés/cartouches/cartouches.component';
import { CartoucheFormComponent } from './Components/Module-Gestion-Produits-Consommés/cartouches/cartouche-form/cartouche-form.component';
import { UnitesComponent } from './Components/Module-Paramétrage/unites/unites.component';
import { UniteFormComponent } from './Components/Module-Paramétrage/unites/unite-form/unite-form.component';
import { TypesCartouchesComponent } from './Components/Module-Paramétrage/types-cartouches/types-cartouches.component';
import { TypeCartoucheFormComponent } from './Components/Module-Paramétrage/types-cartouches/type-cartouche-form/type-cartouche-form.component';
import { TypesMembranesComponent } from './Components/Module-Paramétrage/types-membranes/types-membranes.component';
import { TypeMembraneFormComponent } from './Components/Module-Paramétrage/types-membranes/type-membrane-form/type-membrane-form.component';
import { ProduitsChimiquesComponent } from './Components/Module-Paramétrage/produits-chimiques/produits-chimiques.component';
import { ProduitChimiqueFormComponent } from './Components/Module-Paramétrage/produits-chimiques/produit-chimique-form/produit-chimique-form.component';
import { CategoriesProduitsChimiquesComponent } from './Components/Module-Paramétrage/categories-produits-chimiques/categories-produits-chimiques.component';
import { CategorieProduitChimiqueFormComponent } from './Components/Module-Paramétrage/categories-produits-chimiques/categorie-produit-chimique-form/categorie-produit-chimique-form.component';
import { LavagesChimiquesComponent } from './Components/Module-Gestion-Entretiens-Et-Lavages/lavages-chimiques/lavages-chimiques.component';
import { LavageChimiqueFormComponent } from './Components/Module-Gestion-Entretiens-Et-Lavages/lavages-chimiques/lavage-chimique-form/lavage-chimique-form.component';
import { DosagesChimiquesComponent } from './Components/Module-Paramétrage/dosages-chimiques/dosages-chimiques.component';
import { DosageChimiqueFormComponent } from './Components/Module-Paramétrage/dosages-chimiques/dosage-chimique-form/dosage-chimique-form.component';
import { ParametresStationsComponent } from './Components/Module-Paramétrage-Et-Suivi/parametres-stations/parametres-stations.component';
import { ParametreStationFormComponent } from './Components/Module-Paramétrage-Et-Suivi/parametres-stations/parametre-station-form/parametre-station-form.component';
import { ParametresSuivisComponent } from './Components/Module-Paramétrage-Et-Suivi/parametres-suivis/parametres-suivis.component';
import { ParametreSuiviFormComponent } from './Components/Module-Paramétrage-Et-Suivi/parametres-suivis/parametre-suivi-form/parametre-suivi-form.component';
import { TypesSuivisComponent } from './Components/Module-Paramétrage-Et-Suivi/types-suivis/types-suivis.component';
import { TypeSuiviFormComponent } from './Components/Module-Paramétrage-Et-Suivi/types-suivis/type-suivi-form/type-suivi-form.component';
import { SuivisQuotidiensComponent } from './Components/Module-Paramétrage-Et-Suivi/suivis-quotidiens/suivis-quotidiens.component';
import { SuiviQuotidienFormComponent } from './Components/Module-Paramétrage-Et-Suivi/suivis-quotidiens/suivi-quotidien-form/suivi-quotidien-form.component';
import { ObjectifsComponent } from './Components/Module-Paramétrage-Et-Suivi/objectifs/objectifs.component';
import { ObjectifFormComponent } from './Components/Module-Paramétrage-Et-Suivi/objectifs/objectif-form/objectif-form.component';
import { ChecklistsComponent } from './Components/Module-Paramétrage-Et-Suivi/checklists/checklists.component';
import { ChecklistFormComponent } from './Components/Module-Paramétrage-Et-Suivi/checklists/checklist-form/checklist-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, //default route
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      {
        path: 'change-password/:id',
        component: ChangePasswordFormComponent,
      },
    ],
  },
  {
    path: 'comptes',
    component: ComptesComponent,
    children: [
      { path: 'add', component: CompteFormComponent },
      { path: 'edit/:id', component: CompteFormComponent },
      { path: 'change-password/:id', component: ChangePasswordFormComponent },
    ],
  },
  {
    path: 'filiales',
    component: FilialesComponent,
    children: [
      { path: 'add', component: FilialeFormComponent },
      { path: 'edit/:id', component: FilialeFormComponent },
    ],
  },
  {
    path: 'ateliers',
    component: AteliersComponent,
    children: [
      { path: 'add', component: AtelierFormComponent },
      { path: 'edit/:id', component: AtelierFormComponent },
    ],
  },
  {
    path: 'stations',
    component: StationsComponent,
    children: [
      { path: 'add', component: StationFormComponent },
      { path: 'edit/:id', component: StationFormComponent },
    ],
  },
  {
    path: 'sources-eau',
    component: SourcesEauComponent,
    children: [
      {
        path: 'bassins',
        component: BassinsComponent,
        children: [
          { path: 'add', component: BassinFormComponent },
          { path: 'edit/:id', component: BassinFormComponent },
        ],
      },
      {
        path: 'puits',
        component: PuitsComponent,
        children: [
          { path: 'add', component: PuitFormComponent },
          { path: 'edit/:id', component: PuitFormComponent },
        ],
      },
      { path: '', redirectTo: 'bassins', pathMatch: 'full' }, //  when route is 'sources-eau' redirect to 'bassins'
    ],
  },
  {
    path: 'entretiens-stations',
    component: StationsEntretiensComponent,
    children: [
      { path: 'add', component: EntretienStationFormComponent },
      { path: 'edit/:id', component: EntretienStationFormComponent },
    ],
  },
  {
    path: 'entretiens-sources-eau',
    component: SourcesEauEntretiensComponent,
    children: [
      { path: 'add', component: EntretienSourceEauFormComponent },
      { path: 'edit/:id', component: EntretienSourceEauFormComponent },
    ],
  },
  {
    path: 'fournisseurs',
    component: FournisseursComponent,
    children: [
      { path: 'add', component: FournisseurFormComponent },
      { path: 'edit/:id', component: FournisseurFormComponent },
    ],
  },
  {
    path: 'equipements',
    component: EquipementsComponent,
    children: [
      { path: 'add', component: EquipementFormComponent },
      { path: 'edit/:id', component: EquipementFormComponent },
    ],
  },
  {
    path: 'natures-equipements',
    component: NaturesEquipementsComponent,
    children: [
      { path: 'add', component: NatureEquipementFormComponent },
      { path: 'edit/:id', component: NatureEquipementFormComponent },
    ],
  },
  {
    path: 'types-equipements',
    component: TypesEquipementsComponent,
    children: [
      { path: 'add', component: TypeEquipementFormComponent },
      { path: 'edit/:id', component: TypeEquipementFormComponent },
    ],
  },
  {
    path: 'cartouches',
    component: CartouchesComponent,
    children: [
      { path: 'add', component: CartoucheFormComponent },
      { path: 'edit/:id', component: CartoucheFormComponent },
    ],
  },
  {
    path: 'types-cartouches',
    component: TypesCartouchesComponent,
    children: [
      { path: 'add', component: TypeCartoucheFormComponent },
      { path: 'edit/:id', component: TypeCartoucheFormComponent },
    ],
  },
  {
    path: 'membranes',
    component: MembranesComponent,
    children: [
      { path: 'add', component: MembraneFormComponent },
      { path: 'edit/:id', component: MembraneFormComponent },
    ],
  },
  {
    path: 'types-membranes',
    component: TypesMembranesComponent,
    children: [
      { path: 'add', component: TypeMembraneFormComponent },
      { path: 'edit/:id', component: TypeMembraneFormComponent },
    ],
  },
  {
    path: 'unites',
    component: UnitesComponent,
    children: [
      { path: 'add', component: UniteFormComponent },
      { path: 'edit/:id', component: UniteFormComponent },
    ],
  },
  {
    path: 'produits-chimiques',
    component: ProduitsChimiquesComponent,
    children: [
      { path: 'add', component: ProduitChimiqueFormComponent },
      { path: 'edit/:id', component: ProduitChimiqueFormComponent },
    ],
  },
  {
    path: 'categories-produits-chimiques',
    component: CategoriesProduitsChimiquesComponent,
    children: [
      { path: 'add', component: CategorieProduitChimiqueFormComponent },
      { path: 'edit/:id', component: CategorieProduitChimiqueFormComponent },
    ],
  },
  {
    path: 'lavages-chimiques',
    component: LavagesChimiquesComponent,
    children: [
      { path: 'add', component: LavageChimiqueFormComponent },
      { path: 'edit/:id', component: LavageChimiqueFormComponent },
    ],
  },
  {
    path: 'dosages-chimiques',
    component: DosagesChimiquesComponent,
    children: [
      { path: 'add', component: DosageChimiqueFormComponent },
      { path: 'edit/:id', component: DosageChimiqueFormComponent },
    ],
  },
  {
    path: 'parametres-stations',
    component: ParametresStationsComponent,
    children: [
      { path: 'add', component: ParametreStationFormComponent },
      { path: 'edit/:id', component: ParametreStationFormComponent },
    ],
  },
  {
    path: 'parametres-suivis',
    component: ParametresSuivisComponent,
    children: [
      { path: 'add', component: ParametreSuiviFormComponent },
      { path: 'edit/:id', component: ParametreSuiviFormComponent },
    ],
  },
  {
    path: 'types-suivis',
    component: TypesSuivisComponent,
    children: [
      { path: 'add', component: TypeSuiviFormComponent },
      { path: 'edit/:id', component: TypeSuiviFormComponent },
    ],
  },
  {
    path: 'suivis-quotidiens',
    component: SuivisQuotidiensComponent,
    children: [
      { path: 'add', component: SuiviQuotidienFormComponent },
      { path: 'edit/:id', component: SuiviQuotidienFormComponent },
    ],
  },
  {
    path: 'objectifs',
    component: ObjectifsComponent,
    children: [
      { path: 'add', component: ObjectifFormComponent },
      { path: 'edit/:id', component: ObjectifFormComponent },
    ],
  },
  {
    path: 'checklists',
    component: ChecklistsComponent,
    children: [
      { path: 'add', component: ChecklistFormComponent },
      { path: 'edit/:id', component: ChecklistFormComponent },
    ],
  },
  { path: 'error', component: ErrorPageComponent },
  { path: '**', redirectTo: 'error' },
];
