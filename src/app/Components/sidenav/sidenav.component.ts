import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';

import { MaterialModules } from '../../material.modules';
import { SidenavService } from '../../Services/sidenav.service';
import { MenuBtnItemsInterface } from '../../Interfaces/menu-btn-items.interface';
import { ExpansionPanelComponent } from './expansion-panel/expansion-panel.component';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MaterialModules,
    NgFor,
    NgIf,
    NgClass,
    ExpansionPanelComponent,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit, OnDestroy {
  private sidenavSubscription!: Subscription;
  isSidenavOpen = false;
  isPanelOpen: boolean = false;

  constructor(private sidenavService: SidenavService, private router: Router) {}

  menuBtnItems: MenuBtnItemsInterface[] = [
    {
      label: 'Gestion des Comptes',
      route: 'comptes',
    },
    {
      label: 'Paramétrage et Suivi',
      subItems: [
        {
          label: 'Tableau de Bord',
          route: 'dashboard',
        },
        {
          label: 'Objectifs',
          route: 'objectifs',
        },
        {
          label: 'Checklists',
          route: 'checklists',
        },
        { label: 'Paramètres des Stations', route: 'parametres-stations' },
        { label: 'Paramètres des Suivis', route: 'parametres-suivis' },
        { label: 'Paramètres des Types des Suivis', route: 'types-suivis' },
        {
          label: 'Paramètres des Suivis Quotidiens',
          route: 'suivis-quotidiens',
        },
      ],
    },
    {
      label: 'Paramétrage',
      subItems: [
        { label: 'Paramétrage des Filiales', route: 'filiales' },
        { label: 'Paramétrage des Ateliers', route: 'ateliers' },
        { label: 'Paramétrage des Stations', route: 'stations' },
        {
          label: "Paramétrage des Sources d'Eau",
          route: 'sources-eau', //not 'sources-eau/bassins' to keep the selected btn green whatever tab Bassins/Puits is selected
        },
        { label: 'Paramétrage des Unités', route: 'unites' },
        { label: 'Paramétrage des Fournisseurs', route: 'fournisseurs' },
        {
          label: 'Paramétrage des Types de Cartouches',
          route: 'types-cartouches',
        },
        {
          label: 'Paramétrage des Types de Membranes',
          route: 'types-membranes',
        },
        {
          label: 'Paramétrage des Produits Chimiques',
          route: 'produits-chimiques',
        },
        {
          label: 'Paramétrage des Catégories de Produits Chimiques',
          route: 'categories-produits-chimiques',
        },
        {
          label: 'Paramétrage des Dosages Chimiques',
          route: 'dosages-chimiques',
        },
      ],
    },
    {
      label: 'Gestion des Équipements',
      subItems: [
        { label: 'Équipements', route: 'equipements' },
        { label: 'Nature des Équipements', route: 'natures-equipements' },
        { label: "Type d'Équipements", route: 'types-equipements' },
      ],
    },
    {
      label: 'Gestion des Entretiens et des Lavages',
      subItems: [
        { label: 'Entretien des Stations', route: 'entretiens-stations' },
        {
          label: "Entretien des Sources d'Eau",
          route: 'entretiens-sources-eau',
        },
        {
          label: 'Lavages Chimiques',
          route: 'lavages-chimiques',
        },
      ],
    },
    {
      label: 'Gestion des Produits Consommés',
      subItems: [
        { label: 'Gestion des Cartouches', route: 'cartouches' },
        {
          label: 'Gestion des Membranes',
          route: 'membranes',
        },
      ],
    },

    // {
    //   label: 'Gestion des Équipements',
    //   subItems: [
    //     { label: 'Equipements', route: 'equipements' },
    //     { label: 'NaturesEquipements', route: 'naturesEquipements' },
    //     { label: 'TypesEquipements', route: 'typesEquipements' },
    //   ],
    // },
  ];

  ngOnInit() {
    this.sidenavSubscription = this.sidenavService
      .getSidenavState()
      .subscribe((isOpen: boolean) => {
        this.isSidenavOpen = isOpen;
      });
  }

  ngOnDestroy(): void {
    if (this.sidenavSubscription) {
      this.sidenavSubscription.unsubscribe();
    }
  }

  toggleSidenav() {
    this.sidenavService.toggleSidenav();
  }
}
